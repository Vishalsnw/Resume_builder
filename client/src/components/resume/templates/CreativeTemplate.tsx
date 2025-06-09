// client/src/components/resume/templates/CreativeTemplate.tsx

import CreativeTemplate from '@/components/resume/templates/CreativeTemplate';
import Profile from '@/components/profile/Profile';
import React from 'react';
import { format } from 'date-fns';

// Using the same ResumeData interface structure
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

interface CreativeTemplateProps {
  data: ResumeData;
  scale?: number;
  showGuides?: boolean;
  theme?: 'gradient' | 'minimal' | 'geometric' | 'wave';
}

const CreativeTemplate: React.FC<CreativeTemplateProps> = ({
  data,
  scale = 1,
  showGuides = false,
  theme = 'gradient',
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM yyyy');
    } catch {
      return dateString;
    }
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'gradient':
        return {
          header: 'bg-gradient-to-r from-purple-600 to-blue-500',
          accent: 'bg-blue-500',
          text: 'text-blue-600',
          border: 'border-blue-500',
        };
      case 'minimal':
        return {
          header: 'bg-gray-900',
          accent: 'bg-gray-800',
          text: 'text-gray-900',
          border: 'border-gray-900',
        };
      case 'geometric':
        return {
          header: 'bg-emerald-600',
          accent: 'bg-emerald-500',
          text: 'text-emerald-600',
          border: 'border-emerald-500',
        };
      case 'wave':
        return {
          header: 'bg-violet-600',
          accent: 'bg-violet-500',
          text: 'text-violet-600',
          border: 'border-violet-500',
        };
      default:
        return {
          header: 'bg-gradient-to-r from-purple-600 to-blue-500',
          accent: 'bg-blue-500',
          text: 'text-blue-600',
          border: 'border-blue-500',
        };
    }
  };

  const themeStyles = getThemeStyles();

  const getSkillSize = (proficiency: string) => {
    switch (proficiency) {
      case 'EXPERT': return 'text-lg font-bold';
      case 'ADVANCED': return 'text-base font-semibold';
      case 'INTERMEDIATE': return 'text-sm font-medium';
      case 'BEGINNER': return 'text-xs';
      default: return 'text-sm';
    }
  };

  return (
    <div 
      className={`
        w-[210mm] min-h-[297mm] bg-white shadow-lg mx-auto overflow-hidden
        ${showGuides ? 'border border-gray-300' : ''}
      `}
      style={{ 
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }}
    >
      {/* Creative Header with Background Pattern */}
      <div className={`relative ${themeStyles.header} text-white px-8 py-12`}>
        {theme === 'geometric' && (
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute transform rotate-45 border border-white"
                style={{
                  width: '50px',
                  height: '50px',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        )}
        {theme === 'wave' && (
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0 60L48 65C96 70 192 80 288 75C384 70 480 50 576 45C672 40 768 50 864 55C960 60 1056 60 1152 55C1248 50 1344 40 1392 35L1440 30V120H0V60Z"
                fill="white"
                fillOpacity="0.1"
              />
            </svg>
          </div>
        )}

        <div className="relative flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight">
              {data.personalInfo.firstName}
              <span className="font-light"> {data.personalInfo.lastName}</span>
            </h1>
            <p className="mt-3 text-2xl font-light">
              {data.personalInfo.title}
            </p>
            
            <div className="mt-6 flex flex-wrap gap-4">
              {data.personalInfo.email && (
                <a href={`mailto:${data.personalInfo.email}`} 
                   className="flex items-center space-x-2 text-sm hover:opacity-75 transition-opacity">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>{data.personalInfo.email}</span>
                </a>
              )}
              {data.personalInfo.phone && (
                <span className="flex items-center space-x-2 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>{data.personalInfo.phone}</span>
                </span>
              )}
              {data.personalInfo.location && (
                <span className="flex items-center space-x-2 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{data.personalInfo.location}</span>
                </span>
              )}
            </div>
          </div>

          {data.personalInfo.profileImage && (
            <div className="relative">
              <div className={`w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl`}>
                <img
                  src={data.personalInfo.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                <div className={`w-6 h-6 rounded-full ${themeStyles.accent}`} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 p-8">
        {/* Left Column */}
        <div className="col-span-5 space-y-8">
          {/* Professional Summary */}
          <section>
            <h2 className={`text-xl font-bold ${themeStyles.text} mb-4`}>
              About Me
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {data.personalInfo.summary}
            </p>
          </section>

          {/* Skills Section */}
          {data.skills.length > 0 && (
            <section>
              <h2 className={`text-xl font-bold ${themeStyles.text} mb-4`}>
                Expertise
              </h2>
              <div className="space-y-6">
                {data.skills.map((category, index) => (
                  <div key={index}>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      {category.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className={`
                            px-3 py-1 rounded-full border
                            ${getSkillSize(skill.proficiency)}
                            ${themeStyles.border} border-opacity-20
                            ${themeStyles.text} text-opacity-90
                          `}
                        >
                          {skill.name}
                        </span>
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
              <h2 className={`text-xl font-bold ${themeStyles.text} mb-4`}>
                Education
              </h2>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div 
                    key={index} 
                    className={`
                      relative pl-6 pb-6
                      before:absolute before:left-0 before:top-0 before:bottom-0
                      before:w-px ${themeStyles.accent} before:opacity-20
                      after:absolute after:left-[-3px] after:top-2
                      after:w-2 after:h-2 after:rounded-full ${themeStyles.accent}
                    `}
                  >
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-sm text-gray-600">{edu.school}</p>
                    <p className="text-xs text-gray-500 mt-1">
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
              <h2 className={`text-xl font-bold ${themeStyles.text} mb-4`}>
                Certifications
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {data.certifications.map((cert, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg border border-opacity-20 hover:border-opacity-40 transition-colors"
                  >
                    <h3 className="font-bold text-gray-900">{cert.name}</h3>
                    <p className="text-sm text-gray-600">{cert.issuingOrganization}</p>
                    <p className="text-xs text-gray-500 mt-1">
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
        <div className="col-span-7 space-y-8">
          {/* Experience Section */}
          {data.experience.length > 0 && (
            <section>
              <h2 className={`text-xl font-bold ${themeStyles.text} mb-6`}>
                Professional Journey
              </h2>
              <div className="space-y-8">
                {data.experience.map((exp, index) => (
                  <div
                    key={index}
                    className={`
                      relative pl-6
                      before:absolute before:left-0 before:top-0 before:bottom-0
                      before:w-px ${themeStyles.accent} before:opacity-20
                    `}
                  >
                    <div className={`
                      absolute left-[-5px] top-0 w-3 h-3 rounded-full 
                      ${themeStyles.accent} z-10
                    `} />
                    <div className="mb-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900">{exp.title}</h3>
                          <p className="text-sm text-gray-600">
                            {exp.company} • {exp.location}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDate(exp.startDate)} - {exp.isCurrentRole ? 'Present' : formatDate(exp.endDate)}
                        </p>
                      </div>
                      <ul className="mt-3 space-y-2">
                        {exp.responsibilities.map((resp, idx) => (
                          <li key={idx} className="text-gray-700 text-sm flex items-start">
                            <span className={`mr-2 mt-1.5 w-1.5 h-1.5 rounded-full ${themeStyles.accent} flex-shrink-0`} />
                            {resp}
                          </li>
                        ))}
                      </ul>
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {exp.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className={`
                                px-2 py-1 text-xs rounded-full
                                ${themeStyles.border} border
                                ${themeStyles.text}
                                border-opacity-20
                              `}
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
              <h2 className={`text-xl font-bold ${themeStyles.text} mb-6`}>
                Featured Projects
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {data.projects.map((project, index) => (
                  <div
                    key={index}
                    className={`
                      p-4 rounded-lg border border-opacity-20
                      hover:border-opacity-40 transition-all
                      hover:shadow-md
                    `}
                  >
                    <h3 className="font-bold text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-700 mt-2">{project.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className={`
                            px-2 py-1 text-xs rounded-full
                            ${themeStyles.border} border
                            ${themeStyles.text}
                            border-opacity-20
                          `}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex space-x-4">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-sm ${themeStyles.text} hover:underline`}
                        >
                          View Live →
                        </a>
                      )}
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-sm ${themeStyles.text} hover:underline`}
                        >
                          Source Code →
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

export default CreativeTemplate;
