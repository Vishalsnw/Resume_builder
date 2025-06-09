// pages/resumes/edit/[id].tsx

import index from '@/pages/help/index';
import edit from '@/pages/profile/edit';
import [id] from '@/pages/resumes/edit/[id]';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import login from '@/pages/api/auth/login';
// REMOVED INVALID IMPORT
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { 
  FiSave,
  FiEye,
  FiArrowLeft,
  FiClock,
  FiCheck,
  FiXCircle,
  FiAlertCircle,
  FiTrash2,
  FiLoader
} from 'react-icons/fi';

interface ResumeFormData {
  title: string;
  template: string;
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
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
}

const EditResumePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  const [formData, setFormData] = useState<ResumeFormData>({
    title: '',
    template: '',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (id && status === 'authenticated') {
      fetchResumeData();
    }
  }, [id, status, router]);

  // Auto-save functionality
  useEffect(() => {
    let autoSaveTimer: NodeJS.Timeout;

    if (hasChanges && autoSaveEnabled) {
      autoSaveTimer = setTimeout(() => {
        handleSave(true);
      }, 30000); // Auto-save every 30 seconds
    }

    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [formData, hasChanges, autoSaveEnabled]);

  // Warn about unsaved changes before leaving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const fetchResumeData = async () => {
    try {
      const response = await fetch(`/api/resumes/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
        setLastSaved(data.lastModified);
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

  const handleChange = (
    section: keyof ResumeFormData,
    value: any,
    index?: number,
    field?: string
  ) => {
    setFormData(prev => {
      if (index !== undefined && field) {
        // Handle array fields
        const newArray = [...prev[section]];
        if (typeof newArray[index] === 'object') {
          newArray[index] = {
            ...newArray[index],
            [field]: value,
          };
        }
        return {
          ...prev,
          [section]: newArray,
        };
      }
      // Handle direct fields
      return {
        ...prev,
        [section]: value,
      };
    });
    setHasChanges(true);
  };

  const handleAddItem = (section: 'education' | 'experience' | 'skills' | 'projects') => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], getEmptyItem(section)],
    }));
    setHasChanges(true);
  };

  const handleRemoveItem = (section: 'education' | 'experience' | 'skills' | 'projects', index: number) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
    setHasChanges(true);
  };

  const getEmptyItem = (section: string) => {
    switch (section) {
      case 'education':
        return {
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
        };
      case 'experience':
        return {
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          highlights: [''],
        };
      case 'skills':
        return {
          category: '',
          items: [''],
        };
      case 'projects':
        return {
          name: '',
          description: '',
          technologies: [],
        };
      default:
        return {};
    }
  };

  const handleSave = async (isAutoSave = false) => {
    if (!hasChanges) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          lastModifiedBy: 'Vishalsnw',
          lastModified: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setHasChanges(false);
        setLastSaved(new Date().toISOString());
        if (!isAutoSave) {
          toast.success('Resume saved successfully');
        }
      } else {
        throw new Error('Failed to save resume');
      }
    } catch (error) {
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Edit Resume: {formData.title}
            </h1>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <FiClock className="mr-1.5 h-4 w-4" />
              {lastSaved ? `Last saved: ${new Date(lastSaved).toLocaleString()}` : 'Not saved yet'}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiEye className="mr-2 h-4 w-4" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={saving || !hasChanges}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 ${
                (saving || !hasChanges) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {saving ? (
                <>
                  <FiLoader className="animate-spin mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Edit Form */}
        <div className="space-y-6">
          {/* Personal Information */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Personal Information
            </h2>
            {/* Add form fields for personal information */}
          </section>

          {/* Experience Section */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Experience
            </h2>
            {/* Add form fields for experience */}
          </section>

          {/* Education Section */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Education
            </h2>
            {/* Add form fields for education */}
          </section>

          {/* Skills Section */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Skills
            </h2>
            {/* Add form fields for skills */}
          </section>

          {/* Projects Section */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Projects
            </h2>
            {/* Add form fields for projects */}
          </section>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="lg:sticky lg:top-8 space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Preview
              </h2>
              {/* Add resume preview */}
            </div>
          </div>
        )}
      </div>

      {/* Last updated info */}
      <div className="mt-8 text-center text-xs text-gray-500">
        Last updated by Vishalsnw at 2025-06-07 20:34:51
      </div>
    </div>
  );
};

export default EditResumePage;
