// src/components/FileUpload.jsx
import FileUpload from '@/components/common/forms/FileUpload';
import React, { useRef } from 'react';
import FileInput from './FileInput';

const FileUpload = (props) => {
  // Create a ref object that we'll use to store the API
  const fileInputRef = { api: null };
  
  const handleUploadClick = () => {
    // Use the API instead of accessing .current
    if (fileInputRef.api) {
      fileInputRef.api.click();
    }
  };

  return (
    <div>
      <FileInput
        fileInputRef={fileInputRef}
        accept={props.accept || "image/*"}
        onChange={props.onChange}
        style={{ display: 'none' }}
      />
      <button onClick={handleUploadClick}>
        Upload File
      </button>
    </div>
  );
};

export default FileUpload;
