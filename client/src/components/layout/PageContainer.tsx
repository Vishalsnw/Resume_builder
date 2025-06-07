// client/src/components/layout/PageContainer.tsx

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  loading?: boolean;
  showNavbar?: boolean;
  showSidebar?: boolean;
  showFooter?: boolean;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  title = '',
  loading = false,
  showNavbar = true,
  showSidebar = true,
  showFooter = true,
  className = ''
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const currentUser = 'Vishalsnw'; // Replace with your auth context

  // Update current date time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formatted = now.toISOString()
        .replace('T', ' ')
        .substring(0, 19);
      setCurrentDateTime(formatted);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle back button in WebView
  useEffect(() => {
    const handleBackButton = (e: PopStateEvent) => {
      if (isSidebarOpen) {
        e.preventDefault();
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('popstate', handleBackButton);
    return () => window.removeEventListener('popstate', handleBackButton);
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-yellow-50 p-4 fixed top-0 left-0 right-0 z-50">
          <div className="flex items-center justify-center">
            <svg
              className="h-5 w-5 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="ml-2 text-sm text-yellow-700">
              You are currently offline. Some features may be unavailable.
            </span>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar
            currentUser={currentUser}
            currentDateTime={currentDateTime}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navbar */}
          {showNavbar && (
            <Navbar
              userPhotoURL={null}
              userName={currentUser}
            />
          )}

          {/* Content Area */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            {/* Page Title */}
            {title && (
              <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {title}
                  </h1>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
              </div>
            ) : (
              // Main Content
              <div className={`max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 ${className}`}>
                {children}
              </div>
            )}
          </main>

          {/* Footer */}
          {showFooter && (
            <Footer
              currentUser={currentUser}
            />
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg md:hidden z-20"
        onClick={() => setIsSidebarOpen(true)}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  );
};

export default PageContainer;
