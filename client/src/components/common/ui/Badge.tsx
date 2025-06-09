// client/src/components/common/badges/Badge.tsx

import Badge from '@/components/common/ui/Badge';
import React, { forwardRef } from 'react';
import {
  FiX,
  FiCheck,
  FiAlertCircle,
  FiAlertTriangle,
  FiInfo,
  FiStar,
  FiActivity
} from 'react-icons/fi';

interface BadgeProps {
  content?: string | number;
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  variant?: 'solid' | 'outline' | 'subtle' | 'dot';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  shape?: 'square' | 'rounded' | 'pill';
  icon?: React.ReactNode;
  showIcon?: boolean;
  removable?: boolean;
  pulsing?: boolean;
  max?: number;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
  containerClassName?: string;
  currentDateTime?: string;
  currentUser?: string;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(({
  content,
  type = 'default',
  variant = 'solid',
  size = 'md',
  shape = 'rounded',
  icon,
  showIcon = true,
  removable = false,
  pulsing = false,
  max,
  onClick,
  onRemove,
  className = '',
  containerClassName = '',
  currentDateTime = '2025-06-07 19:19:40',
  currentUser = 'Vishalsnw',
}, ref) => {
  // Size configurations
  const sizeStyles = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-2.5 py-1',
    lg: 'text-lg px-3 py-1.5',
  };

  // Shape configurations
  const shapeStyles = {
    square: '',
    rounded: 'rounded',
    pill: 'rounded-full',
  };

  // Default icons for each type
  const defaultIcons = {
    default: null,
    success: <FiCheck />,
    error: <FiAlertCircle />,
    warning: <FiAlertTriangle />,
    info: <FiInfo />,
  };

  // Color schemes based on type and variant
  const colorSchemes = {
    solid: {
      default: 'bg-gray-500 text-white',
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      warning: 'bg-yellow-500 text-white',
      info: 'bg-blue-500 text-white',
    },
    outline: {
      default: 'border-2 border-gray-500 text-gray-700',
      success: 'border-2 border-green-500 text-green-700',
      error: 'border-2 border-red-500 text-red-700',
      warning: 'border-2 border-yellow-500 text-yellow-700',
      info: 'border-2 border-blue-500 text-blue-700',
    },
    subtle: {
      default: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      info: 'bg-blue-100 text-blue-800',
    },
    dot: {
      default: 'text-gray-700',
      success: 'text-green-700',
      error: 'text-red-700',
      warning: 'text-yellow-700',
      info: 'text-blue-700',
    },
  };

  const formatContent = (value: string | number) => {
    if (!max) return value;
    const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
    return numericValue > max ? `${max}+` : value;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.stopPropagation();
      onClick();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    if (onRemove) {
      e.stopPropagation();
      onRemove();
    }
  };

  const renderDot = () => {
    if (variant !== 'dot') return null;

    return (
      <span className={`
        inline-block w-2 h-2 rounded-full mr-1.5
        ${colorSchemes.solid[type]}
        ${pulsing ? 'animate-ping' : ''}
      `} />
    );
  };

  return (
    <div
      ref={ref}
      className={`
        inline-flex items-center
        ${sizeStyles[size]}
        ${shapeStyles[shape]}
        ${colorSchemes[variant][type]}
        ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
        ${className}
      `}
      onClick={handleClick}
      role={onClick ? 'button' : 'status'}
    >
      {/* Dot for dot variant */}
      {renderDot()}

      {/* Icon */}
      {showIcon && (icon || defaultIcons[type]) && (
        <span className="mr-1">
          {icon || defaultIcons[type]}
        </span>
      )}

      {/* Content */}
      {content && (
        <span>
          {formatContent(content)}
        </span>
      )}

      {/* Remove button */}
      {removable && (
        <button
          onClick={handleRemove}
          className={`
            ml-1.5 p-0.5
            hover:bg-black hover:bg-opacity-10
            rounded-full
            focus:outline-none
          `}
        >
          <FiX className="w-3 h-3" />
        </button>
      )}
    </div>
  );
});

Badge.displayName = 'Badge';

// Specialized Badge Components
export const StatusBadge = forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant' | 'type'> & { status: 'online' | 'offline' | 'away' | 'busy' }>(
  ({ status, ...props }, ref) => {
    const statusConfig = {
      online: { type: 'success' as const, content: 'Online' },
      offline: { type: 'default' as const, content: 'Offline' },
      away: { type: 'warning' as const, content: 'Away' },
      busy: { type: 'error' as const, content: 'Busy' },
    };

    return (
      <Badge
        ref={ref}
        variant="dot"
        type={statusConfig[status].type}
        content={statusConfig[status].content}
        {...props}
      />
    );
  }
);

export const NotificationBadge = forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant' | 'shape'>>(
  (props, ref) => (
    <Badge
      ref={ref}
      variant="solid"
      shape="pill"
      {...props}
    />
  )
);

export default Badge;
