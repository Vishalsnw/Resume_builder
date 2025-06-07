// client/src/components/auth/ForgotPassword.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';
import toast from 'react-hot-toast';

// Common components
import Input from '../common/forms/Input';
import PrimaryButton from '../common/buttons/PrimaryButton';
import Alert from '../common/feedback/Alert';

interface ForgotPasswordState {
  email: string;
  isLoading: boolean;
  isEmailSent: boolean;
  error: string | null;
}

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<ForgotPasswordState>({
    email: '',
    isLoading: false,
    isEmailSent: false,
    error: null
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({
      ...prev,
      email: e.target.value,
      error: null
    }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!state.email) {
      setState(prev => ({
        ...prev,
        error: 'Please enter your email address'
      }));
      return;
    }

    if (!validateEmail(state.email)) {
      setState(prev => ({
        ...prev,
        error: 'Please enter a valid email address'
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      await sendPasswordResetEmail(auth, state.email, {
        url: `${window.location.origin}/login`, // Redirect URL after password reset
        handleCodeInApp: true
      });

      setState(prev => ({
        ...prev,
        isEmailSent: true,
        isLoading: false
      }));

      toast.success('Password reset email sent successfully!');
    } catch (error: any) {
      let errorMessage = 'Failed to send reset email';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later';
          break;
        default:
          errorMessage = error.message || 'An error occurred';
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {/* Success Message */}
        {state.isEmailSent && (
          <Alert
            type="success"
            title="Email sent!"
            message={`We've sent password reset instructions to ${state.email}. Please check your inbox.`}
          />
        )}

        {/* Error Message */}
        {state.error && (
          <Alert
            type="error"
            title="Error"
            message={state.error}
          />
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Input
              label="Email address"
              type="email"
              name="email"
              value={state.email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              disabled={state.isLoading || state.isEmailSent}
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col space-y-4">
            <PrimaryButton
              type="submit"
              isLoading={state.isLoading}
              disabled={state.isEmailSent}
              className="w-full"
            >
              {state.isEmailSent ? 'Email Sent' : 'Send Reset Link'}
            </PrimaryButton>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Back to login
            </button>
          </div>
        </form>

        {/* Help Text */}
        {state.isEmailSent && (
          <div className="mt-4 text-sm text-gray-600">
            <p>Didn't receive the email?</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Check your spam folder</li>
              <li>Verify your email address is correct</li>
              <li>
                <button
                  onClick={handleSubmit}
                  disabled={state.isLoading}
                  className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                >
                  Click here to try again
                </button>
              </li>
            </ul>
          </div>
        )}

        {/* Support Link */}
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Need help?{' '}
            <a
              href="/support"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
