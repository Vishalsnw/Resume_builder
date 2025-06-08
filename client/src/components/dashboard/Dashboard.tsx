// client/src/components/dashboard/Dashboard.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      {currentUser && (
        <div className="user-info">
          <p>Email: {currentUser.email}</p>
        </div>
      )}
      <div className="dashboard-actions">
        <h2>Get Started</h2>
        <p>Build your resume using our professional templates</p>
      </div>
    </div>
  );
};

export default Dashboard;
