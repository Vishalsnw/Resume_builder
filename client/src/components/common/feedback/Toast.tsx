// client/src/components/common/notifications/Toast.tsx

import 500 from '@/pages/500';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import Toast from '@/components/common/feedback/Toast';
import React, { forwardRef, useEffect, useState } from 'react';
import {
  FiX,
  FiCheck,
  FiAlertCircle,
  FiInfo,
  FiAlertTriangle,
  FiLoader,
  FiRefreshCcw
} from 'react-icons/fi';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
  position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';
  onClose?: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  description?: string;
  icon?: React.ReactNode;
  closable?: boolean;
  progress?: boolean;
  className?: string;
  containerClassName?: string;
  currentDateTime?: string;
  currentUser?: string;
}

const Toast = forwardRef<HTMLDivElement, ToastProps>(({
  id,
  message,
  type = 'info',
  duration = 5000,
  position = 'bottom-right',
  onClose,
  action,
  description,
  icon,
  closable = true,
  progress = true,
  className = '',
  containerClassName = '',
  currentDateTime = '2025-06-07 19:08:01',
  currentUser = 'Vishalsnw',
}, ref) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progressWidth, setProgressWidth] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  // Icon configurations
  const icons = {
    success: <FiCheck className="w-5 h-5 text-green-500" />,
    error: <FiAlertCircle className="w-5 h-5 text-red-500" />,
    info: <FiInfo className="w-5 h-5 text-blue-500" />,
    warning: <FiAlertTriangle className="w-5 h-5 text-yellow-500" />,
    loading: <FiLoader className="w-5 h-5 text-blue-500 animate-spin" />,
  };

  // Background colors based on type
  const backgrounds = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
    loading: 'bg-blue-50 border-blue-200',
  };

  // Progress bar colors
  const progressColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
    loading: 'bg-blue-500',
  };

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let closeTimeout: NodeJS.Timeout;

    if (!isPaused && duration && duration > 0) {
      const startTime = Date.now();
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);
        const width = (remaining / duration) * 100;
        
        if (width <= 0) {
          handleClose();
        } else {
          setProgressWidth(width);
        }
      };

      progressInterval = setInterval(updateProgress, 10);
      closeTimeout = setTimeout(handleClose, duration);
    }

    return () => {
      clearInterval(progressInterval);
      clearTimeout(closeTimeout);
    };
  }, [duration, isPaused]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(id), 300); // Allow animation to complete
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  if (!isVisible) return null;

  return (
    <div
      ref={ref}
      className={`
        fixed
        ${position.includes('top') ? 'top-4' : 'bottom-4'}
        ${position.includes('left') ? 'left-4' : position.includes('right') ? 'right-4' : 'left-1/2 transform -translate-x-1/2'}
        max-w-md w-full
        pointer-events-auto
        ${containerClassName}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
    >
      <div className={`
        relative overflow-hidden
        rounded-lg border
        shadow-lg
        transition-all duration-300 ease-in-out
        ${backgrounds[type]}
        ${className}
      `}>
        {/* Content */}
        <div className="p-4">
          <div className="flex items-start">
            {/* Icon */}
            {(icon || icons[type]) && (
              <div className="flex-shrink-0">
                {icon || icons[type]}
              </div>
            )}

            {/* Message */}
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {message}
              </p>
              {description && (
                <p className="mt-1 text-sm text-gray-500">
                  {description}
                </p>
              )}
              {action && (
                <div className="mt-2">
                  <button
                    onClick={action.onClick}
                    className={`
                      text-sm font-medium
                      ${type === 'error' ? 'text-red-600 hover:text-red-500' :
                        type === 'success' ? 'text-green-600 hover:text-green-500' :
                        'text-blue-600 hover:text-blue-500'}
                    `}
                  >
                    {action.label}
                  </button>
                </div>
              )}
            </div>

            {/* Close Button */}
            {closable && (
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-md"
                  onClick={handleClose}
                >
                  <span className="sr-only">Close</span>
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {progress && duration > 0 && (
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-200">
            <div
              className={`h-full transition-all duration-100 ${progressColors[type]}`}
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
});

Toast.displayName = 'Toast';

export default Toast;

// Toast Container Component
export const ToastContainer: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-end justify-end p-4 space-y-4">
      {/* Toasts will be rendered here by the toast manager */}
    </div>
  );
};

// Toast Manager (Singleton)
class ToastManager {
  private static instance: ToastManager;
  private toasts: Map<string, ToastProps> = new Map();
  private subscribers: Set<(toasts: ToastProps[]) => void> = new Set();

  private constructor() {}

  static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  show(props: Omit<ToastProps, 'id'>): string {
    const id = Math.random().toString(36).substr(2, 9);
    this.toasts.set(id, { ...props, id });
    this.notify();
    return id;
  }

  hide(id: string): void {
    this.toasts.delete(id);
    this.notify();
  }

  subscribe(callback: (toasts: ToastProps[]) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notify(): void {
    const toasts = Array.from(this.toasts.values());
    this.subscribers.forEach(callback => callback(toasts));
  }
}

// Hook for using toasts
export const useToast = () => {
  const toastManager = ToastManager.getInstance();

  return {
    success: (message: string, options?: Partial<ToastProps>) =>
      toastManager.show({ message, type: 'success', ...options }),
    error: (message: string, options?: Partial<ToastProps>) =>
      toastManager.show({ message, type: 'error', ...options }),
    info: (message: string, options?: Partial<ToastProps>) =>
      toastManager.show({ message, type: 'info', ...options }),
    warning: (message: string, options?: Partial<ToastProps>) =>
      toastManager.show({ message, type: 'warning', ...options }),
    loading: (message: string, options?: Partial<ToastProps>) =>
      toastManager.show({ message, type: 'loading', ...options }),
    custom: (props: Omit<ToastProps, 'id'>) =>
      toastManager.show(props),
    hide: (id: string) => toastManager.hide(id),
  };
};
