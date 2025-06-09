// client/src/components/auth/AuthWrapper.tsx

import dashboard from '@/pages/dashboard';
import [id] from '@/pages/resumes/edit/[id]';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import login from '@/pages/api/auth/login';
// REMOVED INVALID IMPORT
import firebase from '@/components/auth/firebase';
import Footer from '@/components/layout/Footer';
import AuthWrapper from '@/components/auth/AuthWrapper';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { useEffect } from 'react';
import LoadingSpinner from '../layout/LoadingSpinner';

interface AuthWrapperProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  isProtected?: boolean;
  allowIfLoggedIn?: boolean;
  customHeader?: React.ReactNode;
  customFooter?: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({
  children,
  title,
  subtitle,
  showBackButton = true,
  isProtected = false,
  allowIfLoggedIn = false,
  customHeader,
  customFooter
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);

      // Handle protected routes and already logged in states
      if (isProtected && !user) {
        navigate('/login', { 
          state: { 
            from: location.pathname,
            message: 'Please log in to continue.'
          }
        });
      } else if (!allowIfLoggedIn && user) {
        navigate('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [navigate, location, isProtected, allowIfLoggedIn]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            className="h-12 w-auto"
            src="/logo.svg"
            alt="AI Resume Builder"
          />
        </div>

        {/* Custom Header */}
        {customHeader}

        {/* Default Header */}
        {!customHeader && (
          <div className="mt-6 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {/* Back Button */}
          {showBackButton && (
            <div className="mb-6">
              <button
                onClick={handleBack}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>
            </div>
          )}

          {/* Main Content */}
          <div className="space-y-6">
            {children}
          </div>

          {/* Custom Footer */}
          {customFooter}

          {/* Default Footer */}
          {!customFooter && (
            <div className="mt-6 text-center text-sm">
              <div className="text-gray-500">
                {`Last updated: ${getCurrentTime()}`}
              </div>
              <div className="mt-2">
                <a
                  href="/help"
                  className="text-blue-600 hover:text-blue-500"
                >
                  Need help?
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Environment Indicator - Only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-2 right-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
          DEV MODE
        </div>
      )}
    </div>
  );
};

export default AuthWrapper;
