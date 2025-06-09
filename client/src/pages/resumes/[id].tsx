// pages/resumes/[id].tsx

import index from '@/pages/help/index';
import edit from '@/pages/profile/edit';
import [id] from '@/pages/resumes/edit/[id]';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import login from '@/pages/api/auth/login';
import 500 from '@/pages/500';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { 
  FiEdit2, 
  FiDownload, 
  FiShare2, 
  FiPrinter,
  FiTrash2,
  FiEye,
  FiClock,
  FiStar,
  FiCopy,
  FiArrowLeft,
  FiCheckCircle
} from 'react-icons/fi';

interface Resume {
  id: string;
  title: string;
  content: {
    personalInfo: {
      fullName: string;
      email: string;
      phone: string;
      location: string;
      website?: string;
      linkedin?: string;
    };
    education: Array<{
      institution: string;
      degree: string;
      field: string;
      startDate: string;
      endDate: string;
      gpa?: string;
    }>;
    experience: Array<{
      company: string;
      position: string;
      location: string;
      startDate: string;
      endDate: string;
      highlights: string[];
    }>;
    skills: Array<{
      category: string;
      items: string[];
    }>;
    projects?: Array<{
      name: string;
      description: string;
      technologies: string[];
      link?: string;
    }>;
    certifications?: Array<{
      name: string;
      issuer: string;
      date: string;
      link?: string;
    }>;
  };
  template: string;
  lastModified: string;
  status: 'draft' | 'completed';
  isStarred: boolean;
  views: number;
  downloads: number;
  shareLink?: string;
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    lastModifiedBy: string;
    version: number;
  };
}

const ResumeViewPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'docx' | 'txt'>('pdf');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (id && status === 'authenticated') {
      fetchResume();
    }
  }, [id, status, router]);

  const fetchResume = async () => {
    try {
      const response = await fetch(`/api/resumes/${id}`);
      if (response.ok) {
        const data = await response.json();
        setResume(data);
        // Record view
        await fetch(`/api/resumes/${id}/view`, { method: 'POST' });
      } else {
        throw new Error('Failed to fetch resume');
      }
    } catch (error) {
      toast.error('Failed to load resume');
      router.push('/resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format: 'pdf' | 'docx' | 'txt') => {
    setDownloading(true);
    try {
      const response = await fetch(`/api/resumes/${id}/download?format=${format}`, {
        method: 'GET',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resume?.title || 'resume'}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Record download
        await fetch(`/api/resumes/${id}/download`, { method: 'POST' });
        toast.success(`Resume downloaded successfully as ${format.toUpperCase()}`);
      } else {
        throw new Error('Failed to download resume');
      }
    } catch (error) {
      toast.error('Failed to download resume');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      const response = await fetch(`/api/resumes/${id}/share`, {
        method: 'POST',
      });

      if (response.ok) {
        const { shareLink } = await response.json();
        await navigator.clipboard.writeText(shareLink);
        toast.success('Share link copied to clipboard');
      } else {
        throw new Error('Failed to generate share link');
      }
    } catch (error) {
      toast.error('Failed to share resume');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        const response = await fetch(`/api/resumes/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          toast.success('Resume deleted successfully');
          router.push('/resumes');
        } else {
          throw new Error('Failed to delete resume');
        }
      } catch (error) {
        toast.error('Failed to delete resume');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Resume not found</h2>
          <p className="mt-2 text-gray-600">
            The resume you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link
            href="/resumes"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Resumes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{resume.title}</h1>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <FiClock className="mr-1.5 h-4 w-4" />
              Last modified {new Date(resume.lastModified).toLocaleString()}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href={`/resumes/edit/${id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <FiEdit2 className="mr-2 h-4 w-4" />
              Edit
            </Link>
            <button
              onClick={() => setShareModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiShare2 className="mr-2 h-4 w-4" />
              Share
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
            >
              <FiTrash2 className="mr-2 h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white shadow rounded-lg">
        {/* Preview Controls */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value as 'pdf' | 'docx' | 'txt')}
                className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="pdf">PDF</option>
                <option value="docx">DOCX</option>
                <option value="txt">TXT</option>
              </select>
              <button
                onClick={() => handleDownload(selectedFormat)}
                disabled={downloading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiDownload className="mr-2 h-4 w-4" />
                {downloading ? 'Downloading...' : 'Download'}
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiPrinter className="mr-2 h-4 w-4" />
                Print
              </button>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <FiEye className="mr-1.5 h-4 w-4" />
              {resume.views} views
              <span className="mx-2">•</span>
              <FiDownload className="mr-1.5 h-4 w-4" />
              {resume.downloads} downloads
            </div>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="p-6">
          {/* Resume content rendering based on template */}
          <div className="prose max-w-none">
            {/* Personal Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{resume.content.personalInfo.fullName}</h2>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div>{resume.content.personalInfo.email}</div>
                <div>{resume.content.personalInfo.phone}</div>
                <div>{resume.content.personalInfo.location}</div>
                {resume.content.personalInfo.website && (
                  <a href={resume.content.personalInfo.website} target="_blank" rel="noopener noreferrer">
                    {resume.content.personalInfo.website}
                  </a>
                )}
              </div>
            </div>

            {/* Experience Section */}
            <section className="mb-8">
              <h3 className="text-xl font-bold mb-4">Experience</h3>
              {resume.content.experience.map((exp, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{exp.position}</h4>
                      <div className="text-gray-600">{exp.company}</div>
                    </div>
                    <div className="text-gray-600">
                      {exp.startDate} - {exp.endDate}
                    </div>
                  </div>
                  <ul className="mt-2 list-disc list-inside">
                    {exp.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            {/* Education Section */}
            <section className="mb-8">
              <h3 className="text-xl font-bold mb-4">Education</h3>
              {resume.content.education.map((edu, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{edu.institution}</h4>
                      <div>{edu.degree} in {edu.field}</div>
                      {edu.gpa && <div className="text-gray-600">GPA: {edu.gpa}</div>}
                    </div>
                    <div className="text-gray-600">
                      {edu.startDate} - {edu.endDate}
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Skills Section */}
            <section className="mb-8">
              <h3 className="text-xl font-bold mb-4">Skills</h3>
              {resume.content.skills.map((skillCategory, index) => (
                <div key={index} className="mb-4">
                  <h4 className="font-semibold">{skillCategory.category}</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skillCategory.items.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            {/* Projects Section */}
            {resume.content.projects && (
              <section className="mb-8">
                <h3 className="text-xl font-bold mb-4">Projects</h3>
                {resume.content.projects.map((project, index) => (
                  <div key={index} className="mb-6">
                    <h4 className="font-semibold">{project.name}</h4>
                    <p className="text-gray-600">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline mt-2 inline-block"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* Certifications Section */}
            {resume.content.certifications && (
              <section className="mb-8">
                <h3 className="text-xl font-bold mb-4">Certifications</h3>
                {resume.content.certifications.map((cert, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="font-semibold">{cert.name}</h4>
                    <div className="text-gray-600">
                      {cert.issuer} • {cert.date}
                    </div>
                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline mt-1 inline-block"
                      >
                        View Certificate
                      </a>
                    )}
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Last updated info */}
      <div className="mt-8 text-center text-xs text-gray-500">
        Last updated by Vishalsnw at 2025-06-07 20:28:59
      </div>
    </div>
  );
};

export default ResumeViewPage;
