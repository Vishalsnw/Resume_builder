// client/src/components/common/alerts/Alert.tsx

// REMOVED INVALID IMPORT
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import Alert from '@/components/common/feedback/Alert';
import React, { forwardRef, useState } from 'react';
import {
  FiX,
  FiCheck,
  FiAlertCircle,
  FiInfo,
  FiAlertTriangle,
  FiChevronRight,
  FiChevronDown,
  FiExternalLink
} from 'react-icons/fi';

interface AlertProps {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  variant?: 'solid' | 'outlined' | 'subtle' | 'left-accent';
  size?: 'sm' | 'md' | 'lg';
  action?: {
    label: string;
    onClick: () => void;
    external?: boolean;
  };
  onClose?: () => void;
  dismissible?: boolean;
  expandable?: boolean;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  titleClassName?: string;
  messageClassName?: string;
  banner?: boolean;
  currentDateTime?: string;
  currentUser?: string;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(({
  title,
  message,
  type = 'info',
  variant = 'solid',
  size = 'md',
  action,
  onClose,
  dismissible = true,
  expandable = false,
  description,
  icon,
  className = '',
  containerClassName = '',
  titleClassName = '',
  messageClassName = '',
  banner = false,
  currentDateTime = '2025-06-07 19:10:29',
  currentUser = 'Vishalsnw',
}, ref) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Icon configurations
  const icons = {
    success: <FiCheck className="w-5 h-5" />,
    error: <FiAlertCircle className="w-5 h-5" />,
    info: <FiInfo className="w-5 h-5" />,
    warning: <FiAlertTriangle className="w-5 h-5" />,
  };

  // Color schemes based on type and variant
  const colorSchemes = {
    solid: {
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      info: 'bg-blue-500 text-white',
      warning: 'bg-yellow-500 text-white',
    },
    outlined: {
      success: 'border-2 border-green-500 text-green-700 bg-white',
      error: 'border-2 border-red-500 text-red-700 bg-white',
      info: 'border-2 border-blue-500 text-blue-700 bg-white',
      warning: 'border-2 border-yellow-500 text-yellow-700 bg-white',
    },
    subtle: {
      success: 'bg-green-50 text-green-800',
      error: 'bg-red-50 text-red-800',
      info: 'bg-blue-50 text-blue-800',
      warning: 'bg-yellow-50 text-yellow-800',
    },
    'left-accent': {
      success: 'bg-white border-l-4 border-green-500 text-green-700',
      error: 'bg-white border-l-4 border-red-500 text-red-700',
      info: 'bg-white border-l-4 border-blue-500 text-blue-700',
      warning: 'bg-white border-l-4 border-yellow-500 text-yellow-700',
    },
  };

  // Size configurations
  const sizeStyles = {
    sm: 'p-2 text-sm',
    md: 'p-4 text-base',
    lg: 'p-6 text-lg',
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      ref={ref}
      className={`
        relative
        ${banner ? 'rounded-none' : 'rounded-lg'}
        ${sizeStyles[size]}
        ${colorSchemes[variant][type]}
        ${className}
        ${containerClassName}
      `}
      role="alert"
    >
      <div className="flex items-start">
        {/* Icon */}
        {(icon || icons[type]) && (
          <div className="flex-shrink-0 mr-3">
            {icon || icons[type]}
          </div>
        )}

        {/* Content */}
        <div className="flex-1">
          {title && (
            <h3 className={`font-medium ${titleClassName}`}>
              {title}
            </h3>
          )}
          
          <div className={`${title ? 'mt-1' : ''} ${messageClassName}`}>
            {message}
          </div>

          {/* Expandable Content */}
          {expandable && description && (
            <>
              <button
                onClick={handleExpand}
                className="mt-2 flex items-center text-sm font-medium hover:underline focus:outline-none"
              >
                {isExpanded ? 'Show less' : 'Show more'}
                {isExpanded ? (
                  <FiChevronDown className="ml-1 w-4 h-4" />
                ) : (
                  <FiChevronRight className="ml-1 w-4 h-4" />
                )}
              </button>

              {isExpanded && (
                <div className="mt-2 text-sm">
                  {description}
                </div>
              )}
            </>
          )}

          {/* Action Button */}
          {action && (
            <div className="mt-3">
              <button
                onClick={action.onClick}
                className={`
                  inline-flex items-center text-sm font-medium
                  ${variant === 'solid' ? 'text-white hover:underline' : `text-${type}-700 hover:text-${type}-800`}
                `}
              >
                {action.label}
                {action.external && (
                  <FiExternalLink className="ml-1 w-4 h-4" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Close Button */}
        {dismissible && onClose && (
          <button
            onClick={onClose}
            className={`
              flex-shrink-0 ml-4 -mt-1
              ${variant === 'solid' ? 'text-white' : `text-${type}-700`}
              hover:opacity-75
              focus:outline-none
            `}
          >
            <span className="sr-only">Close</span>
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Metadata */}
      <div className={`
        mt-2 text-xs
        ${variant === 'solid' ? 'text-white text-opacity-75' : `text-${type}-600`}
      `}>
        Last updated by {currentUser} at {currentDateTime}
      </div>
    </div>
  );
});

Alert.displayName = 'Alert';

export default Alert;
