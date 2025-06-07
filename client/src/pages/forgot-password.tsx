// pages/forgot-password.tsx

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  FiMail, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiArrowLeft 
} from 'react-icons/fi';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process request');
      }

      setSuccess(true);
      setEmailSent(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Back to Login Link */}
        <div className="flex items-center justify-start">
          <Link
            href="/login"
            className="flex items-center text-sm text-blue-600 hover:text-blue-500"
          >
            <FiArrowLeft className="mr-2" />
            Back to login
          </Link>
        </div>

        {emailSent ? (
          // Success Message
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiCheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Reset link sent!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    We've sent a password reset link to <strong>{email}</strong>.
                    Please check your email and follow the instructions to reset your password.
                  </p>
                </div>
                <div className="mt-4">
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setEmailSent(false)}
                      className="text-sm font-medium text-green-700 hover:text-green-600"
                    >
                      Try different email
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="text-sm font-medium text-green-700 hover:text-green-600"
                      disabled={loading}
                    >
                      Resend email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Form
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiAlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !email}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  (loading || !email) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Sending reset link...' : 'Send reset link'}
              </button>
            </div>

            {/* Help Text */}
            <div className="text-sm text-center text-gray-600">
              <p>
                Make sure to check your spam folder if you don't receive the email.
              </p>
            </div>
          </form>
        )}

        {/* Additional Help */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <Link
              href="/help/contact"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Contact Support
            </Link>
          </p>
        </div>

        {/* Last updated info */}
        <div className="mt-4 text-center text-xs text-gray-500">
          Last updated by Vishalsnw at 2025-06-07 20:00:49
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
