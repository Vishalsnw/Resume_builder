// client/src/components/common/tooltips/Tooltip.tsx

import 500 from '@/pages/500';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import Tooltip from '@/components/common/ui/Tooltip';
import React, { forwardRef, useState, useEffect, useRef } from 'react';
import {
  FiInfo,
  FiAlertCircle,
  FiAlertTriangle,
  FiHelpCircle,
  FiX
} from 'react-icons/fi';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  variant?: 'dark' | 'light' | 'info' | 'success' | 'warning' | 'error';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  offset?: number;
  arrow?: boolean;
  maxWidth?: number;
  interactive?: boolean;
  closeOnClick?: boolean;
  showIcon?: boolean;
  customIcon?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  hasClose?: boolean;
  currentDateTime?: string;
  currentUser?: string;
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(({
  content,
  children,
  position = 'top',
  variant = 'dark',
  trigger = 'hover',
  delay = 200,
  offset = 8,
  arrow = true,
  maxWidth = 250,
  interactive = false,
  closeOnClick = true,
  showIcon = false,
  customIcon,
  className = '',
  containerClassName = '',
  hasClose = false,
  currentDateTime = '2025-06-07 19:21:32',
  currentUser = 'Vishalsnw',
}, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Variant styles
  const variantStyles = {
    dark: 'bg-gray-900 text-white',
    light: 'bg-white text-gray-900 border border-gray-200 shadow-lg',
    info: 'bg-blue-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-500 text-white',
  };

  // Default icons for variants
  const variantIcons = {
    dark: <FiInfo />,
    light: <FiInfo />,
    info: <FiInfo />,
    success: <FiCheckCircle />,
    warning: <FiAlertTriangle />,
    error: <FiAlertCircle />,
  };

  // Arrow styles based on position and variant
  const arrowStyles = {
    top: 'bottom-[-6px] left-1/2 transform -translate-x-1/2 border-t-[6px] border-x-[6px] border-x-transparent',
    right: 'left-[-6px] top-1/2 transform -translate-y-1/2 border-r-[6px] border-y-[6px] border-y-transparent',
    bottom: 'top-[-6px] left-1/2 transform -translate-x-1/2 border-b-[6px] border-x-[6px] border-x-transparent',
    left: 'right-[-6px] top-1/2 transform -translate-y-1/2 border-l-[6px] border-y-[6px] border-y-transparent',
  };

  const arrowColorStyles = {
    dark: 'border-t-gray-900',
    light: 'border-t-white',
    info: 'border-t-blue-500',
    success: 'border-t-green-500',
    warning: 'border-t-yellow-500',
    error: 'border-t-red-500',
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - offset;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + offset;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - offset;
        break;
    }

    // Adjust position to keep tooltip within viewport
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    if (left < 0) left = 0;
    if (left + tooltipRect.width > viewport.width) {
      left = viewport.width - tooltipRect.width;
    }
    if (top < 0) top = 0;
    if (top + tooltipRect.height > viewport.height) {
      top = viewport.height - tooltipRect.height;
    }

    setTooltipPosition({ top, left });
  };

  const handleShow = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      setTimeout(updatePosition, 0);
    }, delay);
  };

  const handleHide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible);
      if (!isVisible) {
        setTimeout(updatePosition, 0);
      }
    }
  };

  useEffect(() => {
    if (isVisible) {
      const handleScroll = () => updatePosition();
      const handleResize = () => updatePosition();

      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isVisible]);

  const events = {
    ...(trigger === 'hover' && {
      onMouseEnter: handleShow,
      onMouseLeave: handleHide,
    }),
    ...(trigger === 'click' && {
      onClick: handleClick,
    }),
    ...(trigger === 'focus' && {
      onFocus: handleShow,
      onBlur: handleHide,
    }),
  };

  return (
    <div
      ref={triggerRef}
      className={`inline-block ${containerClassName}`}
      {...events}
    >
      {children}

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            fixed z-50
            ${interactive ? 'pointer-events-auto' : 'pointer-events-none'}
            ${className}
          `}
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            maxWidth,
          }}
        >
          <div className={`
            relative
            rounded-lg
            py-2 px-3
            text-sm
            ${variantStyles[variant]}
          `}>
            <div className="flex items-center space-x-2">
              {showIcon && (customIcon || variantIcons[variant])}
              <div>{content}</div>
              {hasClose && (
                <button
                  onClick={() => setIsVisible(false)}
                  className="ml-2 text-current opacity-60 hover:opacity-100"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>

            {arrow && (
              <div className={`
                absolute
                w-0 h-0
                border-solid
                ${arrowStyles[position]}
                ${arrowColorStyles[variant]}
              `} />
            )}
          </div>
        </div>
      )}
    </div>
  );
});

Tooltip.displayName = 'Tooltip';

export default Tooltip;
