// client/src/components/resume/builder/CoverLetterGenerator.tsx

import Footer from '@/components/layout/Footer';
import CoverLetterGenerator from '@/components/resume/export/CoverLetterGenerator';
import Settings from '@/components/settings/Settings';
import Select from '@/components/common/forms/Select';
import React, { useState, useRef } from 'react';
import { 
  FiEdit3, 
  FiRefreshCw, 
  FiDownload, 
  FiCopy, 
  FiSave,
  FiSliders,
  FiZap,
  FiCheck
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface CoverLetterGeneratorProps {
  resumeData: any;
  jobDescription?: string;
  companyName?: string;
  hiringManager?: string;
  currentUser?: string;
  currentDateTime?: string;
}

interface GenerationSettings {
  tone: 'professional' | 'conversational' | 'enthusiastic';
  length: 'concise' | 'standard' | 'detailed';
  focus: 'experience' | 'skills' | 'culture' | 'achievements';
  style: 'traditional' | 'modern' | 'creative';
  customInstructions?: string;
}

interface GeneratedLetter {
  id: string;
  content: string;
  timestamp: string;
  settings: GenerationSettings;
}

const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({
  resumeData,
  jobDescription = '',
  companyName = '',
  hiringManager = '',
  currentUser = 'Vishalsnw',
  currentDateTime = '2025-06-07 18:36:56'
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [generatedLetters, setGeneratedLetters] = useState<GeneratedLetter[]>([]);
  const [settings, setSettings] = useState<GenerationSettings>({
    tone: 'professional',
    length: 'standard',
    focus: 'experience',
    style: 'traditional',
  });
  const [customPrompt, setCustomPrompt] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateLetter = async () => {
    if (isGenerating) return;

    if (!jobDescription || !companyName) {
      toast.error('Please provide job description and company name');
      return;
    }
    
    setIsGenerating(true);
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData,
          jobDescription,
          companyName,
          hiringManager,
          settings,
          customPrompt,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error('Generation failed');

      const data = await response.json();
      const newLetter: GeneratedLetter = {
        id: Date.now().toString(),
        content: data.content,
        timestamp: currentDateTime,
        settings: { ...settings },
      };

      setGeneratedLetters(prev => [newLetter, ...prev]);
      setSelectedLetter(newLetter.id);
      toast.success('Cover letter generated successfully');
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request cancelled');
      } else {
        console.error('Error generating cover letter:', error);
        toast.error('Failed to generate cover letter');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  const handleSave = async (letterId: string) => {
    try {
      const letter = generatedLetters.find(l => l.id === letterId);
      if (!letter) return;

      const response = await fetch('/api/save-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: letter.content,
          settings: letter.settings,
          metadata: {
            companyName,
            jobDescription,
            timestamp: currentDateTime,
            user: currentUser,
          },
        }),
      });

      if (!response.ok) throw new Error('Save failed');
      toast.success('Cover letter saved successfully');
    } catch (error) {
      console.error('Error saving cover letter:', error);
      toast.error('Failed to save cover letter');
    }
  };

  const handleExport = async (format: 'pdf' | 'docx') => {
    if (!selectedLetter) return;
    
    const letter = generatedLetters.find(l => l.id === selectedLetter);
    if (!letter) return;

    try {
      const response = await fetch(`/api/export-cover-letter/${format}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: letter.content,
          settings: letter.settings,
          metadata: {
            companyName,
            hiringManager,
            date: currentDateTime,
          },
        }),
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Cover-Letter-${companyName}-${currentDateTime}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting cover letter:', error);
      toast.error('Failed to export cover letter');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Cover Letter Generator</h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-md ${
              showSettings ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FiSliders className="w-5 h-5" />
          </button>
        </div>

        {/* Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Company Name *"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Hiring Manager's Name (optional)"
            value={hiringManager}
            onChange={(e) => setHiringManager(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Job Description */}
        <textarea
          placeholder="Paste job description here *"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={4}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tone
              </label>
              <select
                value={settings.tone}
                onChange={(e) => setSettings({ ...settings, tone: e.target.value as any })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="professional">Professional</option>
                <option value="conversational">Conversational</option>
                <option value="enthusiastic">Enthusiastic</option>
              </select>
            </div>

            {/* Length */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Length
              </label>
              <select
                value={settings.length}
                onChange={(e) => setSettings({ ...settings, length: e.target.value as any })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="concise">Concise</option>
                <option value="standard">Standard</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>

            {/* Focus */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Focus
              </label>
              <select
                value={settings.focus}
                onChange={(e) => setSettings({ ...settings, focus: e.target.value as any })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="experience">Experience</option>
                <option value="skills">Skills</option>
                <option value="culture">Culture Fit</option>
                <option value="achievements">Achievements</option>
              </select>
            </div>

            {/* Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Style
              </label>
              <select
                value={settings.style}
                onChange={(e) => setSettings({ ...settings, style: e.target.value as any })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="traditional">Traditional</option>
                <option value="modern">Modern</option>
                <option value="creative">Creative</option>
              </select>
            </div>

            {/* Custom Instructions */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Instructions (Optional)
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Add any specific instructions or points you'd like to include..."
                rows={3}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={generateLetter}
          disabled={isGenerating || !jobDescription || !companyName}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <FiRefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FiZap className="w-5 h-5 mr-2" />
              Generate Cover Letter
            </>
          )}
        </button>
      </div>

      {/* Generated Letters */}
      <div className="p-4 space-y-4">
        {generatedLetters.map((letter) => (
          <div
            key={letter.id}
            className={`p-4 rounded-lg border ${
              selectedLetter === letter.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm text-gray-500">
                  Generated on {letter.timestamp}
                </p>
                <div className="flex space-x-2 mt-1">
                  {Object.entries(letter.settings).map(([key, value]) => (
                    key !== 'customInstructions' && (
                      <span
                        key={key}
                        className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs"
                      >
                        {value}
                      </span>
                    )
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleCopy(letter.content)}
                  className="p-1 text-gray-600 hover:text-blue-600"
                  title="Copy"
                >
                  <FiCopy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleSave(letter.id)}
                  className="p-1 text-gray-600 hover:text-blue-600"
                  title="Save"
                >
                  <FiSave className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedLetter(letter.id)}
                  className="p-1 text-gray-600 hover:text-blue-600"
                  title="Select"
                >
                  <FiCheck className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="prose max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: letter.content }}
                className="text-gray-700 whitespace-pre-wrap"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Export Options */}
      {selectedLetter && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              <FiDownload className="w-5 h-5 mr-2" />
              Export as PDF
            </button>
            <button
              onClick={() => handleExport('docx')}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              <FiDownload className="w-5 h-5 mr-2" />
              Export as DOCX
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Last generated by {currentUser} at {currentDateTime}
        </p>
      </div>
    </div>
  );
};

export default CoverLetterGenerator;
