// src/services/api.service.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { z } from 'zod';

// API Configuration Schema
const ApiConfigSchema = z.object({
  baseURL: z.string().url(),
  timeout: z.number().min(0),
  headers: z.record(z.string()).optional(),
  withCredentials: z.boolean().optional(),
  responseType: z.enum(['json', 'text', 'blob', 'arraybuffer']).optional(),
});

interface ApiConfig extends z.infer<typeof ApiConfigSchema> {
  onRequest?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  onResponse?: (response: AxiosResponse) => AxiosResponse;
  onError?: (error: AxiosError) => Promise<never>;
  retry?: {
    attempts: number;
    delay: number;
  };
}

interface RequestMetrics {
  endpoint: string;
  method: string;
  duration: number;
  status: number;
  timestamp: string;
}

class ApiService {
  private static instance: ApiService;
  private axios: AxiosInstance;
  private config: ApiConfig;
  private metrics: RequestMetrics[] = [];

  private constructor(config: ApiConfig) {
    // Validate configuration
    try {
      ApiConfigSchema.parse(config);
    } catch (error) {
      console.error('Invalid API configuration:', error);
      throw error;
    }

    this.config = config;
    this.axios = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      withCredentials: config.withCredentials,
      responseType: config.responseType || 'json',
    });

    this.setupInterceptors();
  }

  public static getInstance(config: ApiConfig): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService(config);
    }
    return ApiService.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axios.interceptors.request.use(
      (config) => {
        const startTime = Date.now();
        config.metadata = { startTime };

        // Apply custom request transformation
        if (this.config.onRequest) {
          config = this.config.onRequest(config);
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axios.interceptors.response.use(
      (response) => {
        this.logRequestMetrics(response);

        // Apply custom response transformation
        if (this.config.onResponse) {
          response = this.config.onResponse(response);
        }

        return response;
      },
      async (error: AxiosError) => {
        // Handle retry logic
        if (this.config.retry && error.config) {
          const retryConfig = error.config as AxiosRequestConfig & { retryCount?: number };
          retryConfig.retryCount = retryConfig.retryCount || 0;

          if (retryConfig.retryCount < this.config.retry.attempts) {
            retryConfig.retryCount++;
            await this.delay(this.config.retry.delay);
            return this.axios(retryConfig);
          }
        }

        // Log error metrics
        this.logErrorMetrics(error);

        // Apply custom error handling
        if (this.config.onError) {
          return this.config.onError(error);
        }

        return Promise.reject(error);
      }
    );
  }

  private async logRequestMetrics(response: AxiosResponse): Promise<void> {
    const endTime = Date.now();
    const startTime = response.config.metadata?.startTime;
    const duration = startTime ? endTime - startTime : 0;

    const metrics: RequestMetrics = {
      endpoint: response.config.url || '',
      method: response.config.method?.toUpperCase() || 'UNKNOWN',
      duration,
      status: response.status,
      timestamp: new Date().toISOString(),
    };

    this.metrics.push(metrics);

    // Log request activity
    await this.logApiActivity({
      type: 'REQUEST',
      ...metrics,
    });
  }

  private async logErrorMetrics(error: AxiosError): Promise<void> {
    const endTime = Date.now();
    const startTime = error.config?.metadata?.startTime;
    const duration = startTime ? endTime - startTime : 0;

    const metrics: RequestMetrics = {
      endpoint: error.config?.url || '',
      method: error.config?.method?.toUpperCase() || 'UNKNOWN',
      duration,
      status: error.response?.status || 0,
      timestamp: new Date().toISOString(),
    };

    this.metrics.push(metrics);

    // Log error activity
    await this.logApiActivity({
      type: 'ERROR',
      ...metrics,
      error: error.message,
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public API methods
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.get<T>(url, config);
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
  public getMetrics(): RequestMetrics[] {
    return [...this.metrics];
  }

  public clearMetrics(): void {
    this.metrics = [];
  }

  public setHeader(key: string, value: string): void {
    this.axios.defaults.headers.common[key] = value;
  }

  public removeHeader(key: string): void {
    delete this.axios.defaults.headers.common[key];
  }

  public getBaseUrl(): string {
    return this.config.baseURL;
  }
}

// Helper function to log API activity
async function logApiActivity(metadata: {
  type: 'REQUEST' | 'ERROR';
  endpoint: string;
  method: string;
  duration: number;
  status: number;
  timestamp: string;
  error?: string;
}) {
  try {
    await fetch('/api/activity-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: `API_${metadata.type}`,
        description: `${metadata.method} ${metadata.endpoint}`,
        metadata,
        createdBy: 'Vishalsnw',
        timestamp: '2025-06-08 07:26:55',
      }),
    });
  } catch (error) {
    console.error('Error logging API activity:', error);
  }
}

// Export singleton instance
export const apiService = ApiService.getInstance({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL!,
  timeout: 30000,
  withCredentials: true,
  retry: {
    attempts: 3,
    delay: 1000,
  },
});

export default apiService;
