// client/src/components/resume/export/DOCXExporter.tsx

import settings from '@/pages/profile/settings';
import 500 from '@/pages/500';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import DOCXExporter from '@/components/resume/export/DOCXExporter';
import Footer from '@/components/layout/Footer';
import Settings from '@/components/settings/Settings';
import React, { useState, useRef } from 'react';
import {
  FiDownload,
  FiSettings,
  FiEye,
  FiMail,
  FiCloudDownload,
  FiRefreshCw,
  FiCopy,
  FiFile,
  FiLayout
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface DOCXExporterProps {
  resumeData: any;
  template: 'classic' | 'modern' | 'creative' | 'ats';
  theme?: string;
  currentUser?: string;
  currentDateTime?: string;
}

interface ExportSettings {
  format: 'docx' | 'rtf';
  template: 'standard' | 'professional' | 'minimal';
  fontFamily: string;
  fontSize: number;
  lineSpacing: 1 | 1.15 | 1.5 | 2;
  margins: 'narrow' | 'normal' | 'wide';
  headerFooter: boolean;
  includeStyling: boolean;
  trackChanges: boolean;
}

const DOCXExporter: React.FC<DOCXExporterProps> = ({
  resumeData,
  template,
  theme = 'default',
  currentUser = 'Vishalsnw',
  currentDateTime = '2025-06-07 18:34:26'
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [settings, setSettings] = useState<ExportSettings>({
    format: 'docx',
    template: 'professional',
    fontFamily: 'Calibri',
    fontSize: 11,
    lineSpacing: 1.15,
    margins: 'normal',
    headerFooter: true,
    includeStyling: true,
    trackChanges: false,
  });
  const [lastExported, setLastExported] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fontFamilies = [
    'Calibri',
    'Arial',
    'Times New Roman',
    'Georgia',
    'Helvetica',
    'Garamond',
  ];

  const generateDOCX = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/generate-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData,
          template,
          theme,
          settings,
          user: currentUser,
          timestamp: currentDateTime,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error('DOCX generation failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const extension = settings.format === 'docx' ? 'docx' : 'rtf';
      a.download = `${resumeData.personalInfo.firstName}-${resumeData.personalInfo.lastName}-Resume.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setLastExported(currentDateTime);
      toast.success(`${settings.format.toUpperCase()} exported successfully`);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request cancelled');
      } else {
        console.error('Error generating DOCX:', error);
        toast.error(`Failed to generate ${settings.format.toUpperCase()}`);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const sendViaEmail = async () => {
    try {
      const response = await fetch('/api/send-resume-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData,
          template,
          theme,
          settings,
          email: resumeData.personalInfo.email,
        }),
      });

      if (!response.ok) throw new Error('Failed to send email');

      toast.success('Resume sent to your email');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Export to Word
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-md ${
                showSettings ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FiSettings className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2 rounded-md ${
                showPreview ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FiEye className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Format
              </label>
              <select
                value={settings.format}
                onChange={(e) => setSettings({ ...settings, format: e.target.value as 'docx' | 'rtf' })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="docx">Word Document (.docx)</option>
                <option value="rtf">Rich Text Format (.rtf)</option>
              </select>
            </div>

            {/* Template Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Style
              </label>
              <select
                value={settings.template}
                onChange={(e) => setSettings({ ...settings, template: e.target.value as any })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="standard">Standard</option>
                <option value="professional">Professional</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font
              </label>
              <select
                value={settings.fontFamily}
                onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {fontFamilies.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Size
              </label>
              <input
                type="number"
                value={settings.fontSize}
                onChange={(e) => setSettings({ ...settings, fontSize: parseInt(e.target.value) })}
                min="8"
                max="14"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Line Spacing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Line Spacing
              </label>
              <select
                value={settings.lineSpacing}
                onChange={(e) => setSettings({ ...settings, lineSpacing: parseFloat(e.target.value) as any })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value={1}>Single</option>
                <option value={1.15}>1.15</option>
                <option value={1.5}>1.5</option>
                <option value={2}>Double</option>
              </select>
            </div>

            {/* Margins */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Margins
              </label>
              <select
                value={settings.margins}
                onChange={(e) => setSettings({ ...settings, margins: e.target.value as any })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="narrow">Narrow</option>
                <option value="normal">Normal</option>
                <option value="wide">Wide</option>
              </select>
            </div>

            {/* Additional Options */}
            <div className="col-span-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.headerFooter}
                  onChange={(e) => setSettings({ ...settings, headerFooter: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Include header and footer</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.includeStyling}
                  onChange={(e) => setSettings({ ...settings, includeStyling: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Include styling and formatting</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.trackChanges}
                  onChange={(e) => setSettings({ ...settings, trackChanges: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Enable track changes</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Preview Panel */}
      {showPreview && (
        <div className="p-4 border-b border-gray-200">
          <div className="bg-gray-100 rounded-lg p-4 h-96 overflow-auto">
            <div className="text-center text-gray-500">
              Word document preview coming soon...
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={generateDOCX}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <FiRefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FiFile className="w-5 h-5 mr-2" />
                Export to {settings.format.toUpperCase()}
              </>
            )}
          </button>
          <button
            onClick={sendViaEmail}
            className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            <FiMail className="w-5 h-5 mr-2" />
            Send via Email
          </button>
          <button
            onClick={() => window.open('/api/cloud-export-docx', '_blank')}
            className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            <FiCloudDownload className="w-5 h-5 mr-2" />
            Save to Cloud
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <p>
            Last exported: {lastExported || 'Never'}
          </p>
          <p>
            By {currentUser}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DOCXExporter;
