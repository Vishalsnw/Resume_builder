// client/src/components/common/buttons/SecondaryButton.tsx

import React from 'react';
import {
  FiLoader,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiChevronRight,
  FiLink2 // Changed from FiExternalLink to FiLink2 which exists in react-icons/fi
} from 'react-icons/fi';

interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'default' | 'outline' | 'ghost' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  withHoverEffect?: boolean;
  status?: 'idle' | 'loading' | 'success' | 'error';
  className?: string;
  external?: boolean;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  ariaLabel?: string;
  testId?: string;
  minimal?: boolean;
  active?: boolean;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'default',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  rounded = 'md',
  withHoverEffect = true,
  status = 'idle',
  className = '',
  external = false,
  href,
  target,
  ariaLabel,
  testId,
  minimal = false,
  active = false,
}) => {
  // Base styles configuration
  const baseStyles = {
    sm: 'px-2.5 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg',
    xl: 'px-6 py-3 text-xl',
  };

  const variantStyles = {
    default: `
      bg-white border border-gray-300 text-gray-700
      hover:bg-gray-50 hover:text-gray-900
      focus:ring-gray-500
      active:bg-gray-100
    `,
    outline: `
      bg-transparent border-2 border-gray-500 text-gray-700
      hover:bg-gray-50 hover:border-gray-600
      focus:ring-gray-500
      active:bg-gray-100
    `,
    ghost: `
      bg-transparent text-gray-600
      hover:bg-gray-100 hover:text-gray-900
      focus:ring-gray-500
      active:bg-gray-200
    `,
    light: `
      bg-gray-100 text-gray-700
      hover:bg-gray-200
      focus:ring-gray-400
      active:bg-gray-300
    `,
    dark: `
      bg-gray-800 text-white
      hover:bg-gray-700
      focus:ring-gray-500
      active:bg-gray-900
    `,
  };

  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const statusIcons = {
    loading: <FiLoader className="animate-spin" />,
    success: <FiCheck />,
    error: <FiX />,
    idle: icon,
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading || status === 'loading') return;
    onClick?.(event);
  };

  const buttonClasses = [
    'inline-flex items-center justify-center',
    'font-medium transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    minimal ? '' : baseStyles[size],
    variantStyles[variant],
    roundedStyles[rounded],
    fullWidth ? 'w-full' : '',
    disabled || loading || status === 'loading' ? 'opacity-50 cursor-not-allowed' : '',
    withHoverEffect && !disabled ? 'transform hover:-translate-y-0.5' : '',
    active ? 'ring-2 ring-offset-2 ring-gray-500' : '',
    className,
  ].join(' ');

  const content = (
    <>
      {/* Icon - Left Position */}
      {iconPosition === 'left' && (statusIcons[status] || icon) && (
        <span className={`mr-2 ${size === 'sm' ? 'text-sm' : ''}`}>
          {statusIcons[status] || icon}
        </span>
      )}

      {/* Button Text */}
      <span>{children}</span>

      {/* Icon - Right Position */}
      {iconPosition === 'right' && (statusIcons[status] || icon) && (
        <span className={`ml-2 ${size === 'sm' ? 'text-sm' : ''}`}>
          {statusIcons[status] || icon}
        </span>
      )}

      {/* External Link Icon */}
      {external && (
        <FiLink2 className={`ml-2 ${size === 'sm' ? 'text-sm' : ''}`} />
      )}
    </>
  );

  // If href is provided, render as anchor tag
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={buttonClasses}
        aria-label={ariaLabel}
        data-testid={testId}
      >
        {content}
      </a>
    );
  }

  // Otherwise, render as button
  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading || status === 'loading'}
      className={buttonClasses}
      aria-label={ariaLabel}
      data-testid={testId}
    >
      {content}
    </button>
  );
};

export default SecondaryButton;
