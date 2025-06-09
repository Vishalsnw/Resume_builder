// client/src/components/resume/templates/TemplatePreview.tsx

import 500 from '@/pages/500';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import TemplatePreview from '@/components/resume/templates/TemplatePreview';
import React, { useState } from 'react';
import { FiDownload, FiZoomIn, FiZoomOut, FiRefreshCw } from 'react-icons/fi';
import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import CreativeTemplate from './CreativeTemplate';
import ATSTemplate from './ATSTemplate';

interface ResumeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    website?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    summary: string;
    profileImage?: string;
  };
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    isCurrentRole: boolean;
    responsibilities: string[];
    achievements?: string[];
    technologies?: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    location: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    achievements?: string[];
  }>;
  skills: Array<{
    category: string;
    skills: Array<{
      name: string;
      proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    }>;
  }>;
  certifications?: Array<{
    name: string;
    issuingOrganization: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
  }>;
  projects?: Array<{
    title: string;
    description: string;
    technologies: string[];
    liveUrl?: string;
    repoUrl?: string;
  }>;
}

interface TemplatePreviewProps {
  data: ResumeData;
  currentUser?: string;
  currentDateTime?: string;
}

type TemplateType = 'classic' | 'modern' | 'creative' | 'ats';
type ThemeType = 'gradient' | 'minimal' | 'geometric' | 'wave';

const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  data,
  currentUser = 'Vishalsnw',
  currentDateTime = '2025-06-07 18:11:14'
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('gradient');
  const [scale, setScale] = useState(0.8);
  const [showGuides, setShowGuides] = useState(false);

  const templates = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    creative: CreativeTemplate,
    ats: ATSTemplate,
  };

  const SelectedTemplate = templates[selectedTemplate];

  const handleDownload = async () => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template: selectedTemplate,
          theme: selectedTheme,
          data,
        }),
      });

      if (!response.ok) throw new Error('PDF generation failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.personalInfo.firstName}-${data.personalInfo.lastName}-Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Add your error handling here (e.g., showing a toast notification)
    }
  };

  const handleScaleChange = (newScale: number) => {
    if (newScale >= 0.5 && newScale <= 1.5) {
      setScale(newScale);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* Control Panel */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Template Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Template Style
              </label>
              <div className="flex space-x-2">
                {Object.keys(templates).map((template) => (
                  <button
                    key={template}
                    onClick={() => setSelectedTemplate(template as TemplateType)}
                    className={`
                      px-4 py-2 rounded-md text-sm font-medium
                      ${selectedTemplate === template
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {template.charAt(0).toUpperCase() + template.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selection (for supported templates) */}
            {selectedTemplate === 'creative' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Theme
                </label>
                <div className="flex space-x-2">
                  {['gradient', 'minimal', 'geometric', 'wave'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setSelectedTheme(theme as ThemeType)}
                      className={`
                        px-4 py-2 rounded-md text-sm font-medium
                        ${selectedTheme === theme
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleScaleChange(scale - 0.1)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FiZoomOut className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={() => handleScaleChange(scale + 0.1)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FiZoomIn className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => setShowGuides(!showGuides)}
                className={`
                  p-2 rounded-full
                  ${showGuides ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}
                `}
              >
                <FiRefreshCw className="w-5 h-5" />
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FiDownload className="w-5 h-5 mr-2" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="max-w-7xl mx-auto px-4">
        <div 
          className="bg-gray-800 rounded-lg p-8 overflow-auto"
          style={{ minHeight: '842px' }} // A4 height in pixels
        >
          <div className="flex justify-center transform-gpu">
            <SelectedTemplate
              data={data}
              scale={scale}
              showGuides={showGuides}
              theme={selectedTheme}
            />
          </div>
        </div>
      </div>

      {/* Last Updated Info */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <p className="text-sm text-gray-500">
          Last updated by {currentUser} at {currentDateTime}
        </p>
      </div>
    </div>
  );
};

export default TemplatePreview;
