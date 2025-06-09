import FileInput from '@/components/FileInput';
import FileInputWrapper from '@/components/FileInputWrapper';
import React, { useRef } from 'react';
import { FileInputWrapper } from './components/FileInputWrapper';

interface FileInputProps {
  accept?: string;
  onChange?: (file: File | null) => void;
  // Add other props as needed
}

export const FileInput: React.FC<FileInputProps> = ({
  accept = "image/*",
  onChange,
  ...props
}) => {
  // Create a ref that will be used safely
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (onChange) onChange(file);
  };

  // Use our wrapper component instead of raw input
  return (
    <FileInputWrapper
      fileInputRef={fileInputRef}
      accept={accept}
      onChange={handleChange}
      {...props}
    />
  );
};
