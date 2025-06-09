// client/src/components/auth/GoogleAuthButton.tsx

import dashboard from '@/pages/dashboard';
import login from '@/pages/api/auth/login';
import [id] from '@/pages/resumes/edit/[id]';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import register from '@/pages/api/auth/register';
// REMOVED INVALID IMPORT
import firebase from '@/components/auth/firebase';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../config/firebase';
import toast from 'react-hot-toast';

interface GoogleAuthButtonProps {
  text?: string;
  mode?: 'login' | 'register';
  onSuccess?: (userData: any) => void;
  className?: string;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  text = 'Continue with Google',
  mode = 'login',
  onSuccess,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading(
      mode === 'login' ? 'Signing in...' : 'Creating account...'
    );

    try {
      const provider = new GoogleAuthProvider();
      // Add additional scopes if needed
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');

      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      
      if (!credential) {
        throw new Error('Failed to get credentials');
      }

      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess({
          user: result.user,
          isNewUser,
          credential
        });
      }

      toast.success(
        isNewUser ? 'Account created successfully!' : 'Signed in successfully!',
        { id: loadingToast }
      );

      // Navigate based on user state
      if (isNewUser) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }

    } catch (error: any) {
      let errorMessage = 'Authentication failed';

      // Handle specific error cases
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign in cancelled';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Please allow popups for this website';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'An account already exists with this email';
          break;
        default:
          errorMessage = error.message || 'Failed to authenticate with Google';
      }

      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      disabled={isLoading}
      className={`
        w-full flex items-center justify-center gap-3 px-4 py-2.5
        border border-gray-300 rounded-lg
        bg-white hover:bg-gray-50 
        text-gray-700 font-medium
        transition duration-150 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin" />
      ) : (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      )}
      <span>{isLoading ? 'Please wait...' : text}</span>
    </button>
  );
};

export default GoogleAuthButton;
