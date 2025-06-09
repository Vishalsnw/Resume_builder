// client/src/App.js or App.tsx
import 404 from '@/pages/404';
import Settings from '@/components/settings/Settings';
import dashboard from '@/pages/dashboard';
import { default as AppImport } from '@/App';
import create from '@/pages/resumes/create';
import login from '@/pages/api/auth/login';
import Profile from '@/components/profile/Profile';
import [id] from '@/pages/resumes/edit/[id]';
import LoginForm from '@/components/auth/LoginForm';
import AuthContext from '@/contexts/AuthContext';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import settings from '@/pages/profile/settings';
import register from '@/pages/api/auth/register';
import 500 from '@/pages/500';
import useAuth from '@/hooks/useAuth';
import EmailVerification from '@/components/auth/EmailVerification';

// NOTE: Renamed to avoid conflict with local declarations:
// App → AppImport
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
// Rename LoginForm import to avoid the conflict
import LoginFormComponent from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './components/dashboard/Dashboard';
// EmailVerification is already correctly renamed
import EmailVerificationComponent from './components/auth/EmailVerification';
import ResumeBuilder from './components/resume/ResumeBuilder';
import NotFound from './components/common/NotFound';

// Import AI components
import AIContentGenerator from './components/resume/ai/AIContentGenerator';
import AIFeedback from './components/resume/ai/AIFeedback';
import ATSScoreCard from './components/resume/ai/ATSScoreCard';
import ContentEnhancer from './components/resume/ai/ContentEnhancer';

// Import the CreateResume component we just created
import CreateResume from './components/resume/CreateResume';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* Update to use LoginFormComponent instead of LoginForm */}
          <Route path="/login" element={<LoginFormComponent />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/verify-email" element={<EmailVerificationComponent />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/resume-builder" element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          } />
          <Route path="/create-resume" element={
            <ProtectedRoute>
              <CreateResume />
            </ProtectedRoute>
          } />
          
          {/* Create these components in separate files */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Settings</h1>
                <div className="bg-white shadow-md rounded-lg p-6">
                  <form>
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-700 mb-1">Email Notifications</label>
                          <label className="flex items-center">
                            <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                            <span className="ml-2">Receive job alerts</span>
                          </label>
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-1">Password</label>
                          <button type="button" className="text-blue-500 hover:underline">Change Password</button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
                <div className="bg-white shadow-md rounded-lg p-6">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 mb-6 md:mb-0">
                      <div className="flex justify-center">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="text-center mt-4">
                        <button className="text-blue-500 hover:underline">Upload photo</button>
                      </div>
                    </div>
                    <div className="md:w-2/3 md:pl-6">
                      <form>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 mb-1">First Name</label>
                            <input type="text" className="form-input w-full px-4 py-2 border rounded" />
                          </div>
                          <div>
                            <label className="block text-gray-700 mb-1">Last Name</label>
                            <input type="text" className="form-input w-full px-4 py-2 border rounded" />
                          </div>
                          <div>
                            <label className="block text-gray-700 mb-1">Email</label>
                            <input type="email" className="form-input w-full px-4 py-2 border rounded" />
                          </div>
                          <div>
                            <label className="block text-gray-700 mb-1">Phone</label>
                            <input type="tel" className="form-input w-full px-4 py-2 border rounded" />
                          </div>
                        </div>
                        <div className="mt-6">
                          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Update Profile
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          } />

          {/* AI Feature Routes */}
          <Route path="/ai/generator" element={
            <ProtectedRoute>
              <AIContentGenerator />
            </ProtectedRoute>
          } />
          <Route path="/ai/feedback" element={
            <ProtectedRoute>
              <AIFeedback />
            </ProtectedRoute>
          } />
          <Route path="/ai/ats" element={
            <ProtectedRoute>
              <ATSScoreCard />
            </ProtectedRoute>
          } />
          <Route path="/ai/enhance" element={
            <ProtectedRoute>
              <ContentEnhancer />
            </ProtectedRoute>
          } />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
