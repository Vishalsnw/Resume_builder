// client/src/components/common/inputs/TextArea.tsx

// REMOVED INVALID IMPORT
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import Footer from '@/components/layout/Footer';
import TextArea from '@/components/common/forms/TextArea';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import {
  FiAlertCircle,
  FiCheck,
  FiCopy,
  FiRotateCcw,
  FiMaximize2,
  FiMinimize2,
  FiHelpCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  autoResize?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
  variant?: 'outlined' | 'filled' | 'underlined';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  required?: boolean;
  tooltip?: string;
  copyable?: boolean;
  resettable?: boolean;
  expandable?: boolean;
  minRows?: number;
  maxRows?: number;
  onChange?: (value: string) => void;
  onResize?: (height: number) => void;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  helperClassName?: string;
  value?: string;
  defaultValue?: string;
  lastModified?: string;
  lastModifiedBy?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  label,
  helperText,
  error,
  success,
  autoResize = true,
  maxLength,
  showCharCount = true,
  variant = 'outlined',
  size = 'md',
  fullWidth = true,
  required = false,
  tooltip,
  copyable = false,
  resettable = false,
  expandable = false,
  minRows = 3,
  maxRows = 10,
  onChange,
  onResize,
  className = '',
  containerClassName = '',
  labelClassName = '',
  errorClassName = '',
  helperClassName = '',
  value = '',
  defaultValue = '',
  lastModified = '2025-06-07 19:01:50',
  lastModifiedBy = 'Vishalsnw',
  disabled = false,
  ...props
}, ref) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [initialValue] = useState(defaultValue);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Size variations
  const sizeStyles = {
    sm: 'px-2 py-1.5 text-sm',
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

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea || !autoResize) return;

    textarea.style.height = 'auto';
    const computedStyle = window.getComputedStyle(textarea);
    const lineHeight = parseInt(computedStyle.lineHeight);
    
    const minHeight = lineHeight * minRows;
    const maxHeight = lineHeight * maxRows;
    
    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
    
    textarea.style.height = `${newHeight}px`;
    onResize?.(newHeight);
  };

  useEffect(() => {
    adjustHeight();
  }, [value, minRows, maxRows]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (maxLength && newValue.length > maxLength) return;
    onChange?.(newValue);
    if (autoResize) {
      adjustHeight();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success('Copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const handleReset = () => {
    onChange?.(initialValue);
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`relative ${containerClassName} ${fullWidth ? 'w-full' : ''}`}>
      {/* Label and Actions */}
      <div className="flex items-center justify-between mb-1">
        {label && (
          <div className="flex items-center">
            <label className={`block text-sm font-medium text-gray-700 ${labelClassName}`}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {tooltip && (
              <div
                className="relative ml-1"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <FiHelpCircle className="w-4 h-4 text-gray-400" />
                {showTooltip && (
                  <div className="absolute z-10 w-64 p-2 mt-1 text-sm text-white bg-gray-900 rounded-md shadow-lg">
                    {tooltip}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center space-x-2">
          {copyable && (
            <button
              type="button"
              onClick={handleCopy}
              className="text-gray-400 hover:text-gray-600"
              title="Copy to clipboard"
            >
              <FiCopy className="w-4 h-4" />
            </button>
          )}

          {resettable && value !== initialValue && (
            <button
              type="button"
              onClick={handleReset}
              className="text-gray-400 hover:text-gray-600"
              title="Reset to initial value"
            >
              <FiRotateCcw className="w-4 h-4" />
            </button>
          )}

          {expandable && (
            <button
              type="button"
              onClick={handleExpand}
              className="text-gray-400 hover:text-gray-600"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <FiMinimize2 className="w-4 h-4" />
              ) : (
                <FiMaximize2 className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* TextArea */}
      <div className="relative">
        <textarea
          ref={(element) => {
            textareaRef.current = element;
            if (typeof ref === 'function') {
              ref(element);
            } else if (ref) {
              ref.current = element;
            }
          }}
          value={value}
          onChange={handleChange}
          className={`
            w-full
            transition-all duration-200
            focus:outline-none
            resize-none
            ${sizeStyles[size]}
            ${variantStyles[variant]}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${isExpanded ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : ''}
            ${className}
          `}
          disabled={disabled}
          {...props}
        />
      </div>

      {/* Footer */}
      <div className="mt-1 flex items-center justify-between text-sm">
        <div>
          {error ? (
            <p className={`text-red-600 flex items-center ${errorClassName}`}>
              <FiAlertCircle className="w-4 h-4 mr-1" />
              {error}
            </p>
          ) : helperText ? (
            <p className={`text-gray-500 ${helperClassName}`}>
              {helperText}
            </p>
          ) : (
            <p className="text-gray-400 text-xs">
              Last modified by {lastModifiedBy} at {lastModified}
            </p>
          )}
        </div>

        {showCharCount && (
          <div className="text-gray-500">
            {value.length}
            {maxLength && ` / ${maxLength}`}
          </div>
        )}
      </div>
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
