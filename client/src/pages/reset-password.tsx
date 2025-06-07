// pages/reset-password.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  FiLock, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiEye, 
  FiEyeOff,
  FiCheck
} from 'react-icons/fi';

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  // Password validation criteria
  const passwordCriteria = [
    { label: 'At least 8 characters', test: (pass: string) => pass.length >= 8 },
    { label: 'Contains a number', test: (pass: string) => /\d/.test(pass) },
    { label: 'Contains an uppercase letter', test: (pass: string) => /[A-Z]/.test(pass) },
    { label: 'Contains a special character', test: (pass: string) => /[!@#$%^&*]/.test(pass) },
  ];

  // Verify token validity when component mounts
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await fetch('/api/auth/verify-reset-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });

          setTokenValid(response.ok);
        } catch (error) {
          setTokenValid(false);
        }
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate password criteria
    const failedCriteria = passwordCriteria.find(
      criterion => !criterion.test(formData.password)
    );

    if (failedCriteria) {
      setError(`Password must ${failedCriteria.label.toLowerCase()}`);
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setSuccess(true);
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Show error if token is invalid
  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Invalid or expired reset link
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    This password reset link is no longer valid. Please request a new one.
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-red-700 hover:text-red-600"
                  >
                    Request new reset link
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your new password
          </p>
        </div>

        {success ? (
          // Success Message
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiCheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Password reset successful!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Your password has been successfully reset. You will be redirected to the login page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Reset Password Form
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

            <div className="rounded-md shadow-sm -space-y-px">
              {/* New Password Field */}
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="appearance-none rounded-t-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="New password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    className="appearance-none rounded-b-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Password requirements:</p>
              <div className="grid grid-cols-1 gap-2">
                {passwordCriteria.map((criterion, index) => (
                  <div
                    key={index}
                    className={`flex items-center text-sm ${
                      criterion.test(formData.password)
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {criterion.test(formData.password) ? (
                      <FiCheck className="h-4 w-4 mr-2" />
                    ) : (
                      <div className="h-4 w-4 mr-2 border border-gray-300 rounded-full" />
                    )}
                    {criterion.label}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Resetting password...' : 'Reset password'}
              </button>
            </div>
          </form>
        )}

        {/* Last updated info */}
        <div className="mt-4 text-center text-xs text-gray-500">
          Last updated by Vishalsnw at 2025-06-07 20:02:32
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
