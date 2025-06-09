// hooks/useDebounce.ts

import useDebounce from '@/hooks/useDebounce';
import { useState, useEffect, useCallback, useRef } from 'react';

interface DebounceOptions {
  delay?: number;
  maxWait?: number;
  leading?: boolean;
  trailing?: boolean;
  onError?: (error: Error) => void;
}

interface DebounceMetrics {
  callCount: number;
  lastCallTime: number;
  lastExecutionTime: number;
}

export function useDebounce<T>(
  value: T,
  {
    delay = 500,
    maxWait,
    leading = false,
    trailing = true,
    onError,
  }: DebounceOptions = {}
) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxWaitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallTimeRef = useRef<number>(Date.now());
  const metricsRef = useRef<DebounceMetrics>({
    callCount: 0,
    lastCallTime: 0,
    lastExecutionTime: 0,
  });

  // Function to update metrics
  const updateMetrics = useCallback(() => {
    metricsRef.current = {
      callCount: metricsRef.current.callCount + 1,
      lastCallTime: Date.now(),
      lastExecutionTime: Date.now(),
    };

    // Log metrics for monitoring
    logDebounceMetrics(metricsRef.current);
  }, []);

  // Function to handle the actual update
  const handleUpdate = useCallback((newValue: T) => {
    try {
      setDebouncedValue(newValue);
      updateMetrics();
    } catch (error) {
      if (error instanceof Error && onError) {
        onError(error);
      }
      console.error('Debounce update error:', error);
    }
  }, [updateMetrics, onError]);

  // Clear all timeouts
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxWaitTimeoutRef.current) {
      clearTimeout(maxWaitTimeoutRef.current);
      maxWaitTimeoutRef.current = null;
    }
  }, []);

  // Main debounce effect
  useEffect(() => {
    const shouldExecuteImmediate = leading && !timeoutRef.current;
    const currentTime = Date.now();
    const timeSinceLastCall = currentTime - lastCallTimeRef.current;

    // Update last call time
    lastCallTimeRef.current = currentTime;
    metricsRef.current.callCount++;

    // Execute immediately if leading and no timeout is set
    if (shouldExecuteImmediate) {
      handleUpdate(value);
      return;
    }

    // Clear existing timeout
    cleanup();

    // Set up new timeout
    timeoutRef.current = setTimeout(() => {
      if (trailing) {
        handleUpdate(value);
      }
      cleanup();
    }, delay);

    // Set up maxWait timeout if specified
    if (maxWait && !maxWaitTimeoutRef.current) {
      maxWaitTimeoutRef.current = setTimeout(() => {
        if (timeoutRef.current) {
          handleUpdate(value);
          cleanup();
        }
      }, maxWait);
    }

    // Cleanup on unmount or value change
    return cleanup;
  }, [value, delay, maxWait, leading, trailing, cleanup, handleUpdate]);

  // Return both the debounced value and a function to cancel pending updates
  return {
    debouncedValue,
    cancelPending: cleanup,
    metrics: {
      getCallCount: () => metricsRef.current.callCount,
      getLastCallTime: () => metricsRef.current.lastCallTime,
      getLastExecutionTime: () => metricsRef.current.lastExecutionTime,
    },
  };
}

// Custom hook for debounced callback functions
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  {
    delay = 500,
    maxWait,
    leading = false,
    trailing = true,
    onError,
  }: DebounceOptions = {}
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxWaitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallTimeRef = useRef<number>(Date.now());
  const callbackRef = useRef(callback);
  const metricsRef = useRef<DebounceMetrics>({
    callCount: 0,
    lastCallTime: 0,
    lastExecutionTime: 0,
  });

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxWaitTimeoutRef.current) {
      clearTimeout(maxWaitTimeoutRef.current);
      maxWaitTimeoutRef.current = null;
    }
  }, []);

  // Debounced function
  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      const shouldExecuteImmediate = leading && !timeoutRef.current;
      const currentTime = Date.now();
      
      // Update metrics
      metricsRef.current.callCount++;
      metricsRef.current.lastCallTime = currentTime;

      return new Promise<ReturnType<T>>((resolve, reject) => {
        const executeCallback = async () => {
          try {
            const result = await callbackRef.current(...args);
            metricsRef.current.lastExecutionTime = Date.now();
            logDebounceMetrics(metricsRef.current);
            resolve(result);
          } catch (error) {
            if (error instanceof Error && onError) {
              onError(error);
            }
            reject(error);
          }
        };

        // Execute immediately if leading and no timeout is set
        if (shouldExecuteImmediate) {
          executeCallback();
          return;
        }

        // Clear existing timeout
        cleanup();

        // Set up new timeout
        timeoutRef.current = setTimeout(() => {
          if (trailing) {
            executeCallback();
          }
          cleanup();
        }, delay);

        // Set up maxWait timeout if specified
        if (maxWait && !maxWaitTimeoutRef.current) {
          maxWaitTimeoutRef.current = setTimeout(() => {
            if (timeoutRef.current) {
              executeCallback();
              cleanup();
            }
          }, maxWait);
        }
      });
    },
    [delay, maxWait, leading, trailing, cleanup, onError]
  );

  // Cleanup on unmount
  useEffect(() => cleanup, [cleanup]);

  return {
    debouncedCallback,
    cancelPending: cleanup,
    metrics: {
      getCallCount: () => metricsRef.current.callCount,
      getLastCallTime: () => metricsRef.current.lastCallTime,
      getLastExecutionTime: () => metricsRef.current.lastExecutionTime,
    },
  };
}

// Helper function to log debounce metrics
async function logDebounceMetrics(metrics: DebounceMetrics) {
  try {
    await fetch('/api/activity-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'DEBOUNCE_EXECUTION',
        description: 'Debounced function executed',
        metadata: {
          callCount: metrics.callCount,
          lastCallTime: new Date(metrics.lastCallTime).toISOString(),
          lastExecutionTime: new Date(metrics.lastExecutionTime).toISOString(),
        },
        createdBy: 'Vishalsnw',
        timestamp: '2025-06-08 07:05:55',
      }),
    });
  } catch (error) {
    console.error('Error logging debounce metrics:', error);
  }
      }
