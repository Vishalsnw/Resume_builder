// client/src/components/common/inputs/RadioGroup.tsx

import Tooltip from '@/components/common/ui/Tooltip';
import RadioGroup from '@/components/common/forms/RadioGroup';
import React, { forwardRef } from 'react';
import { FiCheck, FiAlertCircle, FiHelpCircle } from 'react-icons/fi';

interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  metadata?: {
    [key: string]: any;
  };
}

interface RadioGroupProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  name: string;
  label?: string;
  helperText?: string;
  error?: string;
  variant?: 'default' | 'card' | 'button';
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical' | 'grid';
  required?: boolean;
  disabled?: boolean;
  tooltip?: string;
  className?: string;
  containerClassName?: string;
  optionClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  helperClassName?: string;
  currentDateTime?: string;
  currentUser?: string;
}

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(({
  options,
  value,
  onChange,
  name,
  label,
  helperText,
  error,
  variant = 'default',
  size = 'md',
  layout = 'vertical',
  required = false,
  disabled = false,
  tooltip,
  className = '',
  containerClassName = '',
  optionClassName = '',
  labelClassName = '',
  errorClassName = '',
  helperClassName = '',
  currentDateTime = '2025-06-07 19:05:44',
  currentUser = 'Vishalsnw',
}, ref) => {
  // Size configurations
  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  // Layout styles
  const layoutStyles = {
    horizontal: 'flex flex-row space-x-4',
    vertical: 'flex flex-col space-y-2',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  };

  // Variant styles for options
  const optionVariantStyles = {
    default: `
      relative flex items-start
      ${size === 'sm' ? 'space-x-2' : size === 'lg' ? 'space-x-4' : 'space-x-3'}
    `,
    card: `
      relative rounded-lg border p-4 cursor-pointer
      transition-all duration-200
      hover:border-blue-500
      ${error ? 'border-red-300' : 'border-gray-200'}
    `,
    button: `
      relative rounded-md px-4 py-2
      transition-all duration-200
      border border-gray-300
      hover:border-blue-500
      focus:outline-none focus:ring-2 focus:ring-blue-500
    `,
  };

  const handleChange = (optionValue: string) => {
    if (!disabled) {
      onChange?.(optionValue);
    }
  };

  const renderOption = (option: Option) => {
    const isSelected = value === option.value;
    const isDisabled = disabled || option.disabled;

    const optionContent = (
      <>
        {variant === 'default' && (
          <span className="flex h-5 items-center">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isSelected}
              disabled={isDisabled}
              onChange={() => handleChange(option.value)}
              className={`
                h-4 w-4
                border-gray-300
                text-blue-600
                focus:ring-blue-500
                disabled:opacity-50
                disabled:cursor-not-allowed
              `}
            />
          </span>
        )}

        <div className="flex flex-col">
          <div className="flex items-center">
            {option.icon && (
              <span className="mr-2 text-gray-500">{option.icon}</span>
            )}
            <span className={`font-medium ${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>
              {option.label}
            </span>
          </div>
          {option.description && (
            <p className={`mt-1 ${sizeStyles[size]} text-gray-500`}>
              {option.description}
            </p>
          )}
        </div>

        {isSelected && variant !== 'default' && (
          <div className="absolute top-2 right-2 text-blue-600">
            <FiCheck className="w-5 h-5" />
          </div>
        )}
      </>
    );

    if (variant === 'default') {
      return (
        <label className={`
          ${optionVariantStyles.default}
          ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${optionClassName}
        `}>
          {optionContent}
        </label>
      );
    }

    return (
      <div
        onClick={() => !isDisabled && handleChange(option.value)}
        className={`
          ${optionVariantStyles[variant]}
          ${isSelected ? 'border-blue-500 bg-blue-50' : ''}
          ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${optionClassName}
        `}
      >
        {optionContent}
      </div>
    );
  };

  return (
    <div ref={ref} className={`${containerClassName}`}>
      {/* Label and Tooltip */}
      {label && (
        <div className="flex items-center space-x-1 mb-2">
          <label className={`block font-medium text-gray-700 ${labelClassName}`}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {tooltip && (
            <div className="relative group">
              <FiHelpCircle className="w-4 h-4 text-gray-400" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-sm text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {tooltip}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Options */}
      <div className={`
        ${layoutStyles[layout]}
        ${className}
      `}>
        {options.map((option) => (
          <div key={option.value}>
            {renderOption(option)}
          </div>
        ))}
      </div>

      {/* Error or Helper Text */}
      {(error || helperText) && (
        <div className="mt-1">
          {error ? (
            <p className={`flex items-center text-sm text-red-600 ${errorClassName}`}>
              <FiAlertCircle className="w-4 h-4 mr-1" />
              {error}
            </p>
          ) : (
            <p className={`text-sm text-gray-500 ${helperClassName}`}>
              {helperText}
            </p>
          )}
        </div>
      )}

      {/* Metadata */}
      <div className="mt-2 text-xs text-gray-500">
        Last modified by {currentUser} at {currentDateTime}
      </div>
    </div>
  );
});

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
