// client/src/components/common/buttons/PrimaryButton.tsx

// REMOVED INVALID IMPORT
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import PrimaryButton from '@/components/common/buttons/PrimaryButton';
import React from 'react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  isLoading?: boolean; 
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  withRipple?: boolean;
  status?: 'idle' | 'loading' | 'success' | 'error';
  className?: string;
  secure?: boolean;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  ariaLabel?: string;
  testId?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  isLoading,
  icon,
  iconPosition = 'left',
  rounded = 'md',
  withRipple = true,
  status = 'idle',
  className = '',
  secure = false,
  href,
  target,
  ariaLabel,
  testId,
}) => {
  const buttonLoading = isLoading !== undefined ? isLoading : loading;
  
  const [rippleStyle, setRippleStyle] = React.useState<React.CSSProperties>({});
  const [isRippling, setIsRippling] = React.useState(false);

  // Base styles configuration
  const baseStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
  };

  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  // Simple status icons using Unicode characters
  const getStatusIcon = () => {
    switch(status) {
      case 'loading':
        return <span className="animate-spin inline-block">⟳</span>;
      case 'success':
        return <span>✓</span>;
      case 'error':
        return <span>✕</span>;
      default:
        return icon;
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || buttonLoading || status === 'loading') return;

    if (withRipple) {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      setRippleStyle({
        width: `${size}px`,
        height: `${size}px`,
        top: `${y}px`,
        left: `${x}px`,
      });

      setIsRippling(true);
      setTimeout(() => setIsRippling(false), 600);
    }

    onClick?.(event);
  };

  const buttonClasses = [
    'relative inline-flex items-center justify-center',
    'font-medium transition-colors duration-150 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    baseStyles[size],
    variantStyles[variant],
    roundedStyles[rounded],
    fullWidth ? 'w-full' : '',
    disabled || buttonLoading || status === 'loading' ? 'opacity-50 cursor-not-allowed' : '',
    'overflow-hidden',
    className,
  ].join(' ');

  const content = (
    <>
      {/* Icon - Left Position */}
      {iconPosition === 'left' && getStatusIcon() && (
        <span className={`mr-2 ${size === 'sm' ? 'text-sm' : ''}`}>
          {getStatusIcon()}
        </span>
      )}

      {/* Secure Icon */}
      {secure && (
        <span className={`mr-2 ${size === 'sm' ? 'text-sm' : ''}`}>
          🔒
        </span>
      )}

      {/* Button Text */}
      <span>{buttonLoading ? 'Loading...' : children}</span>

      {/* Icon - Right Position */}
      {iconPosition === 'right' && getStatusIcon() && (
        <span className={`ml-2 ${size === 'sm' ? 'text-sm' : ''}`}>
          {getStatusIcon()}
        </span>
      )}

      {/* Ripple Effect */}
      {withRipple && isRippling && (
        <span
          className="absolute bg-white bg-opacity-30 rounded-full animate-ripple"
          style={rippleStyle}
        />
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
      disabled={disabled || buttonLoading || status === 'loading'}
      className={buttonClasses}
      aria-label={ariaLabel}
      data-testid={testId}
    >
      {content}
    </button>
  );
};

export default PrimaryButton;
