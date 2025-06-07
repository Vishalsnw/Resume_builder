// client/src/components/common/inputs/FileUpload.tsx

import React, { forwardRef, useState, useRef } from 'react';
import {
  FiUpload,
  FiFile,
  FiImage,
  FiX,
  FiAlertCircle,
  FiCheck,
  FiPaperclip,
  FiFilm,
  FiMusic,
  FiArchive,
  FiCode
} from 'react-icons/fi';

interface FileUploadProps {
  onChange?: (files: File[]) => void;
  onDelete?: (file: File) => void;
  label?: string;
  helperText?: string;
  error?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  preview?: boolean;
  dragDrop?: boolean;
  progress?: number;
  showFileList?: boolean;
  previewType?: 'grid' | 'list';
  variant?: 'outlined' | 'filled' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  previewClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  helperClassName?: string;
  value?: File[];
  allowedTypes?: string[];
  currentDateTime?: string;
  currentUser?: string;
}

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(({
  onChange,
  onDelete,
  label,
  helperText,
  error,
  accept,
  multiple = false,
  maxSize,
  maxFiles = 10,
  preview = true,
  dragDrop = true,
  progress,
  showFileList = true,
  previewType = 'list',
  variant = 'outlined',
  size = 'md',
  required = false,
  disabled = false,
  className = '',
  containerClassName = '',
  previewClassName = '',
  labelClassName = '',
  errorClassName = '',
  helperClassName = '',
  value = [],
  allowedTypes = [],
  currentDateTime = '2025-06-07 19:03:39',
  currentUser = 'Vishalsnw'
}, ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Size configurations
  const sizeStyles = {
    sm: 'p-2 text-sm',
    md: 'p-4 text-base',
    lg: 'p-6 text-lg',
  };

  // Variant styles
  const variantStyles = {
    outlined: `
      border-2 border-dashed rounded-lg
      ${error ? 'border-red-500' : isDragging ? 'border-blue-500' : 'border-gray-300'}
    `,
    filled: `
      border-0 bg-gray-100 rounded-lg
      ${error ? 'bg-red-50' : isDragging ? 'bg-blue-50' : ''}
    `,
    minimal: 'border-0',
  };

  const fileTypeIcons: { [key: string]: React.ReactNode } = {
    image: <FiImage className="w-6 h-6" />,
    video: <FiFilm className="w-6 h-6" />,
    audio: <FiMusic className="w-6 h-6" />,
    application: <FiCode className="w-6 h-6" />,
    archive: <FiArchive className="w-6 h-6" />,
    default: <FiFile className="w-6 h-6" />,
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`;
    }

    if (allowedTypes.length > 0) {
      const fileType = file.type.split('/')[0];
      if (!allowedTypes.includes(fileType)) {
        return `File type ${fileType} is not allowed`;
      }
    }

    return null;
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(newFiles).forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else if (multiple) {
        if (files.length + validFiles.length < maxFiles) {
          validFiles.push(file);
        } else {
          errors.push(`Maximum ${maxFiles} files allowed`);
        }
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      toast.error(errors.join('\n'));
      return;
    }

    const newFileList = multiple ? [...files, ...validFiles] : validFiles;
    setFiles(newFileList);
    onChange?.(newFileList);
  };

  const handleDelete = (file: File) => {
    const newFiles = files.filter(f => f !== file);
    setFiles(newFiles);
    onChange?.(newFiles);
    onDelete?.(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const renderPreview = (file: File) => {
    const fileType = file.type.split('/')[0];
    const icon = fileTypeIcons[fileType] || fileTypeIcons.default;

    if (preview && fileType === 'image') {
      return (
        <div className="relative group">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-full h-full object-cover rounded"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={() => handleDelete(file)}
              className="text-white hover:text-red-500"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
        <div className="flex items-center space-x-2">
          {icon}
          <div>
            <div className="text-sm font-medium truncate max-w-xs">
              {file.name}
            </div>
            <div className="text-xs text-gray-500">
              {formatFileSize(file.size)}
            </div>
          </div>
        </div>
        <button
          onClick={() => handleDelete(file)}
          className="text-gray-400 hover:text-red-500"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
    );
  };

  return (
    <div className={containerClassName}>
      {/* Label */}
      {label && (
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Upload Area */}
      <div
        className={`
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={(element) => {
            if (typeof ref === 'function') {
              ref(element);
            } else if (ref) {
              ref.current = element;
            }
            fileInputRef.current = element;
          }}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        <div className="text-center">
          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-2">
            <span className="text-gray-600">
              {dragDrop ? (
                isDragging ? 
                  'Drop files here' : 
                  'Drag and drop files, or click to select'
              ) : (
                'Click to select files'
              )}
            </span>
          </div>
          {helperText && (
            <p className={`mt-1 text-sm text-gray-500 ${helperClassName}`}>
              {helperText}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        {typeof progress === 'number' && (
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Preview/File List */}
      {showFileList && files.length > 0 && (
        <div className={`
          mt-4 space-y-2
          ${previewType === 'grid' ? 'grid grid-cols-3 gap-4' : ''}
          ${previewClassName}
        `}>
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`}>
              {renderPreview(file)}
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className={`mt-1 text-sm text-red-600 flex items-center ${errorClassName}`}>
          <FiAlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}

      {/* Upload Info */}
      <div className="mt-2 text-xs text-gray-500">
        Last modified by {currentUser} at {currentDateTime}
      </div>
    </div>
  );
});

FileUpload.displayName = 'FileUpload';

export default FileUpload;
