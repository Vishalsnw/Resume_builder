// client/src/components/common/inputs/Input.tsx

import [id] from '@/pages/resumes/edit/[id]';
import 500 from '@/pages/500';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import Input from '@/components/common/forms/Input';
import Tooltip from '@/components/common/ui/Tooltip';
import React, { forwardRef, useState } from 'react';
import {
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiCheck,
  FiX,
  FiHelpCircle,
  FiLoader
} from 'react-icons/fi';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'outlined' | 'filled' | 'underlined';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  required?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
  tooltip?: string;
  clearable?: boolean;
  onClear?: () => void;
  validation?: (value: string) => boolean | string;
  formatValue?: (value: string) => string;
  copyable?: boolean;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  helperClassName?: string;
  errorClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  helperText,
  error,
  success,
  loading,
  leftIcon,
  rightIcon,
  variant = 'outlined',
  size = 'md',
  fullWidth = false,
  required = false,
  showCharCount = false,
  maxLength,
  tooltip,
  clearable = false,
  onClear,
  validation,
  formatValue,
  copyable = false,
  className = '',
  containerClassName = '',
  labelClassName = '',
  inputClassName = '',
  helperClassName = '',
  errorClassName = '',
  type = 'text',
  disabled = false,
  value = '',
  onChange,
  onBlur,
  onFocus,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [showTooltip, setShowTooltip] = useState(false);

  // Size variations
  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  };

  // Variant styles
  const variantStyles = {
    outlined: `
      border rounded-md
      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
      ${error ? 'border-red-500' : success ? 'border-green-500' : 'border-gray-300'}
    `,
    filled: `
      border-0 bg-gray-100
      focus:bg-white focus:ring-2 focus:ring-blue-500
      ${error ? 'bg-red-50' : success ? 'bg-green-50' : ''}
    `,
    underlined: `
      border-b-2 rounded-none px-0
      focus:border-blue-500
      ${error ? 'border-red-500' : success ? 'border-green-500' : 'border-gray-300'}
    `,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Apply formatting if provided
    if (formatValue) {
      newValue = formatValue(newValue);
    }

    // Validate if validation function is provided
    if (validation) {
      const validationResult = validation(newValue);
      if (typeof validationResult === 'string') {
        setValidationMessage(validationResult);
      } else {
        setValidationMessage('');
      }
    }

    if (onChange) {
      e.target.value = newValue;
      onChange(e);
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      const event = {
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value.toString());
      toast.success('Copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const inputClasses = [
    'w-full',
    'transition-all duration-200',
    'focus:outline-none',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    sizeStyles[size],
    variantStyles[variant],
    inputClassName,
  ].join(' ');

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
      {/* Label */}
      {label && (
        <div className="flex items-center mb-1">
          <label 
            className={`block text-sm font-medium text-gray-700 ${labelClassName}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {/* Tooltip */}
          {tooltip && (
            <div
              className="relative ml-1"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <FiHelpCircle className="w-4 h-4 text-gray-400" />
              {showTooltip && (
                <div className="absolute z-10 w-48 p-2 mt-1 text-sm text-white bg-gray-900 rounded-md shadow-lg">
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">{leftIcon}</span>
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          disabled={disabled || loading}
          className={`
            ${inputClasses}
            ${leftIcon ? 'pl-10' : ''}
            ${(rightIcon || type === 'password' || clearable || copyable) ? 'pr-10' : ''}
          `}
          value={value}
          onChange={handleChange}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          maxLength={maxLength}
          {...props}
        />

        {/* Right Elements */}
        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
          {/* Loading Spinner */}
          {loading && (
            <FiLoader className="w-4 h-4 text-gray-400 animate-spin" />
          )}

          {/* Success/Error Icons */}
          {!loading && (
            <>
              {success && <FiCheck className="w-4 h-4 text-green-500" />}
              {error && <FiAlertCircle className="w-4 h-4 text-red-500" />}
            </>
          )}

          {/* Password Toggle */}
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          )}

          {/* Clear Button */}
          {clearable && value && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX />
            </button>
          )}

          {/* Copy Button */}
          {copyable && value && (
            <button
              type="button"
              onClick={handleCopy}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          )}

          {/* Custom Right Icon */}
          {rightIcon}
        </div>
      </div>

      {/* Helper Text / Error Message / Character Count */}
      <div className="mt-1 flex justify-between">
        <div>
          {error && (
            <p className={`text-sm text-red-600 ${errorClassName}`}>
              {error}
            </p>
          )}
          {!error && helperText && (
            <p className={`text-sm text-gray-500 ${helperClassName}`}>
              {helperText}
            </p>
          )}
          {validationMessage && (
            <p className="text-sm text-red-600">
              {validationMessage}
            </p>
          )}
        </div>
        {showCharCount && maxLength && (
          <p className="text-sm text-gray-500">
            {value.toString().length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
