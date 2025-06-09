import 404 from '@/pages/404';
import login from '@/pages/api/auth/login';
import dashboard from '@/pages/dashboard';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import Dashboard from '@/components/dashboard/Dashboard';
import NotFound from '@/components/common/NotFound';
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <div className="not-found-actions">
        <Link to="/dashboard" className="btn btn-primary">
          Go to Dashboard
        </Link>
        <Link to="/login" className="btn btn-secondary">
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
