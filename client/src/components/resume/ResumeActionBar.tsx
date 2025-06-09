// src/components/resume/ResumeActionBar.tsx

import ResumeActionBar from '@/components/resume/ResumeActionBar';
import Dropdown from '@/components/common/ui/Dropdown';
import React, { useState } from 'react';
import { 
  HiOutlineDownload, 
  HiOutlineSave, 
  HiOutlineUpload, 
  HiOutlineTrash, 
  HiOutlineShare,
  HiOutlinePlus,
  HiOutlineClipboardCopy,
  HiOutlineDocumentDuplicate,
  HiOutlineCloud,
  HiOutlineCloudUpload
} from 'react-icons/hi';

interface ResumeActionBarProps {
  onSave: () => void;
  onDownload: () => void;
  onNew: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onImport: (data: any) => void;
  onShare?: () => void;
  isSaving?: boolean;
  isDownloading?: boolean;
  hasUnsavedChanges?: boolean;
  lastSaved?: string; // ISO date string
  fileName?: string;
}

const ResumeActionBar: React.FC<ResumeActionBarProps> = ({
  onSave,
  onDownload,
  onNew,
  onDelete,
  onDuplicate,
  onImport,
  onShare,
  isSaving = false,
  isDownloading = false,
  hasUnsavedChanges = false,
  lastSaved,
  fileName = 'My Resume'
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  
  // Format the last saved date nicely
  const formattedLastSaved = lastSaved 
    ? new Date(lastSaved).toLocaleString(undefined, { 
        dateStyle: 'medium', 
        timeStyle: 'short' 
      })
    : null;
  
  // Handle file import
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileUploadError(null);
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    if (file.type !== 'application/json') {
      setFileUploadError('Please upload a valid JSON file');
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const resumeData = JSON.parse(e.target?.result as string);
        // Basic validation that this is a resume file
        if (!resumeData || !resumeData.basics) {
          setFileUploadError('Invalid resume file format');
          return;
        }
        onImport(resumeData);
      } catch (error) {
        console.error('Error parsing resume file', error);
        setFileUploadError('Could not parse the file. Please ensure it is valid JSON.');
      }
    };
    
    reader.onerror = () => {
      setFileUploadError('Error reading the file');
    };
    
    reader.readAsText(file);
    
    // Reset the file input
    event.target.value = '';
  };
  
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 flex items-center justify-between">
          {/* Left side: File name and status */}
          <div className="flex items-center space-x-3">
            <div>
              <input
                type="text"
                className="text-lg font-medium text-gray-900 bg-transparent border-0 focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 -ml-2"
                value={fileName}
                onChange={() => {/* Handle file name change */}}
                aria-label="Resume name"
              />
              
              {hasUnsavedChanges && (
                <span className="ml-2 text-xs text-orange-500 font-medium">
                  •&nbsp;Unsaved changes
                </span>
              )}
              
              {formattedLastSaved && !hasUnsavedChanges && (
                <span className="ml-2 text-xs text-gray-500">
                  Last saved: {formattedLastSaved}
                </span>
              )}
              
              {isSaving && (
                <span className="ml-2 text-xs text-blue-500 font-medium">
                  Saving...
                </span>
              )}
            </div>
          </div>
          
          {/* Right side: Actions */}
          <div className="flex items-center space-x-2">
            {/* New Resume Button */}
            <button
              type="button"
              onClick={onNew}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <HiOutlinePlus className="-ml-0.5 mr-2 h-4 w-4" />
              New
            </button>
            
            {/* Import Button with file input */}
            <div className="relative">
              <input
                type="file"
                id="resume-import"
                accept=".json"
                className="sr-only"
                onChange={handleFileImport}
              />
              <label
                htmlFor="resume-import"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                <HiOutlineUpload className="-ml-0.5 mr-2 h-4 w-4" />
                Import
              </label>
              {fileUploadError && (
                <div className="absolute top-full left-0 mt-1 w-48 text-xs text-red-600 bg-red-50 p-1 rounded">
                  {fileUploadError}
                </div>
              )}
            </div>
            
            {/* Save Button */}
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving || (!hasUnsavedChanges && lastSaved)}
              className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
                isSaving || (!hasUnsavedChanges && lastSaved)
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isSaving ? (
                <>
                  <HiOutlineCloudUpload className="-ml-0.5 mr-2 h-4 w-4 animate-pulse" />
                  Saving...
                </>
              ) : (
                <>
                  <HiOutlineSave className="-ml-0.5 mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </button>
            
            {/* Download Button */}
            <button
              type="button"
              onClick={onDownload}
              disabled={isDownloading}
              className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
                isDownloading
                  ? 'bg-green-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              }`}
            >
              {isDownloading ? (
                <>
                  <HiOutlineDownload className="-ml-0.5 mr-2 h-4 w-4 animate-pulse" />
                  Downloading...
                </>
              ) : (
                <>
                  <HiOutlineDownload className="-ml-0.5 mr-2 h-4 w-4" />
                  Download PDF
                </>
              )}
            </button>
            
            {/* More Actions Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                More
                <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {showDropdown && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    {onShare && (
                      <button
                        onClick={() => {
                          onShare();
                          setShowDropdown(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <HiOutlineShare className="mr-3 h-5 w-5 text-gray-400" />
                        Share
                      </button>
                    )}
                    
                    {onDuplicate && (
                      <button
                        onClick={() => {
                          onDuplicate();
                          setShowDropdown(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <HiOutlineDocumentDuplicate className="mr-3 h-5 w-5 text-gray-400" />
                        Duplicate
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        // Logic to copy resume data as JSON
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <HiOutlineClipboardCopy className="mr-3 h-5 w-5 text-gray-400" />
                      Copy as JSON
                    </button>
                    
                    {onDelete && (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this resume?')) {
                            onDelete();
                          }
                          setShowDropdown(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                        role="menuitem"
                      >
                        <HiOutlineTrash className="mr-3 h-5 w-5 text-red-400" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeActionBar;
