// client/src/components/resume/templates/ModernTemplate.tsx

import index from '@/pages/help/index';
import [id] from '@/pages/resumes/edit/[id]';
// REMOVED INVALID IMPORT
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import ModernTemplate from '@/components/resume/templates/ModernTemplate';
import Profile from '@/components/profile/Profile';
import React from 'react';
import { format } from 'date-fns';

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

interface ModernTemplateProps {
  data: ResumeData;
  scale?: number;
  showGuides?: boolean;
  accentColor?: string;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({
  data,
  scale = 1,
  showGuides = false,
  accentColor = 'indigo',
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM yyyy');
    } catch {
      return dateString;
    }
  };

  const getAccentColorClass = (type: 'bg' | 'text' | 'border') => {
    const colorMap: Record<string, Record<string, string>> = {
      indigo: { bg: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-600' },
      blue: { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600' },
      emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-600' },
      violet: { bg: 'bg-violet-600', text: 'text-violet-600', border: 'border-violet-600' },
    };
    return colorMap[accentColor]?.[type] || colorMap.indigo[type];
  };

  const getProficiencyWidth = (proficiency: string) => {
    switch (proficiency) {
      case 'EXPERT': return 'w-full';
      case 'ADVANCED': return 'w-3/4';
      case 'INTERMEDIATE': return 'w-1/2';
      case 'BEGINNER': return 'w-1/4';
      default: return 'w-0';
    }
  };

  return (
    <div 
      className={`
        w-[210mm] min-h-[297mm] bg-white shadow-lg mx-auto
        ${showGuides ? 'border border-gray-300' : ''}
      `}
      style={{ 
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }}
    >
      {/* Header Section */}
      <div className={`${getAccentColorClass('bg')} text-white px-8 py-10`}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              {data.personalInfo.firstName}{' '}
              <span className="font-light">{data.personalInfo.lastName}</span>
            </h1>
            <p className="text-xl mt-2 font-light">
              {data.personalInfo.title}
            </p>
          </div>
          {data.personalInfo.profileImage && (
            <img
              src={data.personalInfo.profileImage}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
            />
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            {data.personalInfo.email && (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a href={`mailto:${data.personalInfo.email}`}>{data.personalInfo.email}</a>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            {data.personalInfo.location && (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{data.personalInfo.location}</span>
              </div>
            )}
            {data.personalInfo.website && (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0a10 10 0 100 20 10 10 0 000-20zM8.707 4.293a1 1 0 00-1.414 1.414L8.586 7H5a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414L12 8.414l-3.293-3.293a1 1 0 00-1.414 0z" clipRule="evenodd" />
                </svg>
                <a href={data.personalInfo.website} target="_blank" rel="noopener noreferrer">{data.personalInfo.website}</a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 p-8">
        {/* Left Column */}
        <div className="col-span-4 space-y-8">
          {/* Skills Section */}
          {data.skills.length > 0 && (
            <section>
              <h2 className={`text-lg font-bold ${getAccentColorClass('text')} mb-4`}>
                Skills
              </h2>
              <div className="space-y-6">
                {data.skills.map((category, index) => (
                  <div key={index}>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      {category.category}
                    </h3>
                    <div className="space-y-2">
                      {category.skills.map((skill, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{skill.name}</span>
                            <span className="text-gray-500">{skill.proficiency.toLowerCase()}</span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getAccentColorClass('bg')} rounded-full transition-all duration-300`}
                              style={{ width: getProficiencyWidth(skill.proficiency) }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education Section */}
          {data.education.length > 0 && (
            <section>
              <h2 className={`text-lg font-bold ${getAccentColorClass('text')} mb-4`}>
                Education
              </h2>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-4">
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-sm text-gray-600">{edu.school}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </p>
                    {edu.gpa && (
                      <p className="text-xs text-gray-600 mt-1">GPA: {edu.gpa}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications Section */}
          {data.certifications && data.certifications.length > 0 && (
            <section>
              <h2 className={`text-lg font-bold ${getAccentColorClass('text')} mb-4`}>
                Certifications
              </h2>
              <div className="space-y-4">
                {data.certifications.map((cert, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-4">
                    <h3 className="font-bold text-gray-900">{cert.name}</h3>
                    <p className="text-sm text-gray-600">{cert.issuingOrganization}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(cert.issueDate)}
                      {cert.expiryDate && ` - ${formatDate(cert.expiryDate)}`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="col-span-8 space-y-8">
          {/* Summary Section */}
          {data.personalInfo.summary && (
            <section>
              <h2 className={`text-lg font-bold ${getAccentColorClass('text')} mb-4`}>
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {data.personalInfo.summary}
              </p>
            </section>
          )}

          {/* Experience Section */}
          {data.experience.length > 0 && (
            <section>
              <h2 className={`text-lg font-bold ${getAccentColorClass('text')} mb-4`}>
                Professional Experience
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative">
                    <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-gray-300 -ml-1" />
                    <div className="border-l-2 border-gray-200 pl-6 pb-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900">{exp.title}</h3>
                          <p className="text-sm text-gray-600">{exp.company} • {exp.location}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDate(exp.startDate)} - {exp.isCurrentRole ? 'Present' : formatDate(exp.endDate)}
                        </p>
                      </div>
                      <ul className="mt-2 space-y-2">
                        {exp.responsibilities.map((resp, idx) => (
                          <li key={idx} className="text-gray-700 text-sm">
                            • {resp}
                          </li>
                        ))}
                      </ul>
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {exp.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-1 text-xs rounded-full ${getAccentColorClass('bg')} bg-opacity-10 ${getAccentColorClass('text')}`}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects Section */}
          {data.projects && data.projects.length > 0 && (
            <section>
              <h2 className={`text-lg font-bold ${getAccentColorClass('text')} mb-4`}>
                Notable Projects
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {data.projects.map((project, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-bold text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-700 mt-2">{project.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-1 text-xs rounded-full ${getAccentColorClass('bg')} bg-opacity-10 ${getAccentColorClass('text')}`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 space-x-4">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-sm ${getAccentColorClass('text')} hover:underline`}
                        >
                          View Live
                        </a>
                      )}
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-sm ${getAccentColorClass('text')} hover:underline`}
                        >
                          Source Code
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
