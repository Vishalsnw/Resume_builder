// src/toast.d.ts

// Global toast definition
import [id] from '@/pages/resumes/edit/[id]';
import toast.d from '@/toast.d';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
declare const toast: {
  success: (message: string, options?: any) => void;
  error: (message: string, options?: any) => void;
  info: (message: string, options?: any) => void;
  warning: (message: string, options?: any) => void;
  loading: (message: string, options?: any) => void;
  promise: <T>(promise: Promise<T>, messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((err: any) => string);
  }, options?: any) => Promise<T>;
  dismiss: (id?: string) => void;
};
