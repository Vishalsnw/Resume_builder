// client/src/components/common/inputs/Select.tsx

import { default as indexImport } from '@/pages/help/index';
// REMOVED INVALID IMPORT
import [...nextauth] from '@/pages/api/auth/[...nextauth]';

// NOTE: Renamed to avoid conflict with local declarations:
// index → indexImport
import Input from '@/components/common/forms/Input';
import Dropdown from '@/components/common/ui/Dropdown';
import Select from '@/components/common/forms/Select';
import React, { forwardRef, useState, useRef, useEffect } from 'react';
import {
  FiChevronDown,
  FiCheck,
  FiX,
  FiSearch,
  FiAlertCircle,
  FiLoader
} from 'react-icons/fi';

interface Option {
  value: string | number;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  group?: string;
}

interface SelectProps {
  options: Option[];
  value?: string | number | (string | number)[];
  onChange?: (value: string | number | (string | number)[]) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  loading?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outlined' | 'filled' | 'underlined';
  maxHeight?: number;
  maxSelected?: number;
  grouped?: boolean;
  customOption?: (option: Option) => React.ReactNode;
  customSelectedValue?: (selected: Option | Option[]) => React.ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
  containerClassName?: string;
  menuClassName?: string;
  optionClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  helperClassName?: string;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  error,
  helperText,
  disabled = false,
  loading = false,
  multiple = false,
  searchable = false,
  clearable = true,
  required = false,
  size = 'md',
  variant = 'outlined',
  maxHeight = 300,
  maxSelected,
  grouped = false,
  customOption,
  customSelectedValue,
  onOpen,
  onClose,
  className = '',
  containerClassName = '',
  menuClassName = '',
  optionClassName = '',
  labelClassName = '',
  errorClassName = '',
  helperClassName = '',
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Size variations
  const sizeStyles = {
    sm: 'py-1 px-2 text-sm',
    md: 'py-2 px-3 text-base',
    lg: 'py-3 px-4 text-lg',
  };

  // Variant styles
  const variantStyles = {
    outlined: `
      border rounded-md
      focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500
      ${error ? 'border-red-500' : 'border-gray-300'}
    `,
    filled: `
      border-0 bg-gray-100
      focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500
      ${error ? 'bg-red-50' : ''}
    `,
    underlined: `
      border-b-2 rounded-none px-0
      focus-within:border-blue-500
      ${error ? 'border-red-500' : 'border-gray-300'}
    `,
  };

  const selectedOptions = multiple
    ? options.filter(option => Array.isArray(value) && value.includes(option.value))
    : options.find(option => option.value === value);

  const filteredOptions = searchQuery
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const groupedOptions = grouped
    ? filteredOptions.reduce((acc, option) => {
        const group = option.group || 'Other';
        if (!acc[group]) acc[group] = [];
        acc[group].push(option);
        return acc;
      }, {} as { [key: string]: Option[] })
    : { 'default': filteredOptions };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      onOpen?.();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const openDropdown = () => {
    if (!disabled && !loading) {
      setIsOpen(true);
      setSearchQuery('');
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setHighlightedIndex(-1);
    onClose?.();
  };

  const handleSelect = (option: Option) => {
    if (option.disabled) return;

    if (multiple) {
      const newValue = Array.isArray(value) ? [...value] : [];
      const index = newValue.indexOf(option.value);

      if (index === -1) {
        if (maxSelected && newValue.length >= maxSelected) {
          return;
        }
        newValue.push(option.value);
      } else {
        newValue.splice(index, 1);
      }

      onChange?.(newValue);
    } else {
      onChange?.(option.value);
      closeDropdown();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault();
        openDropdown();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;

      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;

      case 'Enter':
        event.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;

      case 'Escape':
        event.preventDefault();
        closeDropdown();
        break;
    }
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    onChange?.(multiple ? [] : '');
  };

  const renderOption = (option: Option) => {
    if (customOption) {
      return customOption(option);
    }

    const isSelected = multiple
      ? Array.isArray(value) && value.includes(option.value)
      : option.value === value;

    return (
      <div
        className={`
          flex items-center px-4 py-2 cursor-pointer
          ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'}
          ${isSelected ? 'bg-blue-100' : ''}
          ${optionClassName}
        `}
      >
        {option.icon && <span className="mr-2">{option.icon}</span>}
        <div className="flex-1">
          <div className="font-medium">{option.label}</div>
          {option.description && (
            <div className="text-sm text-gray-500">{option.description}</div>
          )}
        </div>
        {isSelected && <FiCheck className="w-5 h-5 text-blue-500" />}
      </div>
    );
  };

  return (
    <div className={`relative ${containerClassName}`} ref={containerRef}>
      {/* Label */}
      {label && (
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Select Container */}
      <div
        ref={ref}
        className={`
          relative
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        onClick={openDropdown}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={disabled}
      >
        {/* Selected Value(s) */}
        <div className="flex items-center min-h-[20px]">
          {customSelectedValue ? (
            customSelectedValue(multiple ? selectedOptions : selectedOptions as Option)
          ) : multiple ? (
            Array.isArray(selectedOptions) && selectedOptions.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedOptions.map(option => (
                  <span
                    key={option.value}
                    className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800"
                  >
                    {option.label}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(option);
                      }}
                      className="ml-1 hover:text-blue-500"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )
          ) : (
            <span className={value ? '' : 'text-gray-500'}>
              {selectedOptions ? (selectedOptions as Option).label : placeholder}
            </span>
          )}
        </div>

        {/* Right Icons */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {loading ? (
            <FiLoader className="w-5 h-5 text-gray-400 animate-spin" />
          ) : clearable && (value || (Array.isArray(value) && value.length > 0)) ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:text-gray-600"
            >
              <FiX className="w-4 h-4" />
            </button>
          ) : (
            <FiChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isOpen ? 'transform rotate-180' : ''
              }`}
            />
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className={`
            absolute z-50 w-full mt-1
            bg-white rounded-md shadow-lg
            border border-gray-200
            ${menuClassName}
          `}
          style={{ maxHeight }}
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search..."
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Options List */}
          <div className="overflow-auto" style={{ maxHeight: maxHeight - (searchable ? 53 : 0) }}>
            {Object.entries(groupedOptions).map(([group, groupOptions]) => (
              <div key={group}>
                {grouped && group !== 'default' && (
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                    {group}
                  </div>
                )}
                {groupOptions.map((option, index) => (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className={`
                      ${highlightedIndex === index ? 'bg-blue-50' : ''}
                    `}
                  >
                    {renderOption(option)}
                  </div>
                ))}
              </div>
            ))}
            
            {filteredOptions.length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-500 text-center">
                No options found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Helper Text / Error Message */}
      {(error || helperText) && (
        <div className="mt-1">
          {error ? (
            <p className={`text-sm text-red-600 ${errorClassName}`}>
              <FiAlertCircle className="inline-block mr-1" />
              {error}
            </p>
          ) : (
            <p className={`text-sm text-gray-500 ${helperClassName}`}>
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
