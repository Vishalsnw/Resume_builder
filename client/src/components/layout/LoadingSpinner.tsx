// client/src/components/layout/LoadingSpinner.tsx

import index from '@/pages/help/index';
import 500 from '@/pages/500';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'light';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  variant = 'primary',
  text = 'Loading...',
  fullScreen = false,
  className = ''
}) => {
  // Size configurations
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  // Variant configurations
  const variantClasses = {
    primary: 'border-blue-600 border-t-transparent',
    secondary: 'border-gray-600 border-t-transparent',
    light: 'border-white border-t-transparent'
  };

  // Text size based on spinner size
  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  // Current date-time display
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace('T', ' ');
  };

  const SpinnerComponent = () => (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Spinner */}
      <div
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          border-4
          rounded-full
          animate-spin
          transform-gpu
        `}
        style={{
          // Add hardware acceleration hints
          WebkitBackfaceVisibility: 'hidden',
          WebkitPerspective: '1000',
          WebkitTransform: 'translate3d(0,0,0)',
          backfaceVisibility: 'hidden',
          perspective: '1000',
          transform: 'translate3d(0,0,0)'
        }}
        role="status"
        aria-label="loading"
      />

      {/* Loading Text */}
      {text && (
        <div className="mt-3 text-center">
          <p className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
            {text}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {getCurrentDateTime()}
          </p>
        </div>
      )}
    </div>
  );

  // Render fullscreen variant
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
        <SpinnerComponent />
      </div>
    );
  }

  // Render inline variant
  return <SpinnerComponent />;
};

// Optimized spinner variants for different use cases
export const PageSpinner: React.FC = () => (
  <LoadingSpinner
    size="large"
    variant="primary"
    text="Loading page..."
    fullScreen={true}
  />
);

export const TableSpinner: React.FC = () => (
  <LoadingSpinner
    size="medium"
    variant="secondary"
    text="Loading data..."
    className="py-8"
  />
);

export const ButtonSpinner: React.FC = () => (
  <LoadingSpinner
    size="small"
    variant="light"
    text=""
  />
);

// Progress spinner with percentage
interface ProgressSpinnerProps {
  progress: number;
  text?: string;
}

export const ProgressSpinner: React.FC<ProgressSpinnerProps> = ({ 
  progress, 
  text 
}) => {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute text-center">
        <span className="text-sm font-semibold text-blue-600">
          {Math.round(progress)}%
        </span>
      </div>
      <svg className="transform -rotate-90 w-12 h-12">
        <circle
          className="text-gray-200"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r="20"
          cx="24"
          cy="24"
        />
        <circle
          className="text-blue-600"
          strokeWidth="4"
          strokeDasharray={125.6}
          strokeDashoffset={125.6 * ((100 - progress) / 100)}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="20"
          cx="24"
          cy="24"
        />
      </svg>
      {text && (
        <span className="mt-2 text-xs text-gray-500">{text}</span>
      )}
    </div>
  );
};

// Skeleton loader for content
interface SkeletonLoaderProps {
  rows?: number;
  type?: 'text' | 'card' | 'avatar';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  rows = 3,
  type = 'text'
}) => {
  const skeletonClass = "animate-pulse bg-gray-200 rounded";
  
  if (type === 'avatar') {
    return <div className={`${skeletonClass} h-12 w-12 rounded-full`} />;
  }

  if (type === 'card') {
    return (
      <div className="space-y-3">
        <div className={`${skeletonClass} h-40 w-full`} />
        <div className={`${skeletonClass} h-4 w-3/4`} />
        <div className={`${skeletonClass} h-4 w-1/2`} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div 
          key={index} 
          className={`${skeletonClass} h-4`} 
          style={{ width: `${Math.random() * 50 + 50}%` }} 
        />
      ))}
    </div>
  );
};

export default LoadingSpinner;
