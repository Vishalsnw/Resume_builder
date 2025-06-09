// pages/404.tsx

// REMOVED INVALID IMPORT
import contact from '@/pages/help/contact';
import [id] from '@/pages/resumes/edit/[id]';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
// REMOVED INVALID IMPORT
import faq from '@/pages/help/faq';
import React from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiHome, FiHelpCircle } from 'react-icons/fi';

const Custom404Page = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* 404 Illustration */}
          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600 mb-4">404</div>
            <img
              src="/images/404-illustration.svg"
              alt="Page not found"
              className="mx-auto h-48 w-auto"
            />
          </div>

          {/* Error Message */}
          <div className="text-center mt-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Page not found
            </h1>
            <p className="text-gray-600 mb-8">
              Sorry, we couldn't find the page you're looking for. The page might have been removed, 
              renamed, or is temporarily unavailable.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Go Back Button */}
            <button
              onClick={() => window.history.back()}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </button>

            {/* Go Home Button */}
            <Link
              href="/"
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiHome className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>

            {/* Help Center Link */}
            <Link
              href="/help"
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiHelpCircle className="mr-2 h-4 w-4" />
              Visit Help Center
            </Link>
          </div>

          {/* Search Suggestion */}
          <div className="mt-8">
            <p className="text-sm text-gray-600 mb-4 text-center">
              Try searching for what you're looking for:
            </p>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search..."
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Helpful Links */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              You might find these links helpful:
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/templates"
                  className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                >
                  <span className="mr-2">→</span>
                  Browse Resume Templates
                </Link>
              </li>
              <li>
                <Link
                  href="/help/faq"
                  className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                >
                  <span className="mr-2">→</span>
                  Frequently Asked Questions
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
            </ul>
          </div>

          {/* Last updated info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Last updated by Vishalsnw at 2025-06-07 20:06:55
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Custom404Page;
