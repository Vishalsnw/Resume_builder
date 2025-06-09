// src/components/FileInput.jsx
import React, { useRef } from 'react';

// This is a JavaScript replacement for your problematic TypeScript component
const FileInput = ({
  accept = "image/*",
  onChange,
  ...props
}) => {
  // Create a callback ref instead of using useRef directly
  const attachRef = (element) => {
    // This is safe in JavaScript without TypeScript checking
    if (element) {
      // Store callback functions rather than trying to assign directly to .current
      if (typeof props.innerRef === 'function') {
        props.innerRef(element);
      }
      
      // Store the element directly on the component
      fileInput.element = element;
    }
  };
  
  // Our file input API
  const fileInput = {
    element: null,
    click: () => {
      if (fileInput.element) {
        fileInput.element.click();
      }
    },
    reset: () => {
      if (fileInput.element) {
        fileInput.element.value = '';
      }
    }
  };

  // Expose the fileInput object for external access
  if (props.fileInputRef) {
    props.fileInputRef.api = fileInput;
  }
  
  // Remove custom props that React doesn't expect
  const { innerRef, fileInputRef, ...inputProps } = props;

  return (
    <input
      ref={attachRef}
      type="file"
      accept={accept}
      onChange={onChange}
      {...inputProps}
    />
  );
};

export default FileInput;
