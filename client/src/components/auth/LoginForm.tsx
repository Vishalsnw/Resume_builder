// client/src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../../config/firebase';

interface LoginFormState {
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
}

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<LoginFormState>({
    email: '',
    password: '',
    isLoading: false,
    error: null,
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
      error: null,
    }));
  };

  // Handle Email/Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.email || !formState.password) {
      setFormState(prev => ({
        ...prev,
        error: 'Please fill in all fields',
      }));
      return;
    }

    setFormState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await signInWithEmailAndPassword(auth, formState.email, formState.password);
      navigate('/dashboard');
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setFormState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Google sign-in failed',
      }));
    }
  };

  // Handle Password Reset
  const handleForgotPassword = async () => {
    if (!formState.email) {
      setFormState(prev => ({
        ...prev,
        error: 'Please enter your email address',
      }));
      return;
    }

    try {
      await sendPasswordResetEmail(auth, formState.email);
      alert('Password reset email sent! Please check your inbox.');
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to send reset email',
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Build your professional resume with AI
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border 
                         border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md 
                         focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formState.email}
                onChange={handleInputChange}
                disabled={formState.isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border 
                         border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md 
                         focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formState.password}
                onChange={handleInputChange}
                disabled={formState.isLoading}
              />
            </div>
          </div>

          {/* Error Message */}
          {formState.error && (
            <div className="text-red-600 text-sm text-center">
              {formState.error}
            </div>
          )}

          {/* Forgot Password */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Forgot your password?
            </button>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={formState.isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent 
                       text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                       disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {formState.isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              ) : 'Sign in'}
            </button>
          </div>
        </form>

        {/* Separator */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
        </div>

        {/* Google Sign In Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={formState.isLoading}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 
                     rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white 
                     hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <img
              className="h-5 w-5 mr-2"
              src="/google-icon.svg"
              alt="Google"
            />
            Sign in with Google
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
