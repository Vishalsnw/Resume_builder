// pages/500.tsx

import contact from '@/pages/help/contact';
import 500 from '@/pages/500';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  FiAlertTriangle, 
  FiRefreshCw, 
  FiHome, 
  FiMessageCircle 
} from 'react-icons/fi';

const Custom500Page = () => {
  const router = useRouter();
  const [errorDetails, setErrorDetails] = useState({
    errorId: '',
    timestamp: '2025-06-07 20:08:49',
    user: 'Vishalsnw'
  });

  // Generate unique error ID
  useEffect(() => {
    const generateErrorId = () => {
      return 'ERR-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    };
    setErrorDetails(prev => ({
      ...prev,
      errorId: generateErrorId()
    }));
  }, []);

  const handleRefresh = () => {
    router.reload();
  };

  const handleReport = async () => {
    try {
      await fetch('/api/error-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          errorId: errorDetails.errorId,
          path: router.asPath,
          timestamp: errorDetails.timestamp,
          user: errorDetails.user
        }),
      });
      alert('Error reported successfully. Our team will look into it.');
    } catch (error) {
      console.error('Failed to report error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
              <FiAlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          {/* Error Message */}
          <div className="mt-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Internal Server Error
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              We're experiencing some technical difficulties. 
              Our team has been notified and is working to fix the issue.
            </p>
          </div>

          {/* Error Details */}
          <div className="mt-6 bg-gray-50 rounded-md p-4">
            <div className="text-sm">
              <p className="font-medium text-gray-900">Error Details:</p>
              <div className="mt-2 space-y-1 text-gray-600">
                <p>Error ID: {errorDetails.errorId}</p>
                <p>Time: {errorDetails.timestamp}</p>
                <p>User: {errorDetails.user}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-4">
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiRefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </button>

            {/* Homepage Button */}
            <Link
              href="/"
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiHome className="mr-2 h-4 w-4" />
              Return to Homepage
            </Link>

            {/* Report Button */}
            <button
              onClick={handleReport}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiMessageCircle className="mr-2 h-4 w-4" />
              Report This Issue
            </button>
          </div>

          {/* Support Options */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              While we fix this, you can:
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/help"
                  className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                >
                  <span className="mr-2">→</span>
                  Visit our Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                >
                  <span className="mr-2">→</span>
                  Contact Support
                </Link>
              </li>
              <li>
                <Link
                  href="/status"
                  className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                >
                  <span className="mr-2">→</span>
                  Check System Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Technical Support */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Need Technical Support?
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      If you continue to experience issues, please contact our support team with the Error ID above.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Last updated info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Last updated by {errorDetails.user} at {errorDetails.timestamp}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Custom500Page;
