// client/src/components/common/modals/Modal.tsx

import Modal from '@/components/common/feedback/Modal';
import Footer from '@/components/layout/Footer';
import React, { forwardRef, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  FiX,
  FiMaximize2,
  FiMinimize2,
  FiAlertTriangle,
  FiInfo,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  footer?: React.ReactNode;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  fullScreenButton?: boolean;
  centered?: boolean;
  scrollBehavior?: 'inside' | 'outside';
  preventClose?: boolean;
  initialFocus?: React.RefObject<HTMLElement>;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  overlayClassName?: string;
  currentDateTime?: string;
  currentUser?: string;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  type = 'default',
  footer,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  fullScreenButton = false,
  centered = true,
  scrollBehavior = 'inside',
  preventClose = false,
  initialFocus,
  className = '',
  contentClassName = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  overlayClassName = '',
  currentDateTime = '2025-06-07 19:12:36',
  currentUser = 'Vishalsnw',
}, ref) => {
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Size configurations
  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full m-4',
  };

  // Type configurations
  const typeStyles = {
    default: '',
    success: 'border-l-4 border-green-500',
    error: 'border-l-4 border-red-500',
    warning: 'border-l-4 border-yellow-500',
    info: 'border-l-4 border-blue-500',
  };

  const typeIcons = {
    default: null,
    success: <FiCheckCircle className="w-6 h-6 text-green-500" />,
    error: <FiAlertCircle className="w-6 h-6 text-red-500" />,
    warning: <FiAlertTriangle className="w-6 h-6 text-yellow-500" />,
    info: <FiInfo className="w-6 h-6 text-blue-500" />,
  };

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      // Focus trap
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) || [];
      
      if (initialFocus?.current) {
        initialFocus.current.focus();
      } else if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialFocus]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || preventClose) return;

      if (event.key === 'Escape' && closeOnEscape) {
        onClose();
      }

      if (event.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) || [];
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, preventClose, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (
      closeOnOutsideClick &&
      !preventClose &&
      event.target === event.currentTarget
    ) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className={`
        fixed inset-0 z-50
        overflow-y-auto
        ${overlayClassName}
      `}
      onClick={handleOverlayClick}
    >
      <div className={`
        min-h-screen
        px-4 py-6
        ${centered ? 'flex items-center justify-center' : ''}
      `}>
        <div
          ref={modalRef}
          className={`
            relative
            bg-white
            rounded-lg
            shadow-xl
            ${isFullScreen ? 'w-full h-full fixed inset-0 rounded-none' : sizeStyles[size]}
            ${typeStyles[type]}
            ${className}
          `}
        >
          {/* Header */}
          <div className={`
            flex items-center justify-between
            px-6 py-4
            border-b border-gray-200
            ${headerClassName}
          `}>
            <div className="flex items-center space-x-3">
              {typeIcons[type]}
              <h2 className="text-xl font-semibold text-gray-900">
                {title}
              </h2>
            </div>
            
            <div className="flex items-center space-x-2">
              {fullScreenButton && (
                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  {isFullScreen ? (
                    <FiMinimize2 className="w-5 h-5" />
                  ) : (
                    <FiMaximize2 className="w-5 h-5" />
                  )}
                </button>
              )}
              
              {showCloseButton && !preventClose && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          {/* Body */}
          <div className={`
            ${scrollBehavior === 'inside' ? 'overflow-y-auto' : ''}
            ${isFullScreen ? 'flex-grow' : ''}
            px-6 py-4
            ${bodyClassName}
          `}>
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className={`
              px-6 py-4
              border-t border-gray-200
              ${footerClassName}
            `}>
              {footer}
            </div>
          )}

          {/* Metadata */}
          <div className="px-6 py-2 text-xs text-gray-500 border-t border-gray-200">
            Last modified by {currentUser} at {currentDateTime}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      {modalContent}
    </>,
    document.body
  );
});

Modal.displayName = 'Modal';

export default Modal;
