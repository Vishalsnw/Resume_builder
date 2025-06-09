// client/src/components/resume/builder/AIFeedback.tsx

import 500 from '@/pages/500';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import AIFeedback from '@/components/resume/ai/AIFeedback';
import Footer from '@/components/layout/Footer';
import React, { useState, useEffect } from 'react';
import { FiThumbsUp, FiThumbsDown, FiRefreshCw, FiAward, FiAlertTriangle, FiBarChart2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface FeedbackItem {
  id: string;
  type: 'improvement' | 'suggestion' | 'warning' | 'strength';
  message: string;
  section: string;
  priority: 'high' | 'medium' | 'low';
  impact: number; // 1-100
  example?: string;
}

interface AIFeedbackProps {
  resumeData: any;
  jobTitle?: string;
  industry?: string;
  targetCompany?: string;
  currentUser?: string;
  currentDateTime?: string;
}

const AIFeedback: React.FC<AIFeedbackProps> = ({
  resumeData,
  jobTitle = '',
  industry = '',
  targetCompany = '',
  currentUser = 'Vishalsnw',
  currentDateTime = '2025-06-07 18:16:47'
}) => {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const sections = [
    'all',
    'summary',
    'experience',
    'skills',
    'education',
    'projects',
    'certifications'
  ];

  const priorities = ['all', 'high', 'medium', 'low'];

  useEffect(() => {
    if (resumeData) {
      analyzeFeedback();
    }
  }, [resumeData]);

  const analyzeFeedback = async () => {
    setIsAnalyzing(true);
    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData,
          jobTitle,
          industry,
          targetCompany,
        }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setFeedback(data.feedback);
      setScore(data.score);
      
      toast.success('Resume analysis completed');
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast.error('Failed to analyze resume');
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
    }
  };

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'improvement':
        return <FiRefreshCw className="w-5 h-5 text-blue-500" />;
      case 'suggestion':
        return <FiThumbsUp className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <FiAlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'strength':
        return <FiAward className="w-5 h-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredFeedback = feedback.filter(item => {
    if (selectedSection !== 'all' && item.section !== selectedSection) return false;
    if (selectedPriority !== 'all' && item.priority !== selectedPriority) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header with Score */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">AI Resume Feedback</h2>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Overall Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(score)}`}>
                {score}/100
              </p>
            </div>
            <button
              onClick={analyzeFeedback}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {isAnalyzing ? (
                <>
                  <FiRefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FiBarChart2 className="w-5 h-5 mr-2" />
                  Analyze Again
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <FiRefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFeedback.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-lg border ${
                  item.priority === 'high'
                    ? 'border-red-200 bg-red-50'
                    : item.priority === 'medium'
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    {getFeedbackIcon(item.type)}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {item.section.charAt(0).toUpperCase() + item.section.slice(1)}
                      </p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : item.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.priority} priority
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">{item.message}</p>
                    {item.example && (
                      <div className="mt-2 text-sm text-gray-600 bg-white p-3 rounded border border-gray-200">
                        <p className="font-medium">Example:</p>
                        <p className="mt-1">{item.example}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredFeedback.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No feedback found for the selected filters.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Last analyzed by {currentUser} at {currentDateTime}
        </p>
      </div>
    </div>
  );
};

export default AIFeedback;
