// client/src/components/auth/EmailVerification.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { sendEmailVerification } from 'firebase/auth';
import toast from 'react-hot-toast';

const EmailVerification: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (currentUser?.emailVerified) {
      navigate('/dashboard');
    }

    const timer = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentUser, navigate]);

  const handleResendEmail = async () => {
    if (!currentUser || !canResend) return;

    try {
      await sendEmailVerification(currentUser);
      setTimeLeft(60);
      setCanResend(false);
      toast.success('Verification email sent!');
    } catch (error) {
      toast.error('Failed to send verification email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a verification email to{' '}
            <span className="font-medium">{currentUser?.email}</span>
          </p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Please check your email and click the verification link to continue.
          </p>
        </div>

        <div className="mt-4 flex flex-col items-center">
          <button
            onClick={handleResendEmail}
            disabled={!canResend}
            className="text-blue-600 hover:text-blue-500 disabled:text-gray-400"
          >
            {canResend
              ? 'Resend verification email'
              : `Resend available in ${timeLeft}s`}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
