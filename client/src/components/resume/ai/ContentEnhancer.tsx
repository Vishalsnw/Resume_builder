// client/src/components/resume/builder/ContentEnhancer.tsx

import React, { useState, useRef } from 'react';
import { 
  FiEdit3, 
  FiCheck, 
  FiRotateCcw, 
  FiChevronRight, 
  FiZap,
  FiCopy,
  FiThumbsUp,
  FiThumbsDown,
  FiRefreshCw
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface EnhancementSuggestion {
  id: string;
  original: string;
  enhanced: string;
  type: 'actionVerb' | 'quantification' | 'clarity' | 'impact' | 'conciseness';
  explanation: string;
  confidence: number;
}

interface ContentEnhancerProps {
  content: string;
  type: 'bullet' | 'summary' | 'achievement' | 'responsibility';
  jobTitle?: string;
  industry?: string;
  currentUser?: string;
  currentDateTime?: string;
  onUpdate: (enhancedContent: string) => void;
}

const ContentEnhancer: React.FC<ContentEnhancerProps> = ({
  content,
  type,
  jobTitle = '',
  industry = '',
  currentUser = 'Vishalsnw',
  currentDateTime = '2025-06-07 18:30:09',
  onUpdate
}) => {
  const [suggestions, setSuggestions] = useState<EnhancementSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('enhance');
  const [selectedStyle, setSelectedStyle] = useState<'professional' | 'impactful' | 'concise'>('professional');
  const abortControllerRef = useRef<AbortController | null>(null);

  const enhancementTypes = {
    actionVerb: 'Stronger Action Verbs',
    quantification: 'Added Metrics',
    clarity: 'Improved Clarity',
    impact: 'Enhanced Impact',
    conciseness: 'More Concise',
  };

  const styles = {
    professional: 'Formal and industry-standard language',
    impactful: 'Results-oriented and achievement-focused',
    concise: 'Clear and straight to the point',
  };

  const generateEnhancements = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/enhance-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          type,
          jobTitle,
          industry,
          style: selectedStyle,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error('Enhancement failed');

      const data = await response.json();
      setSuggestions(data.suggestions);
      toast.success('Enhancements generated successfully');
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request cancelled');
      } else {
        console.error('Error generating enhancements:', error);
        toast.error('Failed to generate enhancements');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (suggestion: EnhancementSuggestion) => {
    onUpdate(suggestion.enhanced);
    toast.success('Enhancement applied');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleFeedback = (suggestionId: string, isPositive: boolean) => {
    // Send feedback to API
    fetch('/api/enhancement-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        suggestionId,
        isPositive,
        userId: currentUser,
      }),
    });

    toast.success('Thank you for your feedback!');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Content Enhancer</h3>
        <div className="mt-2 flex space-x-2">
          <button
            onClick={() => setActiveTab('enhance')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'enhance'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Enhance
          </button>
          <button
            onClick={() => setActiveTab('original')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === 'original'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Original
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        {activeTab === 'enhance' ? (
          <div className="space-y-4">
            {/* Style Selection */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(styles).map(([style, description]) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style as any)}
                  className={`
                    px-3 py-1.5 rounded-full text-sm font-medium
                    ${selectedStyle === style
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }
                  `}
                  title={description}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>

            {/* Generate Button */}
            <button
              onClick={generateEnhancements}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <FiRefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FiZap className="w-5 h-5 mr-2" />
                  Generate Enhancements
                </>
              )}
            </button>

            {/* Suggestions */}
            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          suggestion.confidence >= 90
                            ? 'bg-green-100 text-green-700'
                            : suggestion.confidence >= 70
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {enhancementTypes[suggestion.type]}
                        </span>
                        <span className="text-sm text-gray-500">
                          {suggestion.confidence}% confidence
                        </span>
                      </div>

                      <div className="mt-2 space-y-2">
                        <p className="text-sm text-gray-500 line-through">
                          {suggestion.original}
                        </p>
                        <p className="text-sm text-gray-900">
                          {suggestion.enhanced}
                        </p>
                      </div>

                      <p className="mt-2 text-sm text-gray-600">
                        {suggestion.explanation}
                      </p>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => handleApply(suggestion)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                        title="Apply"
                      >
                        <FiCheck className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleCopy(suggestion.enhanced)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                        title="Copy"
                      >
                        <FiCopy className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="mt-3 flex items-center space-x-2">
                    <button
                      onClick={() => handleFeedback(suggestion.id, true)}
                      className="p-1 text-gray-400 hover:text-green-600"
                      title="Helpful"
                    >
                      <FiThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleFeedback(suggestion.id, false)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Not Helpful"
                    >
                      <FiThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Last enhanced by {currentUser} at {currentDateTime}
        </p>
      </div>
    </div>
  );
};

export default ContentEnhancer;
