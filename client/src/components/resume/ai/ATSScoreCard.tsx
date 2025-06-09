// client/src/components/resume/builder/ATSScoreCard.tsx

import index from '@/pages/help/index';
// REMOVED INVALID IMPORT
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import Footer from '@/components/layout/Footer';
import ATSScoreCard from '@/components/resume/ai/ATSScoreCard';
import React, { useState, useEffect } from 'react';
import { 
  FiCheck, 
  FiX, 
  FiAlertTriangle, 
  FiRefreshCw,
  FiDownload,
  FiClipboard,
  FiSearch
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface ATSMetric {
  id: string;
  name: string;
  score: number;
  status: 'passed' | 'failed' | 'warning';
  details: string;
  suggestions: string[];
}

interface KeywordMatch {
  keyword: string;
  found: boolean;
  count: number;
  context?: string;
}

interface ATSScoreCardProps {
  resumeData: any;
  jobDescription?: string;
  jobTitle?: string;
  currentUser?: string;
  currentDateTime?: string;
}

const ATSScoreCard: React.FC<ATSScoreCardProps> = ({
  resumeData,
  jobDescription = '',
  jobTitle = '',
  currentUser = 'Vishalsnw',
  currentDateTime = '2025-06-07 18:19:44'
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState<ATSMetric[]>([]);
  const [keywordMatches, setKeywordMatches] = useState<KeywordMatch[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [isJobDescriptionVisible, setIsJobDescriptionVisible] = useState(false);
  const [showDetails, setShowDetails] = useState<string[]>([]);

  useEffect(() => {
    if (resumeData) {
      analyzeResume();
    }
  }, [resumeData, jobDescription]);

  const analyzeResume = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-ats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData,
          jobDescription,
          jobTitle,
        }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setMetrics(data.metrics);
      setKeywordMatches(data.keywordMatches);
      setOverallScore(data.overallScore);
      
      toast.success('ATS analysis completed');
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast.error('Failed to analyze resume');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <FiCheck className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <FiX className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <FiAlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const toggleDetails = (id: string) => {
    setShowDetails(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const downloadReport = () => {
    const report = {
      timestamp: currentDateTime,
      analyst: currentUser,
      overallScore,
      metrics,
      keywordMatches,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ats-analysis-${currentDateTime}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">ATS Compatibility Score</h2>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Overall Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}/100
              </p>
            </div>
            <button
              onClick={analyzeResume}
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
                  <FiSearch className="w-5 h-5 mr-2" />
                  Analyze
                </>
              )}
            </button>
          </div>
        </div>

        {/* Job Description Toggle */}
        {jobDescription && (
          <div className="mt-4">
            <button
              onClick={() => setIsJobDescriptionVisible(!isJobDescriptionVisible)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {isJobDescriptionVisible ? 'Hide' : 'Show'} Job Description
            </button>
            {isJobDescriptionVisible && (
              <div className="mt-2 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
                {jobDescription}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className={`p-4 rounded-lg border ${
              metric.status === 'passed'
                ? 'border-green-200 bg-green-50'
                : metric.status === 'failed'
                ? 'border-red-200 bg-red-50'
                : 'border-yellow-200 bg-yellow-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  {getStatusIcon(metric.status)}
                  <h3 className="ml-2 font-semibold text-gray-900">
                    {metric.name}
                  </h3>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {metric.details}
                </p>
              </div>
              <span className={`font-bold ${getScoreColor(metric.score)}`}>
                {metric.score}%
              </span>
            </div>

            <button
              onClick={() => toggleDetails(metric.id)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700"
            >
              {showDetails.includes(metric.id) ? 'Hide' : 'Show'} Suggestions
            </button>

            {showDetails.includes(metric.id) && (
              <ul className="mt-2 space-y-2">
                {metric.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="mr-2">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Keyword Analysis */}
      <div className="p-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Keyword Analysis
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {keywordMatches.map((match, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                match.found
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900">{match.keyword}</span>
                <span className={match.found ? 'text-green-600' : 'text-red-600'}>
                  {match.count}x
                </span>
              </div>
              {match.context && (
                <p className="text-xs text-gray-600 truncate">
                  {match.context}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Last analyzed by {currentUser} at {currentDateTime}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={downloadReport}
              className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <FiDownload className="w-4 h-4 mr-1" />
              Download Report
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify({
                  metrics,
                  keywordMatches,
                  overallScore,
                }, null, 2));
                toast.success('Report copied to clipboard');
              }}
              className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <FiClipboard className="w-4 h-4 mr-1" />
              Copy to Clipboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSScoreCard;
