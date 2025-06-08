import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ResumeBuilder: React.FC = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="resume-builder-container">
      <h1>Resume Builder</h1>
      <p>Create your professional resume</p>
      
      {currentUser && (
        <div className="resume-content">
          <div className="template-selection">
            <h2>Choose a Template</h2>
            <div className="templates-grid">
              {/* Template placeholders */}
              <div className="template-card">Modern Template</div>
              <div className="template-card">Professional Template</div>
              <div className="template-card">Creative Template</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
