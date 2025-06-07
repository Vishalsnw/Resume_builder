// client/src/components/common/feedback/ProgressBar.tsx

import React, { forwardRef, useEffect, useState } from 'react';
import { FiCheckCircle, FiAlertCircle, FiClock } from 'react-icons/fi';

interface ProgressBarProps {
  value: number;
  max?: number;
  min?: number;
  variant?: 'solid' | 'striped' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  showValue?: boolean;
  valuePosition?: 'inside' | 'outside' | 'tooltip';
  valueFormat?: 'percentage' | 'value' | 'custom';
  customValueFormatter?: (value: number, max: number) => string;
  animated?: boolean;
  label?: string;
  description?: string;
  indeterminate?: boolean;
  rounded?: boolean;
  hasStripes?: boolean;
  colorScheme?: string;
  className?: string;
  barClassName?: string;
  labelClassName?: string;
  status?: 'idle' | 'loading' | 'success' | 'error';
  currentDateTime?: string;
  currentUser?: string;
}

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(({
  value,
  max = 100,
  min = 0,
  variant = 'solid',
  size = 'md',
  type = 'default',
  showValue = true,
  valuePosition = 'outside',
  valueFormat = 'percentage',
  customValueFormatter,
  animated = true,
  label,
  description,
  indeterminate = false,
  rounded = true,
  hasStripes = false,
  colorScheme,
  className = '',
  barClassName = '',
  labelClassName = '',
  status = 'idle',
  currentDateTime = '2025-06-07 19:15:15',
  currentUser = 'Vishalsnw',
}, ref) => {
  const [hovering, setHovering] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate progress percentage
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);

  // Size configurations
  const sizeStyles = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  // Type configurations
  const typeStyles = {
    default: 'bg-blue-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-400',
  };

  // Variant styles
  const variantStyles = {
    solid: '',
    striped: 'progress-striped',
    gradient: 'bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600',
  };

  // Status icons
  const statusIcons = {
    idle: null,
    loading: <FiClock className="w-4 h-4 text-gray-500 animate-spin" />,
    success: <FiCheckCircle className="w-4 h-4 text-green-500" />,
    error: <FiAlertCircle className="w-4 h-4 text-red-500" />,
  };

  // Format value display
  const getFormattedValue = () => {
    if (customValueFormatter) {
      return customValueFormatter(value, max);
    }

    if (valueFormat === 'percentage') {
      return `${Math.round(percentage)}%`;
    }

    return `${value}/${max}`;
  };

  const renderValueLabel = () => {
    if (!showValue) return null;

    const valueLabel = getFormattedValue();

    if (valuePosition === 'tooltip' && hovering) {
      return (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs">
          {valueLabel}
        </div>
      );
    }

    if (valuePosition === 'inside' && size !== 'xs' && size !== 'sm') {
      return (
        <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
          {valueLabel}
        </span>
      );
    }

    if (valuePosition === 'outside') {
      return (
        <span className="ml-2 text-sm text-gray-600">
          {valueLabel}
        </span>
      );
    }

    return null;
  };

  const baseBarStyles = `
    ${sizeStyles[size]}
    ${rounded ? 'rounded-full' : ''}
    ${typeStyles[type]}
    ${variantStyles[variant]}
    ${colorScheme ? `bg-${colorScheme}` : ''}
    ${hasStripes ? 'bg-stripes' : ''}
    ${animated && !indeterminate ? 'transition-all duration-300' : ''}
    ${indeterminate ? 'progress-indeterminate' : ''}
    ${barClassName}
  `;

  return (
    <div
      ref={ref}
      className={`space-y-1 ${className}`}
    >
      {/* Label and Status */}
      {(label || status !== 'idle') && (
        <div className="flex items-center justify-between">
          {label && (
            <div className={`text-sm font-medium text-gray-700 ${labelClassName}`}>
              {label}
            </div>
          )}
          {status !== 'idle' && statusIcons[status]}
        </div>
      )}

      {/* Progress Bar */}
      <div
        className="relative bg-gray-200 rounded-full overflow-hidden"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div
          className={baseBarStyles}
          style={{
            width: indeterminate ? '100%' : `${percentage}%`,
            transition: mounted ? 'width 0.3s ease-in-out' : 'none',
          }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
        />
        {renderValueLabel()}
      </div>

      {/* Description */}
      {description && (
        <div className="text-xs text-gray-500">
          {description}
        </div>
      )}

      {/* Metadata */}
      <div className="text-xs text-gray-400">
        Last updated by {currentUser} at {currentDateTime}
      </div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

// CSS for striped and indeterminate animations
const styles = `
  .progress-striped {
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent
    );
    background-size: 1rem 1rem;
  }

  .progress-indeterminate {
    position: relative;
    animation: progress-indeterminate 1.5s linear infinite;
    background-image: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    background-size: 50% 100%;
  }

  @keyframes progress-indeterminate {
    0% {
      background-position: -100% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default ProgressBar;
