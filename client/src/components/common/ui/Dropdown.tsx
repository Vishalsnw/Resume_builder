// client/src/components/common/navigation/Dropdown.tsx

import 500 from '@/pages/500';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import Input from '@/components/common/forms/Input';
import Dropdown from '@/components/common/ui/Dropdown';
import Select from '@/components/common/forms/Select';
import React, { forwardRef, useState, useEffect, useRef } from 'react';
import {
  FiChevronDown,
  FiCheck,
  FiChevronRight,
  FiSearch,
  FiX,
  FiMoreVertical
} from 'react-icons/fi';

interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  divider?: boolean;
  children?: DropdownItem[];
  description?: string;
  selected?: boolean;
  shortcut?: string;
}

interface DropdownProps {
  trigger?: React.ReactNode;
  items: DropdownItem[];
  variant?: 'default' | 'contextual' | 'select';
  size?: 'sm' | 'md' | 'lg';
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  maxHeight?: number;
  width?: number | 'auto' | 'trigger';
  searchable?: boolean;
  multiple?: boolean;
  closeOnSelect?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onSelect?: (itemId: string) => void;
  onChange?: (selectedItems: string[]) => void;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  itemClassName?: string;
  currentDateTime?: string;
  currentUser?: string;
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(({
  trigger,
  items,
  variant = 'default',
  size = 'md',
  placement = 'bottom-start',
  maxHeight = 300,
  width = 'auto',
  searchable = false,
  multiple = false,
  closeOnSelect = true,
  disabled = false,
  loading = false,
  onSelect,
  onChange,
  className = '',
  triggerClassName = '',
  menuClassName = '',
  itemClassName = '',
  currentDateTime = '2025-06-07 19:25:56',
  currentUser = 'Vishalsnw',
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Size configurations
  const sizeStyles = {
    sm: 'text-sm py-1.5 px-3',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-2.5 px-5',
  };

  // Filter items based on search query
  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveSubmenu(null);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleSelect = (itemId: string) => {
    if (multiple) {
      const newSelectedItems = selectedItems.includes(itemId)
        ? selectedItems.filter(id => id !== itemId)
        : [...selectedItems, itemId];
      
      setSelectedItems(newSelectedItems);
      onChange?.(newSelectedItems);
    } else {
      onSelect?.(itemId);
      if (closeOnSelect) {
        setIsOpen(false);
      }
    }
  };

  const calculateMenuPosition = () => {
    if (!triggerRef.current) return {};

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuStyles: React.CSSProperties = {
      position: 'absolute',
      width: width === 'trigger' ? triggerRect.width : width === 'auto' ? 'auto' : width,
    };

    if (placement.startsWith('bottom')) {
      menuStyles.top = triggerRect.height + 4;
    } else {
      menuStyles.bottom = triggerRect.height + 4;
    }

    if (placement.endsWith('end')) {
      menuStyles.right = 0;
    } else {
      menuStyles.left = 0;
    }

    return menuStyles;
  };

  const renderItem = (item: DropdownItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = multiple ? selectedItems.includes(item.id) : item.selected;

    return (
      <div key={item.id}>
        {item.divider ? (
          <div className="my-1 border-t border-gray-200" />
        ) : (
          <button
            className={`
              w-full text-left
              flex items-center justify-between
              ${sizeStyles[size]}
              ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
              ${isSelected ? 'bg-blue-50 text-blue-600' : ''}
              ${itemClassName}
            `}
            onClick={() => !item.disabled && handleSelect(item.id)}
            onMouseEnter={() => hasChildren && setActiveSubmenu(item.id)}
            disabled={item.disabled}
          >
            <div className="flex items-center space-x-2">
              {item.icon && <span>{item.icon}</span>}
              <span>{item.label}</span>
              {item.description && (
                <span className="text-sm text-gray-500">
                  {item.description}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {isSelected && <FiCheck className="w-4 h-4" />}
              {item.shortcut && (
                <span className="text-sm text-gray-500">
                  {item.shortcut}
                </span>
              )}
              {hasChildren && (
                <FiChevronRight className="w-4 h-4" />
              )}
            </div>

            {/* Submenu */}
            {hasChildren && activeSubmenu === item.id && (
              <div className="
                absolute left-full top-0 ml-1
                bg-white rounded-lg shadow-lg
                border border-gray-200
              ">
                {item.children.map(child => renderItem(child, depth + 1))}
              </div>
            )}
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      ref={ref}
      className={`relative inline-block ${className}`}
    >
      {/* Trigger */}
      <div
        ref={triggerRef}
        className={`
          inline-flex items-center
          cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${triggerClassName}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {trigger || (
          <button className={`
            inline-flex items-center
            ${sizeStyles[size]}
            ${variant === 'contextual' ? 'hover:bg-gray-100 rounded-full' : 'bg-white border rounded-lg'}
          `}>
            {variant === 'contextual' ? (
              <FiMoreVertical />
            ) : (
              <>
                <span>Select</span>
                <FiChevronDown className="ml-2" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`
            absolute z-50
            min-w-[200px]
            bg-white rounded-lg
            border border-gray-200
            shadow-lg
            ${menuClassName}
          `}
          style={{
            maxHeight,
            overflowY: 'auto',
            ...calculateMenuPosition(),
          }}
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="w-full pl-10 pr-4 py-2 text-sm border rounded-md"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery('')}
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Loading...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No results found
            </div>
          ) : (
            filteredItems.map(item => renderItem(item))
          )}
        </div>
      )}
    </div>
  );
});

Dropdown.displayName = 'Dropdown';

export default Dropdown;
