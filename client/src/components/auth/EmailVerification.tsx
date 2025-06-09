// client/src/components/auth/EmailVerification.tsx
import dashboard from '@/pages/dashboard';
import firebase from '@/components/auth/firebase';
import [id] from '@/pages/resumes/edit/[id]';
import AuthContext from '@/contexts/AuthContext';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import login from '@/pages/api/auth/login';
import 500 from '@/pages/500';
import useAuth from '@/hooks/useAuth';
import EmailVerification from '@/components/auth/EmailVerification';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAuth, sendEmailVerification, applyActionCode } from 'firebase/auth';
import toast from 'react-hot-toast';

// The error is here - EmailVerification is already imported at the top, so we need to fix this

const EmailVerificationComponent: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const auth = getAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      const queryParams = new URLSearchParams(location.search);
      const oobCode = queryParams.get('oobCode');
      
      if (oobCode) {
        setVerifying(true);
        try {
          await applyActionCode(auth, oobCode);
          setVerified(true);
          toast.success('Email verified successfully!');
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        } catch (error: any) {
          setError(error.message);
          toast.error('Failed to verify email. The link may be expired.');
        } finally {
          setVerifying(false);
        }
      }
    };

    verifyEmail();
  }, [location, navigate, auth]);

  const handleResendVerification = async () => {
    if (currentUser) {
      try {
        await sendEmailVerification(currentUser);
        toast.success('Verification email sent!');
      } catch (error: any) {
        toast.error(error.message);
      }
    } else {
      toast.error('You must be logged in to request email verification.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Email Verification</h2>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          {verifying ? (
            <div className="text-center">
              <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-3 text-gray-700">Verifying your email...</p>
            </div>
          ) : verified ? (
            <div className="text-center">
              <svg className="h-16 w-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="mt-2 text-xl font-semibold text-gray-900">Email Verified!</h3>
              <p className="mt-2 text-gray-600">You'll be redirected to the dashboard automatically.</p>
            </div>
          ) : (
            <div>
              {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                  <p>{error}</p>
                </div>
              )}
              
              <p className="mb-4 text-gray-700">Please verify your email address to continue using the application.</p>
              
              <p className="mb-4 text-gray-700">If you haven't received the verification email, you can request another one:</p>
              
              <button
                onClick={handleResendVerification}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Resend Verification Email
              </button>
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export the component with the name EmailVerification
export default EmailVerificationComponent;
