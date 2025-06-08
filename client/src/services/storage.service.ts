// src/services/storage.service.ts

import { z } from 'zod';

// Storage Configuration Schema
const StorageConfigSchema = z.object({
  prefix: z.string(),
  encryptionKey: z.string().optional(),
  compression: z.boolean().optional(),
  maxSize: z.number().optional(), // in bytes
  expiry: z.boolean().optional(),
  defaultExpiry: z.number().optional(), // in milliseconds
});

interface StorageConfig extends z.infer<typeof StorageConfigSchema> {}

interface StorageItem<T> {
  value: T;
  timestamp: number;
  expiry?: number;
  metadata?: Record<string, any>;
}

interface StorageMetrics {
  totalItems: number;
  totalSize: number;
  oldestItem: string | null;
  newestItem: string | null;
}

class StorageService {
  private static instance: StorageService;
  private config: StorageConfig;
  private storageEngine: Storage;
  private compressionWorker?: Worker;
  private metrics: StorageMetrics;

  private constructor(config: StorageConfig) {
    // Validate configuration
    try {
      StorageConfigSchema.parse(config);
    } catch (error) {
      console.error('Invalid storage configuration:', error);
      throw error;
    }

    this.config = config;
    this.storageEngine = typeof window !== 'undefined' ? window.localStorage : ({} as Storage);
    this.metrics = this.initializeMetrics();

    if (config.compression) {
      this.initializeCompressionWorker();
    }

    // Initialize storage monitoring
    this.monitorStorageSize();
  }

