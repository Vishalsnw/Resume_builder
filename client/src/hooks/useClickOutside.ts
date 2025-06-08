// hooks/useClickOutside.ts

import { useEffect, useRef, useCallback, RefObject } from 'react';
import { z } from 'zod';

// Configuration schema
const ClickOutsideConfigSchema = z.object({
  enabled: z.boolean().optional(),
  ignoredElements: z.array(z.string()).optional(),
  mouseEvent: z.enum(['mousedown', 'mouseup', 'click']).optional(),
  touchEvent: z.enum(['touchstart', 'touchend']).optional(),
  capture: z.boolean().optional(),
  onClickOutside: z.function().optional(),
});

interface ClickOutsideOptions {
  enabled?: boolean;
  ignoredElements?: string[];
  mouseEvent?: 'mousedown' | 'mouseup' | 'click';
  touchEvent?: 'touchstart' | 'touchend';
  capture?: boolean;
  onClickOutside?: (event: MouseEvent | TouchEvent) => void;
}

interface ClickOutsideMetrics {
  triggeredCount: number;
  lastTriggered: string | null;
  ignoredCount: number;
}

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  options: ClickOutsideOptions = {}
) {
  const {
    enabled = true,
    ignoredElements = [],
    mouseEvent = 'mousedown',
    touchEvent = 'touchstart',
    capture = true,
    onClickOutside,
  } = options;

  // Validate configuration
  try {
    ClickOutsideConfigSchema.parse({
      enabled,
      ignoredElements,
      mouseEvent,
      touchEvent,
      capture,
      onClickOutside,
    });
  } catch (error) {
    console.error('Invalid click outside configuration:', error);
  }

  const elementRef = useRef<T>(null);
  const handlerRef = useRef(onClickOutside);
  const metricsRef = useRef<ClickOutsideMetrics>({
    triggeredCount: 0,
    lastTriggered: null,
    ignoredCount: 0,
  });

  // Update handler ref when callback changes
  useEffect(() => {
    handlerRef.current = onClickOutside;
  }, [onClickOutside]);

  // Check if element should be ignored
  const isIgnoredElement = useCallback((element: Element | null): boolean => {
    if (!element) return false;

    return ignoredElements.some(selector => {
      if (selector.startsWith('data-')) {
        return element.hasAttribute(selector);
      }
      return element.matches(selector);
    });
  }, [ignoredElements]);

  // Get all parent elements
  const getParentElements = useCallback((element: Element | null): Element[] => {
    const parents: Element[] = [];
    let current = element;

    while (current && current !== document.documentElement) {
      parents.push(current);
      current = current.parentElement;
    }

    return parents;
  }, []);

  // Handle click outside
  const handleClickOutside = useCallback((event: MouseEvent | TouchEvent) => {
    if (!enabled || !elementRef.current || !handlerRef.current) return;

    const target = event.target as Element;
    const element = elementRef.current;

    // Check if click was outside the element
    if (!element.contains(target) && !isIgnoredElement(target)) {
      // Check if any parent elements should be ignored
      const parentElements = getParentElements(target);
      const shouldIgnore = parentElements.some(isIgnoredElement);

      if (shouldIgnore) {
        metricsRef.current.ignoredCount++;
        return;
      }

      // Update metrics
      metricsRef.current.triggeredCount++;
      metricsRef.current.lastTriggered = new Date().toISOString();

      // Log click outside event
      logClickOutsideEvent({
        elementId: element.id || 'unknown',
        targetTag: target.tagName.toLowerCase(),
        metrics: metricsRef.current,
      });

      // Call handler
      handlerRef.current(event);
    }
  }, [enabled, isIgnoredElement, getParentElements]);

  // Set up event listeners
  useEffect(() => {
    if (!enabled) return;

    const removeEventListeners = () => {
      document.removeEventListener(mouseEvent, handleClickOutside, capture);
      document.removeEventListener(touchEvent, handleClickOutside, capture);
    };

    // Add event listeners
    document.addEventListener(mouseEvent, handleClickOutside, capture);
    document.addEventListener(touchEvent, handleClickOutside, capture);

    // Cleanup
    return removeEventListeners;
  }, [enabled, mouseEvent, touchEvent, capture, handleClickOutside]);

  // Utility functions
  const enable = useCallback(() => {
    if (!enabled) {
      document.addEventListener(mouseEvent, handleClickOutside, capture);
      document.addEventListener(touchEvent, handleClickOutside, capture);
    }
  }, [enabled, mouseEvent, touchEvent, capture, handleClickOutside]);

  const disable = useCallback(() => {
    document.removeEventListener(mouseEvent, handleClickOutside, capture);
    document.removeEventListener(touchEvent, handleClickOutside, capture);
  }, [mouseEvent, touchEvent, capture, handleClickOutside]);

  const getMetrics = useCallback(() => {
    return { ...metricsRef.current };
  }, []);

  const resetMetrics = useCallback(() => {
    metricsRef.current = {
      triggeredCount: 0,
      lastTriggered: null,
      ignoredCount: 0,
    };
  }, []);

  return {
    ref: elementRef,
    enable,
    disable,
    getMetrics,
    resetMetrics,
    isEnabled: enabled,
  };
}

// Helper function to create a combined ref
export function useCombinedRefs<T>(...refs: Array<RefObject<T> | ((instance: T) => void) | null>) {
  return useCallback((instance: T) => {
    refs.forEach(ref => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(instance);
      } else {
        (ref as any).current = instance;
      }
    });
  }, [refs]);
}

// Helper function to log click outside events
async function logClickOutsideEvent(metadata: {
  elementId: string;
  targetTag: string;
  metrics: ClickOutsideMetrics;
}) {
  try {
    await fetch('/api/activity-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'CLICK_OUTSIDE',
        description: `Click outside detected for element: ${metadata.elementId}`,
        metadata,
        createdBy: 'Vishalsnw',
        timestamp: '2025-06-08 07:21:05',
      }),
    });
  } catch (error) {
    console.error('Error logging click outside event:', error);
  } 
}
