// src/components/resume/ResumeEditor.tsx - Part 1: Imports and interfaces

import useForm from '@/hooks/useForm';
import Sidebar from '@/components/layout/Sidebar';
import ResumeEditor from '@/components/resume/ResumeEditor';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { 
  HiOutlineDocumentText,
  HiOutlineUser, 
  HiOutlineBriefcase, 
  HiOutlineAcademicCap,
  HiOutlineCode,
  HiOutlinePuzzle,
  HiOutlineStar,
  HiOutlinePhotograph,
  HiOutlineDownload,
  HiOutlineSave,
  HiOutlineTrash,
  HiOutlineChevronRight,
  HiOutlineChevronDown
} from 'react-icons/hi';

// Form data interface
interface ResumeFormData {
  basics: {
    name: string;
    label: string;
    email: string;
    phone: string;
    website: string;
    location: {
      address: string;
      city: string;
      region: string;
      postalCode: string;
      country: string;
    };
    summary: string;
  };
  work: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    highlights: string;
    description: string;
  }[];
  education: {
    institution: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }[];
  skills: {
    name: string;
    level: string;
  }[];
}
// src/components/resume/ResumeEditor.tsx - Part 2: Component setup and initial state

const ResumeEditor: React.FC = () => {
  const methods = useForm<ResumeFormData>({
    defaultValues: {
      basics: {
        name: '',
        label: '',
        email: '',
        phone: '',
        website: '',
        location: {
          address: '',
          city: '',
          region: '',
          postalCode: '',
          country: ''
        },
        summary: ''
      },
      work: [{ company: '', position: '', startDate: '', endDate: '', highlights: '', description: '' }],
      education: [{ institution: '', area: '', studyType: '', startDate: '', endDate: '', gpa: '' }],
      skills: [{ name: '', level: 'Intermediate' }]
    }
  });

  const [activeSection, setActiveSection] = useState('basics');
  const [template, setTemplate] = useState('professional');
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    basics: true,
    work: false,
    education: false,
    skills: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const { watch, control, register, handleSubmit, getValues, setValue } = methods;
  const formValues = watch();

  const addItem = (section: 'work' | 'education' | 'skills') => {
    const currentItems = getValues(section);
    let newItem;
    
    switch (section) {
      case 'work':
        newItem = { company: '', position: '', startDate: '', endDate: '', highlights: '', description: '' };
        break;
      case 'education':
        newItem = { institution: '', area: '', studyType: '', startDate: '', endDate: '', gpa: '' };
        break;
      case 'skills':
        newItem = { name: '', level: 'Intermediate' };
        break;
      default:
        newItem = {};
    }
    
    setValue(section, [...currentItems, newItem]);
  };

  const removeItem = (section: 'work' | 'education' | 'skills', index: number) => {
    const currentItems = getValues(section);
    setValue(section, currentItems.filter((_, i) => i !== index));
  };

  const onSubmit = (data: ResumeFormData) => {
    console.log('Resume data:', data);
    // Here you would save the resume data
  };

  const templates = [
    { id: 'professional', name: 'Professional', color: 'blue' },
    { id: 'modern', name: 'Modern', color: 'indigo' },
    { id: 'creative', name: 'Creative', color: 'purple' },
    { id: 'executive', name: 'Executive', color: 'gray' },
  ];
// src/components/resume/ResumeEditor.tsx - Part 3: Component JSX start (header and navigation)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-blue-600">Resume Builder</h1>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => handleSubmit(onSubmit)()}
              >
                <HiOutlineSave className="-ml-1 mr-2 h-5 w-5" />
                Save
              </button>
              <button
                type="button"
                className="btn-primary"
              >
                <HiOutlineDownload className="-ml-1 mr-2 h-5 w-5" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Create Your Resume</h3>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the information below to generate your professional resume.
            </p>
          </div>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row">
            {/* Left Sidebar - Navigation */}
            <div className="w-full md:w-64 bg-gray-50 p-4 border-r border-gray-200">
              <nav className="space-y-1" aria-label="Sidebar">
                <button
                  onClick={() => setActiveSection('basics')}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                    activeSection === 'basics' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <HiOutlineUser className="mr-3 h-5 w-5" />
                  <span>Personal Information</span>
                </button>
                <button
                  onClick={() => setActiveSection('work')}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                    activeSection === 'work' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <HiOutlineBriefcase className="mr-3 h-5 w-5" />
                  <span>Work Experience</span>
                </button>
                <button
                  onClick={() => setActiveSection('education')}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                    activeSection === 'education' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <HiOutlineAcademicCap className="mr-3 h-5 w-5" />
                  <span>Education</span>
                </button>
                <button
                  onClick={() => setActiveSection('skills')}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                    activeSection === 'skills' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <HiOutlineCode className="mr-3 h-5 w-5" />
                  <span>Skills</span>
                </button>
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Templates</h3>
                  <div className="mt-2 space-y-1">
                    {templates.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setTemplate(t.id)}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                          template === t.id ? `bg-${t.color}-100 text-${t.color}-700` : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <HiOutlineDocumentText className="mr-3 h-5 w-5" />
                        <span>{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
// src/components/resume/ResumeEditor.tsx - Part 4: Personal Information Form Section

            {/* Main Form Area */}
            <div className="flex-1 p-4">
              <FormProvider {...methods}>
                <form className="space-y-6">
                  {/* Personal Information */}
                  <div className={activeSection === 'basics' ? 'block' : 'hidden'}>
                    <div className="bg-white shadow sm:rounded-md">
                      <div 
                        className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleSection('basics')}
                      >
                        <div>
                          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                            <HiOutlineUser className="mr-2 h-5 w-5 text-gray-500" />
                            Personal Information
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Your contact details and basic information
                          </p>
                        </div>
                        <div>
                          {expandedSections.basics ? (
                            <HiOutlineChevronDown className="h-5 w-5 text-gray-500" />
                          ) : (
                            <HiOutlineChevronRight className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                      {expandedSections.basics && (
                        <div className="px-4 py-5 sm:p-6">
                          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                              <label htmlFor="name" className="form-label">Full Name</label>
                              <input
                                type="text"
                                id="name"
                                className="form-input"
                                {...register('basics.name')}
                              />
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="label" className="form-label">Job Title</label>
                              <input
                                type="text"
                                id="label"
                                className="form-input"
                                {...register('basics.label')}
                              />
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="email" className="form-label">Email Address</label>
                              <input
                                type="email"
                                id="email"
                                className="form-input"
                                {...register('basics.email')}
                              />
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="phone" className="form-label">Phone Number</label>
                              <input
                                type="tel"
                                id="phone"
                                className="form-input"
                                {...register('basics.phone')}
                              />
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="website" className="form-label">Website</label>
                              <input
                                type="text"
                                id="website"
                                className="form-input"
                                {...register('basics.website')}
                              />
                            </div>

                            <div className="sm:col-span-6">
                              <label htmlFor="summary" className="form-label">Professional Summary</label>
                              <textarea
                                id="summary"
                                rows={4}
                                className="form-input"
                                {...register('basics.summary')}
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
            </div>
// src/components/resume/ResumeEditor.tsx - Part 5: Work Experience Form Section

                  {/* Work Experience */}
                  <div className={activeSection === 'work' ? 'block' : 'hidden'}>
                    <div className="bg-white shadow sm:rounded-md">
                      <div 
                        className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleSection('work')}
                      >
                        <div>
                          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                            <HiOutlineBriefcase className="mr-2 h-5 w-5 text-gray-500" />
                            Work Experience
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Your professional work history
                          </p>
                        </div>
                        <div>
                          {expandedSections.work ? (
                            <HiOutlineChevronDown className="h-5 w-5 text-gray-500" />
                          ) : (
                            <HiOutlineChevronRight className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                      {expandedSections.work && (
                        <div className="px-4 py-5 sm:p-6">
                          {formValues.work.map((_, index) => (
                            <div key={index} className="mb-8 pb-8 border-b border-gray-200 last:mb-0 last:pb-0 last:border-0">
                              <div className="flex justify-between items-center mb-4">
                                <h4 className="text-base font-medium text-gray-900">Position {index + 1}</h4>
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => removeItem('work', index)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <HiOutlineTrash className="h-5 w-5" />
                                  </button>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                  <label className="form-label">Company</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    {...register(`work.${index}.company`)}
                                  />
                                </div>

                                <div className="sm:col-span-3">
                                  <label className="form-label">Position</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    {...register(`work.${index}.position`)}
                                  />
                                </div>

                                <div className="sm:col-span-3">
                                  <label className="form-label">Start Date</label>
                                  <input
                                    type="date"
                                    className="form-input"
                                    {...register(`work.${index}.startDate`)}
                                  />
                                </div>

                                <div className="sm:col-span-3">
                                  <label className="form-label">End Date</label>
                                  <input
                                    type="date"
                                    className="form-input"
                                    {...register(`work.${index}.endDate`)}
                                  />
                                </div>

                                <div className="sm:col-span-6">
                                  <label className="form-label">Job Description</label>
                                  <textarea
                                    rows={3}
                                    className="form-input"
                                    {...register(`work.${index}.description`)}
                                  ></textarea>
                                </div>

                                <div className="sm:col-span-6">
                                  <label className="form-label">Key Achievements</label>
                                  <textarea
                                    rows={3}
                                    className="form-input"
                                    placeholder="Separate achievements with new lines"
                                    {...register(`work.${index}.highlights`)}
                                  ></textarea>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={() => addItem('work')}
                              className="btn-secondary"
                            >
                              <HiOutlineBriefcase className="-ml-1 mr-2 h-5 w-5" />
                              Add Work Experience
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
// src/components/resume/ResumeEditor.tsx - Part 6: Education Form Section

                  {/* Education */}
                  <div className={activeSection === 'education' ? 'block' : 'hidden'}>
                    <div className="bg-white shadow sm:rounded-md">
                      <div 
                        className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleSection('education')}
                      >
                        <div>
                          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                            <HiOutlineAcademicCap className="mr-2 h-5 w-5 text-gray-500" />
                            Education
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Your academic background and qualifications
                          </p>
                        </div>
                        <div>
                          {expandedSections.education ? (
                            <HiOutlineChevronDown className="h-5 w-5 text-gray-500" />
                          ) : (
                            <HiOutlineChevronRight className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                      {expandedSections.education && (
                        <div className="px-4 py-5 sm:p-6">
                          {formValues.education.map((_, index) => (
                            <div key={index} className="mb-8 pb-8 border-b border-gray-200 last:mb-0 last:pb-0 last:border-0">
                              <div className="flex justify-between items-center mb-4">
                                <h4 className="text-base font-medium text-gray-900">Education {index + 1}</h4>
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => removeItem('education', index)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <HiOutlineTrash className="h-5 w-5" />
                                  </button>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                  <label className="form-label">Institution</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    {...register(`education.${index}.institution`)}
                                  />
                                </div>

                                <div className="sm:col-span-3">
                                  <label className="form-label">Degree</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    {...register(`education.${index}.studyType`)}
                                  />
                                </div>

                                <div className="sm:col-span-3">
                                  <label className="form-label">Field of Study</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    {...register(`education.${index}.area`)}
                                  />
                                </div>

                                <div className="sm:col-span-3">
                                  <label className="form-label">GPA</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    {...register(`education.${index}.gpa`)}
                                  />
                                </div>

                                <div className="sm:col-span-3">
                                  <label className="form-label">Start Date</label>
                                  <input
                                    type="date"
                                    className="form-input"
                                    {...register(`education.${index}.startDate`)}
                                  />
                                </div>

                                <div className="sm:col-span-3">
                                  <label className="form-label">End Date</label>
                                  <input
                                    type="date"
                                    className="form-input"
                                    {...register(`education.${index}.endDate`)}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={() => addItem('education')}
                              className="btn-secondary"
                            >
                              <HiOutlineAcademicCap className="-ml-1 mr-2 h-5 w-5" />
                              Add Education
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
// src/components/resume/ResumeEditor.tsx - Part 7: Skills Form Section

                  {/* Skills */}
                  <div className={activeSection === 'skills' ? 'block' : 'hidden'}>
                    <div className="bg-white shadow sm:rounded-md">
                      <div 
                        className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleSection('skills')}
                      >
                        <div>
                          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                            <HiOutlineCode className="mr-2 h-5 w-5 text-gray-500" />
                            Skills
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Technical and professional skills
                          </p>
                        </div>
                        <div>
                          {expandedSections.skills ? (
                            <HiOutlineChevronDown className="h-5 w-5 text-gray-500" />
                          ) : (
                            <HiOutlineChevronRight className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                      {expandedSections.skills && (
                        <div className="px-4 py-5 sm:p-6">
                          {formValues.skills.map((_, index) => (
                            <div key={index} className="mb-4 pb-4 border-b border-gray-200 last:mb-0 last:pb-0 last:border-0">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="text-base font-medium text-gray-900">Skill {index + 1}</h4>
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => removeItem('skills', index)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <HiOutlineTrash className="h-5 w-5" />
                                  </button>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                  <label className="form-label">Skill Name</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    {...register(`skills.${index}.name`)}
                                  />
                                </div>

                                <div className="sm:col-span-3">
                                  <label className="form-label">Proficiency Level</label>
                                  <select
                                    className="form-input"
                                    {...register(`skills.${index}.level`)}
                                  >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Expert">Expert</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={() => addItem('skills')}
                              className="btn-secondary"
                            >
                              <HiOutlinePuzzle className="-ml-1 mr-2 h-5 w-5" />
                              Add Skill
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
// src/components/resume/ResumeEditor.tsx - Part 8: Form submission buttons and closing tags

                  <div className="pt-5 border-t border-gray-200">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="btn-secondary mr-3"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        className="btn-primary"
                      >
                        Save Resume
                      </button>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
