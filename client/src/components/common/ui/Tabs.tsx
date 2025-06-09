// client/src/components/common/navigation/Tabs.tsx

// REMOVED INVALID IMPORT
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import Tabs from '@/components/common/ui/Tabs';
import React, { forwardRef, useState, useEffect } from 'react';
import {
  FiX,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiMoreHorizontal
} from 'react-icons/fi';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  closable?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultActiveTab?: string;
  onChange?: (tabId: string) => void;
  onClose?: (tabId: string) => void;
  onAdd?: () => void;
  variant?: 'default' | 'pills' | 'underline' | 'contained';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  align?: 'start' | 'center' | 'end';
  fullWidth?: boolean;
  animated?: boolean;
  scrollable?: boolean;
  addable?: boolean;
  closable?: boolean;
  className?: string;
  tabClassName?: string;
  panelClassName?: string;
  currentDateTime?: string;
  currentUser?: string;
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(({
  tabs,
  defaultActiveTab,
  onChange,
  onClose,
  onAdd,
  variant = 'default',
  size = 'md',
  orientation = 'horizontal',
  align = 'start',
  fullWidth = false,
  animated = true,
  scrollable = true,
  addable = false,
  closable = false,
  className = '',
  tabClassName = '',
  panelClassName = '',
  currentDateTime = '2025-06-07 19:23:46',
  currentUser = 'Vishalsnw',
}, ref) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [visibleTabs, setVisibleTabs] = useState<Tab[]>(tabs);
  const [overflowTabs, setOverflowTabs] = useState<Tab[]>([]);
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);

  const tabListRef = React.useRef<HTMLDivElement>(null);

  // Size configurations
  const sizeStyles = {
    sm: 'text-sm py-1 px-2',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-3 px-6',
  };

  // Variant styles
  const variantStyles = {
    default: `
      hover:bg-gray-100
      [&[aria-selected="true"]]:border-blue-500 [&[aria-selected="true"]]:text-blue-600
      [&[aria-selected="true"]]:border-b-2
    `,
    pills: `
      rounded-full
      hover:bg-gray-100
      [&[aria-selected="true"]]:bg-blue-500 [&[aria-selected="true"]]:text-white
    `,
    underline: `
      border-b-2 border-transparent
      hover:border-gray-300
      [&[aria-selected="true"]]:border-blue-500 [&[aria-selected="true"]]:text-blue-600
    `,
    contained: `
      border border-transparent
      first:rounded-l-lg last:rounded-r-lg
      hover:bg-gray-50
      [&[aria-selected="true"]]:bg-white [&[aria-selected="true"]]:border-gray-200 [&[aria-selected="true"]]:text-blue-600
    `,
  };

  // Check if scrolling is needed
  useEffect(() => {
    const checkScroll = () => {
      if (tabListRef.current) {
        const { scrollWidth, clientWidth } = tabListRef.current;
        setShowScrollButtons(scrollWidth > clientWidth);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [tabs]);

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  // Handle tab close
  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    onClose?.(tabId);
  };

  // Handle scroll
  const handleScroll = (direction: 'left' | 'right') => {
    if (tabListRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      tabListRef.current.scrollLeft += scrollAmount;
      setScrollPosition(tabListRef.current.scrollLeft + scrollAmount);
    }
  };

  // Render tab button
  const renderTabButton = (tab: Tab) => (
    <button
      key={tab.id}
      role="tab"
      aria-selected={activeTab === tab.id}
      aria-controls={`panel-${tab.id}`}
      className={`
        inline-flex items-center
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${fullWidth ? 'flex-1' : ''}
        ${tabClassName}
      `}
      onClick={() => !tab.disabled && handleTabChange(tab.id)}
      disabled={tab.disabled}
    >
      {tab.icon && <span className="mr-2">{tab.icon}</span>}
      <span>{tab.label}</span>
      {(closable || tab.closable) && !tab.disabled && (
        <button
          className="ml-2 text-gray-400 hover:text-gray-600"
          onClick={(e) => handleTabClose(e, tab.id)}
        >
          <FiX />
        </button>
      )}
    </button>
  );

  return (
    <div
      ref={ref}
      className={`
        ${orientation === 'vertical' ? 'flex space-x-4' : ''}
        ${className}
      `}
    >
      {/* Tab List */}
      <div className={`
        relative
        ${orientation === 'vertical' ? 'flex-shrink-0' : ''}
      `}>
        {showScrollButtons && scrollable && (
          <>
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow"
              onClick={() => handleScroll('left')}
              disabled={scrollPosition <= 0}
            >
              <FiChevronLeft />
            </button>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow"
              onClick={() => handleScroll('right')}
            >
              <FiChevronRight />
            </button>
          </>
        )}

        <div
          ref={tabListRef}
          role="tablist"
          className={`
            flex
            ${orientation === 'vertical' ? 'flex-col' : ''}
            ${align === 'center' ? 'justify-center' : align === 'end' ? 'justify-end' : ''}
            ${scrollable ? 'overflow-x-auto scrollbar-hide' : ''}
            ${variant === 'contained' ? 'bg-gray-100 p-1 rounded-lg' : ''}
          `}
        >
          {visibleTabs.map(renderTabButton)}

          {overflowTabs.length > 0 && (
            <div className="relative">
              <button
                className="p-2"
                onClick={() => setShowOverflowMenu(!showOverflowMenu)}
              >
                <FiMoreHorizontal />
              </button>
              {showOverflowMenu && (
                <div className="absolute top-full right-0 mt-1 bg-white border rounded-lg shadow-lg py-1">
                  {overflowTabs.map((tab) => (
                    <button
                      key={tab.id}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        handleTabChange(tab.id);
                        setShowOverflowMenu(false);
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {addable && (
            <button
              className="p-2 text-gray-400 hover:text-gray-600"
              onClick={onAdd}
            >
              <FiPlus />
            </button>
          )}
        </div>
      </div>

      {/* Tab Panels */}
      <div className={`
        mt-4
        ${orientation === 'vertical' ? 'flex-1' : ''}
        ${panelClassName}
      `}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={tab.id}
            hidden={activeTab !== tab.id}
            className={`
              ${animated ? 'transition-opacity duration-200' : ''}
              ${activeTab === tab.id ? 'opacity-100' : 'opacity-0'}
            `}
          >
            {tab.content}
          </div>
        ))}
      </div>

      {/* Metadata */}
      <div className="mt-2 text-xs text-gray-500">
        Last modified by {currentUser} at {currentDateTime}
      </div>
    </div>
  );
});

Tabs.displayName = 'Tabs';

export default Tabs;