  public static getInstance(config: StorageConfig): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService(config);
    }
    return StorageService.instance;
  }

  private initializeMetrics(): StorageMetrics {
    let oldestTimestamp = Infinity;
    let newestTimestamp = 0;
    let oldestKey: string | null = null;
    let newestKey: string | null = null;
    let totalSize = 0;

    for (let i = 0; i < this.storageEngine.length; i++) {
      const key = this.storageEngine.key(i);
      if (key && key.startsWith(this.config.prefix)) {
        try {
          const item = this.getItem<any>(key.slice(this.config.prefix.length));
          if (item) {
            const timestamp = item.timestamp;
            totalSize += JSON.stringify(item).length;

            if (timestamp < oldestTimestamp) {
              oldestTimestamp = timestamp;
              oldestKey = key;
            }
            if (timestamp > newestTimestamp) {
              newestTimestamp = timestamp;
              newestKey = key;
            }
          }
        } catch (error) {
          console.error(`Error processing storage item ${key}:`, error);
        }
      }
    }

    return {
      totalItems: this.storageEngine.length,
      totalSize,
      oldestItem: oldestKey?.slice(this.config.prefix.length) || null,
      newestItem: newestKey?.slice(this.config.prefix.length) || null,
    };
  }

  private initializeCompressionWorker(): void {
    if (typeof Worker !== 'undefined') {
      this.compressionWorker = new Worker('/workers/compression.worker.js');
    }
  }

  private monitorStorageSize(): void {
    if (this.config.maxSize) {
      setInterval(() => {
        this.enforceStorageLimit();
      }, 60000); // Check every minute
    }
  }

  private async enforceStorageLimit(): Promise<void> {
    if (!this.config.maxSize) return;

    const currentSize = this.metrics.totalSize;
    if (currentSize > this.config.maxSize) {
      const itemsToRemove = [];
      let sizeToFree = currentSize - this.config.maxSize;

      // Collect items to remove
      for (let i = 0; i < this.storageEngine.length; i++) {
        const key = this.storageEngine.key(i);
        if (key && key.startsWith(this.config.prefix)) {
          try {
            const item = this.getItem<any>(key.slice(this.config.prefix.length));
            if (item) {
              itemsToRemove.push({
                key: key.slice(this.config.prefix.length),
                size: JSON.stringify(item).length,
                timestamp: item.timestamp,
              });
            }
          } catch (error) {
            console.error(`Error processing storage item ${key}:`, error);
          }
        }
      }

      // Sort by oldest first
      itemsToRemove.sort((a, b) => a.timestamp - b.timestamp);

      // Remove items until we free enough space
      for (const item of itemsToRemove) {
        this.removeItem(item.key);
        sizeToFree -= item.size;
        if (sizeToFree <= 0) break;
      }

      // Update metrics
      this.metrics = this.initializeMetrics();
    }
  }

  private getFullKey(key: string): string {
    return `${this.config.prefix}${key}`;
  }

  private async compress(data: string): Promise<string> {
    if (!this.config.compression || !this.compressionWorker) {
      return data;
    }

    return new Promise((resolve, reject) => {
      this.compressionWorker!.onmessage = (e) => resolve(e.data);
      this.compressionWorker!.onerror = (e) => reject(e);
      this.compressionWorker!.postMessage({ action: 'compress', data });
    });
  }

  private async decompress(data: string): Promise<string> {
    if (!this.config.compression || !this.compressionWorker) {
      return data;
    }

    return new Promise((resolve, reject) => {
      this.compressionWorker!.onmessage = (e) => resolve(e.data);
      this.compressionWorker!.onerror = (e) => reject(e);
      this.compressionWorker!.postMessage({ action: 'decompress', data });
    });
  }

  // Public methods
  public async setItem<T>(
    key: string,
    value: T,
    options: {
      expiry?: number;
      metadata?: Record<string, any>;
    } = {}
  ): Promise<void> {
    try {
      const item: StorageItem<T> = {
        value,
        timestamp: Date.now(),
        expiry: options.expiry || this.config.defaultExpiry,
        metadata: options.metadata,
      };

      let serializedData = JSON.stringify(item);
      if (this.config.compression) {
        serializedData = await this.compress(serializedData);
      }

      this.storageEngine.setItem(this.getFullKey(key), serializedData);
      this.metrics = this.initializeMetrics();

      // Log storage activity
      await this.logStorageActivity('SET', {
        key,
        size: serializedData.length,
        hasExpiry: !!item.expiry,
      });
    } catch (error) {
      console.error(`Error setting storage item ${key}:`, error);
      throw error;
    }
  }

  public async getItem<T>(key: string): Promise<StorageItem<T> | null> {
    try {
      const serializedData = this.storageEngine.getItem(this.getFullKey(key));
      if (!serializedData) return null;

      let data = serializedData;
      if (this.config.compression) {
        data = await this.decompress(serializedData);
      }

      const item: StorageItem<T> = JSON.parse(data);

      // Check expiry
      if (item.expiry && Date.now() > item.timestamp + item.expiry) {
        this.removeItem(key);
        return null;
      }

      await this.logStorageActivity('GET', {
        key,
        size: serializedData.length,
        age: Date.now() - item.timestamp,
      });

      return item;
    } catch (error) {
      console.error(`Error getting storage item ${key}:`, error);
      return null;
    }
  }

  public removeItem(key: string): void {
    try {
      this.storageEngine.removeItem(this.getFullKey(key));
      this.metrics = this.initializeMetrics();

      this.logStorageActivity('REMOVE', { key });
    } catch (error) {
      console.error(`Error removing storage item ${key}:`, error);
    }
  }

  public clear(): void {
    try {
      const keysToRemove = [];
      for (let i = 0; i < this.storageEngine.length; i++) {
        const key = this.storageEngine.key(i);
        if (key && key.startsWith(this.config.prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => this.storageEngine.removeItem(key));
      this.metrics = this.initializeMetrics();

      this.logStorageActivity('CLEAR', {
        itemsCleared: keysToRemove.length,
      });
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  // Utility methods
  public getMetrics(): StorageMetrics {
    return { ...this.metrics };
  }

  public getKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < this.storageEngine.length; i++) {
      const key = this.storageEngine.key(i);
      if (key && key.startsWith(this.config.prefix)) {
        keys.push(key.slice(this.config.prefix.length));
      }
    }
    return keys;
  }
}

// Helper function to log storage activity
async function logStorageActivity(
  type: 'SET' | 'GET' | 'REMOVE' | 'CLEAR',
  metadata: Record<string, any>
) {
  try {
    await fetch('/api/activity-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: `STORAGE_${type}`,
        description: `Storage ${type.toLowerCase()} operation`,
        metadata,
        createdBy: 'Vishalsnw',
        timestamp: '2025-06-08 07:33:44',
      }),
    });
  } catch (error) {
    console.error('Error logging storage activity:', error);
  }
}

// Export singleton instance
export const storageService = StorageService.getInstance({
  prefix: 'app_',
  compression: true,
  maxSize: 5 * 1024 * 1024, // 5MB
  expiry: true,
  defaultExpiry: 24 * 60 * 60 * 1000, // 24 hours
});

export default storageService;
