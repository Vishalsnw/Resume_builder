// client/src/components/common/cards/Card.tsx

// REMOVED INVALID IMPORT
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import Footer from '@/components/layout/Footer';
import Card from '@/components/common/ui/Card';
import React, { forwardRef } from 'react';
import {
  FiChevronRight,
  FiMoreVertical,
  FiExternalLink,
  FiMaximize2,
  FiMinimize2,
  FiX
} from 'react-icons/fi';

interface CardProps {
  title?: string | React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled' | 'flat';
  size?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
  collapsible?: boolean;
  expandable?: boolean;
  removable?: boolean;
  loading?: boolean;
  error?: string;
  image?: {
    src: string;
    alt?: string;
    position?: 'top' | 'bottom';
  };
  direction?: 'horizontal' | 'vertical';
  onClick?: () => void;
  onExpand?: () => void;
  onCollapse?: () => void;
  onRemove?: () => void;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  currentDateTime?: string;
  currentUser?: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
  title,
  subtitle,
  children,
  footer,
  headerAction,
  variant = 'elevated',
  size = 'md',
  hoverable = false,
  clickable = false,
  collapsible = false,
  expandable = false,
  removable = false,
  loading = false,
  error,
  image,
  direction = 'vertical',
  onClick,
  onExpand,
  onCollapse,
  onRemove,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  currentDateTime = '2025-06-07 19:17:36',
  currentUser = 'Vishalsnw',
}, ref) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Variant styles
  const variantStyles = {
    elevated: 'bg-white shadow-md hover:shadow-lg',
    outlined: 'bg-white border border-gray-200',
    filled: 'bg-gray-50',
    flat: 'bg-transparent',
  };

  // Size configurations
  const sizeStyles = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (isCollapsed) {
      onExpand?.();
    } else {
      onCollapse?.();
    }
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      onCollapse?.();
    } else {
      onExpand?.();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  const renderHeader = () => {
    if (!title && !subtitle && !headerAction && !collapsible && !expandable && !removable) {
      return null;
    }

    return (
      <div className={`
        flex items-center justify-between
        ${sizeStyles[size]}
        border-b border-gray-200
        ${headerClassName}
      `}>
        <div className="flex-1">
          {title && (
            <h3 className="text-lg font-medium text-gray-900">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {headerAction}
          
          {collapsible && (
            <button
              onClick={handleCollapse}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <FiChevronRight
                className={`w-5 h-5 transform transition-transform ${
                  isCollapsed ? '-rotate-90' : 'rotate-90'
                }`}
              />
            </button>
          )}

          {expandable && (
            <button
              onClick={handleExpand}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              {isExpanded ? (
                <FiMinimize2 className="w-5 h-5" />
              ) : (
                <FiMaximize2 className="w-5 h-5" />
              )}
            </button>
          )}

          {removable && (
            <button
              onClick={handleRemove}
              className="p-1 rounded-full hover:bg-gray-100 hover:text-red-500"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  };

  const cardContent = (
    <div
      ref={ref}
      className={`
        ${variantStyles[variant]}
        ${direction === 'horizontal' ? 'flex' : ''}
        ${hoverable ? 'transition-shadow duration-200' : ''}
        ${clickable ? 'cursor-pointer' : ''}
        ${isExpanded ? 'fixed inset-4 z-50 overflow-auto' : 'rounded-lg'}
        ${className}
      `}
      onClick={clickable ? onClick : undefined}
    >
      {/* Image - Top Position */}
      {image && image.position !== 'bottom' && (
        <div className={direction === 'horizontal' ? 'w-1/3' : ''}>
          <img
            src={image.src}
            alt={image.alt || ''}
            className={`
              w-full
              object-cover
              ${direction === 'horizontal' ? 'h-full' : 'h-48'}
              ${direction === 'vertical' ? 'rounded-t-lg' : 'rounded-l-lg'}
            `}
          />
        </div>
      )}

      <div className={`
        flex flex-col
        ${direction === 'horizontal' ? 'flex-1' : ''}
      `}>
        {/* Header */}
        {renderHeader()}

        {/* Body */}
        {!isCollapsed && (
          <div className={`
            ${sizeStyles[size]}
            ${bodyClassName}
          `}>
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-sm">{error}</div>
            ) : (
              children
            )}
          </div>
        )}

        {/* Footer */}
        {footer && !isCollapsed && (
          <div className={`
            ${sizeStyles[size]}
            border-t border-gray-200
            mt-auto
            ${footerClassName}
          `}>
            {footer}
          </div>
        )}

        {/* Metadata */}
        <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-200">
          Last modified by {currentUser} at {currentDateTime}
        </div>
      </div>

      {/* Image - Bottom Position */}
      {image && image.position === 'bottom' && (
        <img
          src={image.src}
          alt={image.alt || ''}
          className="w-full h-48 object-cover rounded-b-lg"
        />
      )}
    </div>
  );

  return isExpanded ? (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      {cardContent}
    </>
  ) : (
    cardContent
  );
});

Card.displayName = 'Card';

export default Card;
