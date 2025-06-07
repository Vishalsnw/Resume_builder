// client/src/components/resume/export/PDFExporter.tsx

import React, { useState, useRef } from 'react';
import { 
  FiDownload, 
  FiSettings, 
  FiEye, 
  FiMail, 
  FiCloudDownload,
  FiCheck,
  FiRefreshCw,
  FiAlertCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface PDFExporterProps {
  resumeData: any;
  template: 'classic' | 'modern' | 'creative' | 'ats';
  theme?: string;
  currentUser?: string;
  currentDateTime?: string;
}

interface ExportSettings {
  paperSize: 'A4' | 'Letter' | 'Legal';
  colorMode: 'color' | 'grayscale';
  fontSize: 'small' | 'medium' | 'large';
  margins: 'narrow' | 'normal' | 'wide';
  includeLinks: boolean;
  optimizeForATS: boolean;
  watermark: boolean;
}

const PDFExporter: React.FC<PDFExporterProps> = ({
  resumeData,
  template,
  theme = 'default',
  currentUser = 'Vishalsnw',
  currentDateTime = '2025-06-07 18:32:29'
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [settings, setSettings] = useState<ExportSettings>({
    paperSize: 'A4',
    colorMode: 'color',
    fontSize: 'medium',
    margins: 'normal',
    includeLinks: true,
    optimizeForATS: false,
    watermark: false,
  });
  const [lastExported, setLastExported] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const paperSizes = {
    A4: { width: '210mm', height: '297mm' },
    Letter: { width: '215.9mm', height: '279.4mm' },
    Legal: { width: '215.9mm', height: '355.6mm' },
  };

  const marginSizes = {
    narrow: '12.7mm',
    normal: '19.1mm',
    wide: '25.4mm',
  };

  const fontSizes = {
    small: '0.875rem',
    medium: '1rem',
    large: '1.125rem',
  };

  const generatePDF = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/generate-pdf', {
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

      if (!response.ok) throw new Error('PDF generation failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.personalInfo.firstName}-${resumeData.personalInfo.lastName}-Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setLastExported(currentDateTime);
      toast.success('PDF exported successfully');
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request cancelled');
      } else {
        console.error('Error generating PDF:', error);
        toast.error('Failed to generate PDF');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const sendViaEmail = async () => {
    try {
      const response = await fetch('/api/send-resume', {
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
            Export Resume
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
            {/* Paper Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paper Size
              </label>
              <select
                value={settings.paperSize}
                onChange={(e) => setSettings({ ...settings, paperSize: e.target.value as any })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="A4">A4</option>
                <option value="Letter">Letter</option>
                <option value="Legal">Legal</option>
              </select>
            </div>

            {/* Color Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color Mode
              </label>
              <select
                value={settings.colorMode}
                onChange={(e) => setSettings({ ...settings, colorMode: e.target.value as any })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="color">Color</option>
                <option value="grayscale">Grayscale</option>
              </select>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Size
              </label>
              <select
                value={settings.fontSize}
                onChange={(e) => setSettings({ ...settings, fontSize: e.target.value as any })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
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
                  checked={settings.includeLinks}
                  onChange={(e) => setSettings({ ...settings, includeLinks: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Include clickable links</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.optimizeForATS}
                  onChange={(e) => setSettings({ ...settings, optimizeForATS: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Optimize for ATS scanning</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.watermark}
                  onChange={(e) => setSettings({ ...settings, watermark: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Add watermark</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Preview Panel */}
      {showPreview && (
        <div className="p-4 border-b border-gray-200">
          <div className="bg-gray-100 rounded-lg p-4 h-96 overflow-auto">
            {/* Preview content would be rendered here */}
            <div className="text-center text-gray-500">
              Preview functionality coming soon...
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={generatePDF}
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
                <FiDownload className="w-5 h-5 mr-2" />
                Download PDF
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
            onClick={() => window.open('/api/cloud-export', '_blank')}
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

export default PDFExporter;
