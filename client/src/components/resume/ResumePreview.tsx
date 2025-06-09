// src/components/resume/ResumePreview.tsx

import index from '@/pages/help/index';
import contact from '@/pages/help/contact';
import [id] from '@/pages/resumes/edit/[id]';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
// REMOVED INVALID IMPORT
import ResumePreview from '@/components/resume/ResumePreview';
import React, { useRef } from 'react';
import { 
  HiOutlineDownload,
  HiOutlinePrinter,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineGlobe,
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineCode
} from 'react-icons/hi';

interface ResumePreviewProps {
  resumeData: any;
  template: string;
  onDownload?: () => void;
  onPrint?: () => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ 
  resumeData, 
  template = 'professional',
  onDownload,
  onPrint
}) => {
  const previewRef = useRef<HTMLDivElement>(null);

  // Handle print action
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      const content = previewRef.current;
      if (content) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>${resumeData.basics.name} - Resume</title>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                <style>
                  @media print {
                    body {
                      font-size: 12px;
                      color: #000;
                    }
                  }
                </style>
              </head>
              <body>
                ${content.outerHTML}
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        }
      }
    }
  };

  // Template-specific styling
  const getTemplateStyles = () => {
    switch (template) {
      case 'modern':
        return {
          primary: 'indigo-600',
          background: 'white',
          heading: 'text-indigo-600',
          section: 'border-l-4 border-indigo-500 pl-4',
          layout: 'grid-cols-3'
        };
      case 'creative':
        return {
          primary: 'purple-600',
          background: 'white',
          heading: 'text-purple-600 font-bold',
          section: 'border-b-2 border-purple-400',
          layout: 'grid-cols-1'
        };
      case 'minimal':
        return {
          primary: 'gray-800',
          background: 'white',
          heading: 'text-gray-800 uppercase tracking-wider text-sm font-bold',
          section: 'border-t border-gray-200 pt-4',
          layout: 'grid-cols-4'
        };
      case 'executive':
        return {
          primary: 'blue-800',
          background: 'gray-50',
          heading: 'text-blue-800 text-xl font-serif',
          section: 'border-b-2 border-blue-800',
          layout: 'grid-cols-3'
        };
      case 'technical':
        return {
          primary: 'cyan-700',
          background: 'white',
          heading: 'text-cyan-700 bg-cyan-50 px-2 py-1 inline-block',
          section: 'border-t-2 border-cyan-200 pt-2',
          layout: 'grid-cols-5'
        };
      case 'professional':
      default:
        return {
          primary: 'blue-600',
          background: 'white',
          heading: 'text-blue-600',
          section: 'border-b border-gray-200 pb-1',
          layout: 'grid-cols-4'
        };
    }
  };

  const styles = getTemplateStyles();

  // If resumeData is missing or incomplete, display a placeholder
  if (!resumeData || !resumeData.basics) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500 text-lg">Add information to preview your resume</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Preview controls */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-base font-medium text-gray-700">Resume Preview</h3>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
          >
            <HiOutlinePrinter className="-ml-0.5 mr-1 h-4 w-4" />
            Print
          </button>
          <button
            onClick={onDownload}
            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-${styles.primary} hover:bg-${styles.primary.split('-')[0]}-700`}
          >
            <HiOutlineDownload className="-ml-0.5 mr-1 h-4 w-4" />
            Download PDF
          </button>
        </div>
      </div>
      
      {/* Resume preview content */}
      <div 
        ref={previewRef}
        className={`p-8 bg-${styles.background} a4-page mx-auto`}
        style={{ maxWidth: '210mm', minHeight: '297mm' }}
      >
        {/* Header section - Name and contact */}
        <header className={`mb-6 ${template === 'creative' ? 'bg-purple-100 p-6 -m-8 mb-6' : ''}`}>
          <h1 className={`text-3xl font-bold ${template === 'minimal' ? 'uppercase tracking-wider' : ''} ${template === 'creative' ? 'text-purple-800' : 'text-gray-900'}`}>
            {resumeData.basics.name}
          </h1>
          
          {resumeData.basics.label && (
            <h2 className={`text-xl ${template === 'creative' ? 'text-purple-600 font-bold' : 'text-gray-600'} mt-1`}>
              {resumeData.basics.label}
            </h2>
          )}
          
          {/* Contact information */}
          <div className={`mt-3 flex flex-wrap ${template === 'minimal' ? 'text-sm' : ''}`}>
            {resumeData.basics.email && (
              <div className="flex items-center mr-6 mb-2">
                <HiOutlineMail className={`mr-1.5 h-4 w-4 text-${styles.primary}`} />
                <span className="text-gray-700">{resumeData.basics.email}</span>
              </div>
            )}
            
            {resumeData.basics.phone && (
              <div className="flex items-center mr-6 mb-2">
                <HiOutlinePhone className={`mr-1.5 h-4 w-4 text-${styles.primary}`} />
                <span className="text-gray-700">{resumeData.basics.phone}</span>
              </div>
            )}
            
            {resumeData.basics.website && (
              <div className="flex items-center mr-6 mb-2">
                <HiOutlineGlobe className={`mr-1.5 h-4 w-4 text-${styles.primary}`} />
                <span className="text-gray-700">{resumeData.basics.website}</span>
              </div>
            )}
            
            {resumeData.basics.location?.city && (
              <div className="flex items-center mr-6 mb-2">
                <HiOutlineLocationMarker className={`mr-1.5 h-4 w-4 text-${styles.primary}`} />
                <span className="text-gray-700">
                  {[
                    resumeData.basics.location.city,
                    resumeData.basics.location.region,
                    resumeData.basics.location.country
                  ].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Professional Summary */}
        {resumeData.basics.summary && (
          <section className="mb-6">
            <h2 className={`text-lg font-medium mb-2 ${styles.heading} ${styles.section}`}>
              Professional Summary
            </h2>
            <p className="text-gray-700 whitespace-pre-line">{resumeData.basics.summary}</p>
          </section>
        )}

        {/* Work Experience */}
        {resumeData.work && resumeData.work.length > 0 && (
          <section className="mb-6">
            <h2 className={`text-lg font-medium mb-3 ${styles.heading} ${styles.section}`}>
              <span className="flex items-center">
                <HiOutlineBriefcase className={`mr-1.5 h-5 w-5 ${template === 'minimal' ? '' : `text-${styles.primary}`}`} />
                Work Experience
              </span>
            </h2>
            
            <div className="space-y-4">
              {resumeData.work.map((job: any, index: number) => (
                <div key={index} className={`${index !== 0 ? 'pt-4 border-t border-gray-100' : ''}`}>
                  <div className="flex flex-wrap justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{job.position}</h3>
                      <h4 className={`text-${styles.primary}`}>{job.company}</h4>
                    </div>
                    
                    {(job.startDate || job.endDate) && (
                      <div className="text-gray-600 text-sm">
                        {job.startDate && (
                          <span>{formatDate(job.startDate)}</span>
                        )}
                        {job.startDate && job.endDate && <span> - </span>}
                        {job.endDate ? (
                          <span>{formatDate(job.endDate)}</span>
                        ) : job.startDate ? (
                          <span>Present</span>
                        ) : null}
                      </div>
                    )}
                  </div>
                  
                  {job.description && (
                    <p className="mt-2 text-gray-700">{job.description}</p>
                  )}
                  
                  {job.highlights && (
                    <ul className="mt-2 list-disc list-inside text-gray-700 space-y-1">
                      {job.highlights.split('\n').filter((item: string) => item.trim()).map((highlight: string, i: number) => (
                        <li key={i} className="text-sm">{highlight}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {resumeData.education && resumeData.education.length > 0 && (
          <section className="mb-6">
            <h2 className={`text-lg font-medium mb-3 ${styles.heading} ${styles.section}`}>
              <span className="flex items-center">
                <HiOutlineAcademicCap className={`mr-1.5 h-5 w-5 ${template === 'minimal' ? '' : `text-${styles.primary}`}`} />
                Education
              </span>
            </h2>
            
            <div className="space-y-4">
              {resumeData.education.map((edu: any, index: number) => (
                <div key={index} className={`${index !== 0 ? 'pt-4 border-t border-gray-100' : ''}`}>
                  <div className="flex flex-wrap justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{edu.studyType}{edu.area ? `, ${edu.area}` : ''}</h3>
                      <h4 className={`text-${styles.primary}`}>{edu.institution}</h4>
                    </div>
                    
                    <div className="text-gray-600 text-sm">
                      {edu.startDate && (
                        <span>{formatDate(edu.startDate)}</span>
                      )}
                      {edu.startDate && edu.endDate && <span> - </span>}
                      {edu.endDate ? (
                        <span>{formatDate(edu.endDate)}</span>
                      ) : edu.startDate ? (
                        <span>Present</span>
                      ) : null}
                    </div>
                  </div>
                  
                  {edu.gpa && (
                    <p className="mt-1 text-sm text-gray-600">GPA: {edu.gpa}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {resumeData.skills && resumeData.skills.length > 0 && (
          <section className="mb-6">
            <h2 className={`text-lg font-medium mb-3 ${styles.heading} ${styles.section}`}>
              <span className="flex items-center">
                <HiOutlineCode className={`mr-1.5 h-5 w-5 ${template === 'minimal' ? '' : `text-${styles.primary}`}`} />
                Skills
              </span>
            </h2>
            
            <div className={`grid ${styles.layout} gap-x-4 gap-y-2`}>
              {resumeData.skills.map((skill: any, index: number) => (
                <div key={index} className="flex items-center">
                  <span className="text-gray-800">{skill.name}</span>
                  {skill.level && template !== 'minimal' && (
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full bg-${styles.primary} bg-opacity-10 text-${styles.primary}`}>
                      {skill.level}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// Helper function to format dates
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  } catch (error) {
    return dateString;
  }
};

export default ResumePreview;
