import "react";

// Override React's RefObject type to make current writable
declare module "react" {
  interface RefObject<T> {
    current: T | null;
  }
}

// Global declaration for toast functions if needed
declare global {
  const toast: {
    success: (message: string, options?: any) => void;
    error: (message: string, options?: any) => void;
    info: (message: string, options?: any) => void;
    warning: (message: string, options?: any) => void;
    loading: (message: string, options?: any) => void;
  };
}
