import React, { forwardRef, useRef, InputHTMLAttributes } from 'react';

// Create a wrapper component around input file that handles the ref properly
interface FileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  accept?: string;
  fileInputRef?: React.RefObject<HTMLInputElement>;
}

export const FileInputWrapper: React.FC<FileInputProps> = ({
  accept,
  fileInputRef,
  ...props
}) => {
  // Create a local ref if none is provided
  const localRef = useRef<HTMLInputElement>(null);
  
  // Use the provided ref or fallback to local ref
  const inputRef = fileInputRef || localRef;
  
  // Handle ref assignment safely
  const refCallback = (element: HTMLInputElement | null) => {
    // Use this approach to bypass TypeScript's readonly protection
    if (element) {
      (inputRef as any).current = element;
    }
  };

  return (
    <input
      ref={refCallback}
      type="file"
      accept={accept}
      {...props}
    />
  );
};
