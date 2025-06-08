// hooks/useLocalStorage.ts

import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';

interface StorageOptions<T> {
  key: string;
  initialValue: T;
  validator?: z.ZodSchema<T>;
  expiresIn?: number; // Duration in milliseconds
  encrypt?: boolean;
  version?: number; // For handling schema migrations
}

interface StorageMetadata {
  timestamp: string;
  version: number;
  expiresAt?: number;
  lastModifiedBy: string;
}

const encryptionKey = process.env.NEXT_PUBLIC_STORAGE_ENCRYPTION_KEY || 'default-key';

export function useLocalStorage<T>({
  key,
  initialValue,
  validator,
  expiresIn,
  encrypt = false,
  version = 1,
}: StorageOptions<T>) {
  // Initialize state
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      const { data, metadata } = JSON.parse(item);
      
      // Handle encrypted data
      const decryptedData = encrypt ? decryptData(data) : data;

      // Validate schema version
      if (metadata.version !== version) {
        console.warn(`Storage version mismatch for key "${key}". Resetting to initial value.`);
        return initialValue;
      }

      // Check expiration
      if (metadata.expiresAt && Date.now() > metadata.expiresAt) {
        window.localStorage.removeItem(key);
        return initialValue;
      }

      // Validate data structure
      if (validator) {
        try {
          return validator.parse(decryptedData);
        } catch (error) {
          console.error(`Data validation failed for key "${key}":`, error);
          return initialValue;
        }
      }

      return decryptedData;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Listen for storage changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const { data, metadata } = JSON.parse(e.newValue);
          const decryptedData = encrypt ? decryptData(data) : data;

          if (validator) {
            validator.parse(decryptedData);
          }

          setStoredValue(decryptedData);
        } catch (error) {
          console.error(`Error handling storage change for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, encrypt, validator]);

  // Update stored value
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Validate new value
      if (validator) {
        validator.parse(valueToStore);
      }

      // Create metadata
      const metadata: StorageMetadata = {
        timestamp: new Date().toISOString(),
        version,
        lastModifiedBy: 'Vishalsnw',
      };

      if (expiresIn) {
        metadata.expiresAt = Date.now() + expiresIn;
      }

      // Encrypt if needed
      const dataToStore = encrypt ? encryptData(valueToStore) : valueToStore;

      // Store with metadata
      window.localStorage.setItem(
        key,
        JSON.stringify({
          data: dataToStore,
          metadata,
        })
      );

      setStoredValue(valueToStore);

      // Log storage update
      logStorageActivity(key, 'UPDATE');

    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, validator, encrypt, expiresIn, version]);

  // Remove stored value
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);

      // Log storage removal
      logStorageActivity(key, 'REMOVE');

    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Clear expired items
  const clearExpired = useCallback(() => {
    try {
      Object.keys(window.localStorage).forEach((storageKey) => {
        const item = window.localStorage.getItem(storageKey);
        if (item) {
          const { metadata } = JSON.parse(item);
          if (metadata.expiresAt && Date.now() > metadata.expiresAt) {
            window.localStorage.removeItem(storageKey);
          }
        }
      });
    } catch (error) {
      console.error('Error clearing expired items:', error);
    }
  }, []);

  // Encryption helpers
  function encryptData(data: any): string {
    // Simple XOR encryption for demo purposes
    // In production, use a proper encryption library
    const jsonString = JSON.stringify(data);
    return Array.from(jsonString).map(char => 
      String.fromCharCode(char.charCodeAt(0) ^ encryptionKey.charCodeAt(0))
    ).join('');
  }

  function decryptData(encryptedData: string): any {
    // Simple XOR decryption
    const decrypted = Array.from(encryptedData).map(char =>
      String.fromCharCode(char.charCodeAt(0) ^ encryptionKey.charCodeAt(0))
    ).join('');
    return JSON.parse(decrypted);
  }

  // Activity logging
  async function logStorageActivity(storageKey: string, action: 'UPDATE' | 'REMOVE') {
    try {
      await fetch('/api/activity-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: `STORAGE_${action}`,
          description: `LocalStorage ${action.toLowerCase()} for key: ${storageKey}`,
          metadata: { key: storageKey },
          createdBy: 'Vishalsnw',
          timestamp: '2025-06-08 07:04:07',
        }),
      });
    } catch (error) {
      console.error('Error logging storage activity:', error);
    }
  }

  // Clear expired items on mount
  useEffect(() => {
    clearExpired();
  }, [clearExpired]);

  return {
    storedValue,
    setValue,
    removeValue,
    clearExpired,
  };
        }
