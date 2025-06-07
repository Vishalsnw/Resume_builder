// client/src/components/resume/builder/AIContentGenerator.tsx

import React, { useState, useRef } from 'react';
import { FiEdit2, FiCopy, FiCheck, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface AIContentGeneratorProps {
  sectionType: 'summary' | 'experience' | 'skills' | 'achievements';
  currentContent?: string;
  jobTitle?: string;
  yearsOfExperience?: number;
  industry?: string;
  keywords?: string[];
  onSelect: (content: string) => void;
  currentUser?: string;
  currentDateTime?: string;
}

type SuggestionType = {
  id: string;
  content: string;
  tone: 'professional' | 'confident' | 'balanced';
  length: 'concise' | 'detailed' | 'comprehensive';
};

const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({
  sectionType,
  currentContent = '',
  jobTitle = '',
  yearsOfExperience = 0,
  industry = '',
  keywords = [],
  onSelect,
  currentUser = 'Vishalsnw',
  currentDateTime = '2025-06-07 18:14:35'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionType[]>([]);
  const [selectedTone, setSelectedTone] = useState<'professional' | 'confident' | 'balanced'>('professional');
  const [selectedLength, setSelectedLength] = useState<'concise' | 'detailed' | 'comprehensive'>('detailed');
  const [showCustomize, setShowCustomize] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const getSectionPrompt = () => {
    const basePrompt = {
      summary: `Write a ${selectedLength} professional summary for a ${jobTitle} with ${yearsOfExperience} years of experience in the ${industry} industry. Tone: ${selectedTone}.`,
      experience: `Generate ${selectedLength} bullet points describing key responsibilities and achievements for a ${jobTitle} role. Tone: ${selectedTone}.`,
      skills: `List relevant technical and soft skills for a ${jobTitle} position in ${industry}, organized by category. Length: ${selectedLength}.`,
      achievements: `Create ${selectedLength} achievement statements for a ${jobTitle}, highlighting quantifiable results. Tone: ${selectedTone}.`,
    }[sectionType];

    return `${basePrompt} Include these keywords where relevant: ${keywords.join(', ')}`;
  };

  const generateContent = async (customInput?: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const prompt = customInput || getSectionPrompt();
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          currentContent,
          sectionType,
          tone: selectedTone,
          length: selectedLength,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error('Content generation failed');

      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request cancelled');
      } else {
        toast.error('Failed to generate content');
        console.error('Error generating content:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (content: string) => {
    onSelect(content);
    toast.success('Content applied successfully');
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            AI Content Generator
          </h3>
          <button
            onClick={() => setShowCustomize(!showCustomize)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {showCustomize ? 'Hide Options' : 'Customize'}
          </button>
        </div>

        {/* Customization Options */}
        {showCustomize && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tone
                </label>
                <select
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value as any)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="professional">Professional</option>
                  <option value="confident">Confident</option>
                  <option value="balanced">Balanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Length
                </label>
                <select
                  value={selectedLength}
                  onChange={(e) => setSelectedLength(e.target.value as any)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="concise">Concise</option>
                  <option value="detailed">Detailed</option>
                  <option value="comprehensive">Comprehensive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Prompt
              </label>
              <div className="flex space-x-2">
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Enter your custom instructions..."
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={2}
                />
                <button
                  onClick={() => generateContent(customPrompt)}
                  disabled={!customPrompt.trim() || isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4">
        {/* Generate Button */}
        <button
          onClick={() => generateContent()}
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
              <FiEdit2 className="w-5 h-5 mr-2" />
              Generate Suggestions
            </>
          )}
        </button>

        {/* Suggestions List */}
        <div className="mt-4 space-y-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      suggestion.tone === 'professional' ? 'bg-blue-100 text-blue-700' :
                      suggestion.tone === 'confident' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {suggestion.tone}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      suggestion.length === 'concise' ? 'bg-gray-100 text-gray-700' :
                      suggestion.length === 'detailed' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {suggestion.length}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {suggestion.content}
                  </p>
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => handleSelect(suggestion.content)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                    title="Apply"
                  >
                    <FiCheck className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleCopy(suggestion.content)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    title="Copy"
                  >
                    <FiCopy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <FiAlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">Tips for better results:</p>
              <ul className="mt-1 list-disc list-inside">
                <li>Be specific about your role and industry</li>
                <li>Include relevant keywords and skills</li>
                <li>Adjust tone and length for different sections</li>
                <li>Review and customize generated content</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Last generated by {currentUser} at {currentDateTime}
        </p>
      </div>
    </div>
  );
};

export default AIContentGenerator;
