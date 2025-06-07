// pages/resumes/create.tsx

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { 
  FiCheck, 
  FiChevronRight, 
  FiChevronLeft,
  FiSave,
  FiImage,
  FiEye,
  FiArrowLeft
} from 'react-icons/fi';

interface ResumeTemplate {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  category: 'professional' | 'creative' | 'simple' | 'modern';
}

interface FormData {
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

const STEPS = [
  { id: 'template', title: 'Choose Template' },
  { id: 'personal', title: 'Personal Information' },
  { id: 'experience', title: 'Experience' },
  { id: 'education', title: 'Education' },
  { id: 'skills', title: 'Skills' },
  { id: 'projects', title: 'Projects' },
  { id: 'review', title: 'Review & Finish' }
];

const CreateResumePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    template: '',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
    },
    education: [{
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
    }],
    experience: [{
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      highlights: [''],
    }],
    skills: [{
      category: '',
      items: [''],
    }],
    projects: [{
      name: '',
      description: '',
      technologies: [],
    }],
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchTemplates();
    }
  }, [status, router]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/resume-templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      } else {
        throw new Error('Failed to fetch templates');
      }
    } catch (error) {
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setFormData(prev => ({
      ...prev,
      template: templateId,
    }));
  };

  const handlePersonalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value,
      },
    }));
  };

  const handleEducationChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
        },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleExperienceChange = (
    index: number,
    field: string,
    value: string | string[]
  ) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          highlights: [''],
        },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleSkillsChange = (
    index: number,
    field: string,
    value: string | string[]
  ) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === index ? { ...skill, [field]: value } : skill
      ),
    }));
  };

  const addSkillCategory = () => {
    setFormData(prev => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          category: '',
          items: [''],
        },
      ],
    }));
  };

  const removeSkillCategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0: // Template
        return !!formData.template;
      case 1: // Personal Info
        return (
          !!formData.personalInfo.fullName &&
          !!formData.personalInfo.email &&
          !!formData.personalInfo.phone
        );
      // Add validation for other steps
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const { id } = await response.json();
        toast.success('Resume created successfully');
        router.push(`/resumes/${id}`);
      } else {
        throw new Error('Failed to create resume');
      }
    } catch (error) {
      toast.error('Failed to create resume');
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
            <h1 className="text-2xl font-bold text-gray-900">Create New Resume</h1>
            <p className="mt-1 text-sm text-gray-500">
              Follow the steps to create your resume
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${
                index < STEPS.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  index <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {index < currentStep ? (
                  <FiCheck className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-4 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`text-sm ${
                index <= currentStep
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-500'
              }`}
            >
              {step.title}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white shadow rounded-lg p-6">
        {/* Step content based on currentStep */}
        {/* Add your step content here */}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 ${
            currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <FiChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </button>
        {currentStep === STEPS.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <FiSave className="mr-2 h-4 w-4" />
            {saving ? 'Creating...' : 'Create Resume'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Next
            <FiChevronRight className="ml-2 h-4 w-4" />
          </button>
        )}
      </div>

      {/* Last updated info */}
      <div className="mt-8 text-center text-xs text-gray-500">
        Last updated by Vishalsnw at 2025-06-07 20:31:49
      </div>
    </div>
  );
};

export default CreateResumePage;
