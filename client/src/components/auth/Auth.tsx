// src/components/auth/Auth.tsx

import forgot-password from '@/pages/forgot-password';
import login from '@/pages/api/auth/login';
import [id] from '@/pages/resumes/edit/[id]';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import register from '@/pages/api/auth/register';
import 500 from '@/pages/500';
import Auth from '@/components/auth/Auth';
import useForm from '@/hooks/useForm';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineMail } from 'react-icons/hi';
import { RiLockPasswordLine, RiUserLine } from 'react-icons/ri';
import logo from '../../assets/images/logo.png'; // Make sure to have this image

interface AuthFormData {
  fullName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

const Auth: React.FC<{ isLogin?: boolean }> = ({ isLogin = false }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<AuthFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: AuthFormData) => {
    setIsSubmitting(true);
    try {
      // Handle authentication logic here
      console.log('Form data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="flex justify-center">
          <img className="h-16 w-auto" src={logo} alt="Resume Builder Logo" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Sign in to your account' : 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Start building your professional resume
            </>
          )}
        </p>
      </div>

      <div className="auth-card animate-fadeIn">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {!isLogin && (
            <div>
              <label htmlFor="fullName" className="form-label">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RiUserLine className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  className="form-input pl-10"
                  placeholder="John Doe"
                  {...register("fullName", { 
                    required: "Full name is required",
                    minLength: { value: 2, message: "Name must be at least 2 characters" }
                  })}
                />
              </div>
              {errors.fullName && <p className="form-error">{errors.fullName.message}</p>}
            </div>
          )}

          <div>
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="form-input pl-10"
                placeholder="you@example.com"
                {...register("email", { 
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                })}
              />
            </div>
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiLockPasswordLine className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="form-input pl-10"
                {...register("password", { 
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" }
                })}
              />
            </div>
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RiLockPasswordLine className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  className="form-input pl-10"
                  {...register("confirmPassword", { 
                    required: "Please confirm your password",
                    validate: value => value === watch('password') || "Passwords do not match"
                  })}
                />
              </div>
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
            </div>
          )}

          {isLogin && (
            <div className="flex items-center justify-end">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </Link>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : isLogin ? 'Sign in' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button type="button" className="social-button">
              <span className="sr-only">Sign up with Google</span>
              <FcGoogle className="h-5 w-5 mr-2" />
              <span>Sign {isLogin ? 'in' : 'up'} with Google</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
