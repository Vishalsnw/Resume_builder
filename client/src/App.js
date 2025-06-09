// client/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './components/dashboard/Dashboard';
import EmailVerification from './components/auth/EmailVerification';
import ResumeBuilder from './components/resume/ResumeBuilder';
import NotFound from './components/common/NotFound';
// Import components for settings and profile
import Settings from './components/settings/Settings'; 
import Profile from './components/profile/Profile';
import CreateResume from './components/resume/CreateResume';

// Import AI-related components
import AIContentGenerator from './components/resume/ai/AIContentGenerator';
import AIFeedback from './components/resume/ai/AIFeedback';
import ATSScoreCard from './components/resume/ai/ATSScoreCard';
import ContentEnhancer from './components/resume/ai/ContentEnhancer';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/verify-email" element={<EmailVerification />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            
            {/* Profile and Settings routes */}
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-resume" element={<CreateResume />} />
            
            {/* AI Features routes */}
            <Route path="/ai/content-generator" element={<AIContentGenerator />} />
            <Route path="/ai/feedback" element={<AIFeedback />} />
            <Route path="/ai/ats-score" element={<ATSScoreCard />} />
            <Route path="/ai/content-enhancer" element={<ContentEnhancer />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
