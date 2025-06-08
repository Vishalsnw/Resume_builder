// src/services/http.service.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { z } from 'zod';
import { authService } from './auth.service';

// HTTP Configuration Schema
const HttpConfigSchema = z.object({
  baseURL: z.string().url(),
  timeout: z.number().min(0),
  retryConfig: z.object({
    maxRetries: z.number().min(0),
    retryDelay: z.number().min(0),
    retryableStatuses: z.array(z.number()),
  }).optional(),
  cacheConfig: z.object({
    enabled: z.boolean(),
    maxAge: z.number().min(0),
    excludePaths: z.array(z.string()),
  }).optional(),
  rateLimitConfig: z.object({
    enabled: z.boolean(),
    maxRequests: z.number().min(1),
    timeWindow: z.number().min(1000),
  }).optional(),
});

interface HttpConfig extends z.infer<typeof HttpConfigSchema> {}

interface CacheItem {
  data: any;
  timestamp: number;
}

interface RequestMetrics {
  path: string;
  method: string;
  status: number;
  duration: number;
  timestamp: string;
  cached: boolean;
}

class HttpService {
  private static instance: HttpService;
  private axios: AxiosInstance;
  private cache: Map<string, CacheItem> = new Map();
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;
  private requestCount = 0;
  private lastReset = Date.now();
  private metrics: RequestMetrics[] = [];

  private constructor(private config: HttpConfig) {
    // Validate configuration
    try {
      HttpConfigSchema.parse(config);
    } catch (error) {
      console.error('Invalid HTTP configuration:', error);
      throw error;
    }

    this.axios = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.startRateLimitReset();
  }

  public static getInstance(config: HttpConfig): HttpService {
    if (!HttpService.instance) {
      HttpService.instance = new HttpService(config);
    }
    return HttpService.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axios.interceptors.request.use(
      async (config) => {
        const startTime = Date.now();
        config.metadata = { startTime };

        // Add authentication token
        const token = authService.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Check rate limiting
        if (this.config.rateLimitConfig?.enabled) {
          await this.checkRateLimit();
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.axios.interceptors.response.use(
      (response) => {
        this.logRequestMetrics(response);
        return response;
      },
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          return this.handle401Error(error);
        }

        if (this.isRetryableError(error)) {
          return this.retryRequest(error);
        }

        this.logErrorMetrics(error);
        return Promise.reject(error);
      }
    );
  }

  private async handle401Error(error: AxiosError): Promise<AxiosResponse> {
    try {
      await authService.refreshTokens();
      const config = error.config as AxiosRequestConfig;
      const token = authService.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return this.axios(config);
    } catch (refreshError) {
      await authService.logout();
      return Promise.reject(error);
    }
  }

  private isRetryableError(error: AxiosError): boolean {
    if (!this.config.retryConfig) return false;
    const status = error.response?.status;
    return status ? this.config.retryConfig.retryableStatuses.includes(status) : false;
  }

  private async retryRequest(error: AxiosError): Promise<AxiosResponse> {
    const config = error.config as AxiosRequestConfig & { retryCount?: number };
    const maxRetries = this.config.retryConfig?.maxRetries || 0;
    const retryDelay = this.config.retryConfig?.retryDelay || 1000;

    config.retryCount = config.retryCount || 0;

    if (config.retryCount >= maxRetries) {
      return Promise.reject(error);
    }

    config.retryCount++;
    await this.delay(retryDelay * config.retryCount);
    return this.axios(config);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getCacheKey(config: AxiosRequestConfig): string {
    return `${config.method}-${config.url}-${JSON.stringify(config.params)}-${JSON.stringify(config.data)}`;
  }

  private async checkRateLimit(): Promise<void> {
    if (!this.config.rateLimitConfig?.enabled) return;

    const { maxRequests, timeWindow } = this.config.rateLimitConfig;
    const now = Date.now();

    if (now - this.lastReset > timeWindow) {
      this.requestCount = 0;
      this.lastReset = now;
    }

    if (this.requestCount >= maxRequests) {
      await this.delay(this.lastReset + timeWindow - now);
      this.requestCount = 0;
      this.lastReset = Date.now();
    }

    this.requestCount++;
  }

  private startRateLimitReset(): void {
    if (this.config.rateLimitConfig?.enabled) {
      setInterval(() => {
        this.requestCount = 0;
        this.lastReset = Date.now();
      }, this.config.rateLimitConfig.timeWindow);
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue) return;
    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
        } catch (error) {
          console.error('Error processing queued request:', error);
        }
      }
    }

    this.isProcessingQueue = false;
  }

  private logRequestMetrics(response: AxiosResponse): void {
    const startTime = response.config.metadata?.startTime;
    const duration = startTime ? Date.now() - startTime : 0;

    const metrics: RequestMetrics = {
      path: response.config.url || '',
      method: response.config.method?.toUpperCase() || 'UNKNOWN',
      status: response.status,
      duration,
      timestamp: new Date().toISOString(),
      cached: false,
    };

    this.metrics.push(metrics);
    this.logHttpActivity('REQUEST', metrics);
  }

  private logErrorMetrics(error: AxiosError): void {
    const startTime = error.config?.metadata?.startTime;
    const duration = startTime ? Date.now() - startTime : 0;

    const metrics: RequestMetrics = {
      path: error.config?.url || '',
      method: error.config?.method?.toUpperCase() || 'UNKNOWN',
      status: error.response?.status || 0,
      duration,
      timestamp: new Date().toISOString(),
      cached: false,
    };

    this.metrics.push(metrics);
    this.logHttpActivity('ERROR', { ...metrics, error: error.message });
  }

  // Public methods
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const requestConfig = { ...config, method: 'get', url };
    const cacheKey = this.getCacheKey(requestConfig);

    if (this.config.cacheConfig?.enabled && !this.config.cacheConfig.excludePaths.includes(url)) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < (this.config.cacheConfig.maxAge || 0)) {
        return cached.data;
      }
    }

    const response = await this.axios.get<T>(url, config);

    if (this.config.cacheConfig?.enabled && !this.config.cacheConfig.excludePaths.includes(url)) {
      this.cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });
    }

    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.delete<T>(url, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.patch<T>(url, data, config);
    return response.data;
  }

  // Utility methods
  public clearCache(): void {
    this.cache.clear();
  }

  public getMetrics(): RequestMetrics[] {
    return [...this.metrics];
  }

  public resetMetrics(): void {
    this.metrics = [];
  }
}

// Helper function to log HTTP activity
async function logHttpActivity(
  type: 'REQUEST' | 'ERROR',
  metadata: Record<string, any>
) {
  try {
    await fetch('/api/activity-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: `HTTP_${type}`,
        description: `HTTP ${type.toLowerCase()}`,
        metadata,
        createdBy: 'Vishalsnw',
        timestamp: '2025-06-08 07:31:21',
      }),
    });
  } catch (error) {
    console.error('Error logging HTTP activity:', error);
  }
}

// Export singleton instance
export const httpService = HttpService.getInstance({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL!,
  timeout: 30000,
  retryConfig: {
    maxRetries: 3,
    retryDelay: 1000,
    retryableStatuses: [408, 429, 500, 502, 503, 504],
  },
  cacheConfig: {
    enabled: true,
    maxAge: 5 * 60 * 1000, // 5 minutes
    excludePaths: ['/auth', '/user'],
  },
  rateLimitConfig: {
    enabled: true,
    maxRequests: 100,
    timeWindow: 60000, // 1 minute
  },
});

export default httpService;
