// client/src/components/auth/ProtectedRoute.tsx
import login from '@/pages/api/auth/login';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import AuthContext from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import useAuth from '@/hooks/useAuth';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
