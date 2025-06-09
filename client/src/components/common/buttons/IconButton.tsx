// client/src/components/common/buttons/IconButton.tsx

import 500 from '@/pages/500';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import Badge from '@/components/common/ui/Badge';
import IconButton from '@/components/common/buttons/IconButton';
import Tooltip from '@/components/common/ui/Tooltip';
import React from 'react';
import {
  FiLoader,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiHelpCircle
} from 'react-icons/fi';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  rounded?: boolean;
  tooltip?: string;
  status?: 'idle' | 'loading' | 'success' | 'error';
  className?: string;
  ariaLabel: string;
  testId?: string;
  withRing?: boolean;
  active?: boolean;
  type?: 'button' | 'submit' | 'reset';
  badge?: string | number;
  badgeColor?: 'red' | 'green' | 'blue' | 'yellow' | 'gray';
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  rounded = true,
  tooltip,
  status = 'idle',
  className = '',
  ariaLabel,
  testId,
  withRing = true,
  active = false,
  type = 'button',
  badge,
  badgeColor = 'red',
}) => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  // Size configurations
  const sizeStyles = {
    xs: 'p-1 text-xs',
    sm: 'p-1.5 text-sm',
    md: 'p-2 text-base',
    lg: 'p-2.5 text-lg',
    xl: 'p-3 text-xl',
  };

  // Variant configurations
  const variantStyles = {
    primary: `
      bg-blue-600 text-white
      hover:bg-blue-700
      focus:ring-blue-500
      active:bg-blue-800
    `,
    secondary: `
      bg-gray-600 text-white
      hover:bg-gray-700
      focus:ring-gray-500
      active:bg-gray-800
    `,
    success: `
      bg-green-600 text-white
      hover:bg-green-700
      focus:ring-green-500
      active:bg-green-800
    `,
    danger: `
      bg-red-600 text-white
      hover:bg-red-700
      focus:ring-red-500
      active:bg-red-800
    `,
    warning: `
      bg-yellow-500 text-white
      hover:bg-yellow-600
      focus:ring-yellow-400
      active:bg-yellow-700
    `,
    info: `
      bg-blue-500 text-white
      hover:bg-blue-600
      focus:ring-blue-400
      active:bg-blue-700
    `,
    ghost: `
      bg-transparent text-gray-600
      hover:bg-gray-100
      focus:ring-gray-400
      active:bg-gray-200
    `,
  };

  // Badge color styles
  const badgeStyles = {
    red: 'bg-red-500 text-white',
    green: 'bg-green-500 text-white',
    blue: 'bg-blue-500 text-white',
    yellow: 'bg-yellow-500 text-white',
    gray: 'bg-gray-500 text-white',
  };

  const statusIcons = {
    loading: <FiLoader className="animate-spin" />,
    success: <FiCheck />,
    error: <FiX />,
    idle: icon,
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    onClick?.(event);
  };

  const buttonClasses = [
    'inline-flex items-center justify-center',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none',
    withRing ? 'focus:ring-2 focus:ring-offset-2' : '',
    sizeStyles[size],
    variantStyles[variant],
    rounded ? 'rounded-full' : 'rounded-md',
    disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105',
    active ? 'ring-2 ring-offset-2' : '',
    'relative',
    className,
  ].join(' ');

  return (
    <div className="relative inline-block">
      <button
        type={type}
        onClick={handleClick}
        disabled={disabled || loading}
        className={buttonClasses}
        aria-label={ariaLabel}
        data-testid={testId}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
      >
        {statusIcons[status]}

        {/* Badge */}
        {badge && (
          <span
            className={`
              absolute -top-2 -right-2
              min-w-[1.25rem] h-5
              flex items-center justify-center
              text-xs font-bold
              rounded-full
              px-1
              ${badgeStyles[badgeColor]}
            `}
          >
            {badge}
          </span>
        )}
      </button>

      {/* Tooltip */}
      {tooltip && showTooltip && (
        <div
          className={`
            absolute z-50
            px-2 py-1
            text-sm text-white
            bg-gray-900
            rounded
            whitespace-nowrap
            transform
            ${size === 'xs' || size === 'sm' ? '-translate-y-full -translate-x-1/2 -mt-1' : '-translate-y-full -translate-x-1/2 -mt-2'}
            left-1/2
          `}
          role="tooltip"
        >
          {tooltip}
          <div
            className="
              absolute
              left-1/2
              transform -translate-x-1/2
              top-full
              w-2 h-2
              bg-gray-900
              rotate-45
            "
          />
        </div>
      )}
    </div>
  );
};

export default IconButton;
