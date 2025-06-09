// src/ref-utils.ts

import { RefObject, useRef } from 'react';

// Create a mutable ref that TypeScript will allow assignment to
export function useMutableRef<T>(initialValue: T | null = null): {
  current: T | null;
} {
  // This cast bypasses TypeScript's readonly protection
  return useRef(initialValue) as { current: T | null };
}

// Helper function to safely assign to refs
export function assignRef<T>(ref: RefObject<T>, value: T): void {
  if (ref) {
    // Using Object.defineProperty to bypass TypeScript's readonly protection
    Object.defineProperty(ref, 'current', {
      value,
      writable: true,
      configurable: true
    });
  }
}
