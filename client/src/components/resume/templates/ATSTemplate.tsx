// client/src/components/resume/templates/ATSTemplate.tsx

import index from '@/pages/help/index';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import ATSTemplate from '@/components/resume/templates/ATSTemplate';
import React from 'react';
import { format } from 'date-fns';

// Using the same ResumeData interface structure as before
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

interface ATSTemplateProps {
  data: ResumeData;
  scale?: number;
  showGuides?: boolean;
}

const ATSTemplate: React.FC<ATSTemplateProps> = ({
  data,
  scale = 1,
  showGuides = false,
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM yyyy');
    } catch {
      return dateString;
    }
  };

  // Format skills for ATS readability
  const formatSkills = (skills: Array<{ name: string; proficiency: string }>) => {
    return skills.map(skill => skill.name).join(' • ');
  };

  return (
    <div 
      className={`
        w-[210mm] min-h-[297mm] bg-white mx-auto
        font-sans text-base leading-relaxed
        ${showGuides ? 'border border-gray-300' : ''}
      `}
      style={{ 
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        padding: '25mm 20mm',
      }}
    >
      {/* Header Section - Simple and clear for ATS */}
      <header className="mb-8 border-b border-gray-300 pb-4">
        <h1 className="text-2xl font-bold mb-2 text-black">
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <p className="text-lg font-semibold mb-3 text-black">
          {data.personalInfo.title}
        </p>
        <div className="text-base space-y-1">
          <p>{data.personalInfo.location}</p>
          <p>{data.personalInfo.phone}</p>
          <p>{data.personalInfo.email}</p>
          {data.personalInfo.linkedin && (
            <p>LinkedIn: {data.personalInfo.linkedin}</p>
          )}
          {data.personalInfo.github && (
            <p>GitHub: {data.personalInfo.github}</p>
          )}
        </div>
      </header>

      {/* Professional Summary - Clear and keyword-rich */}
      {data.personalInfo.summary && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-black uppercase">
            Professional Summary
          </h2>
          <p className="text-base text-black">
            {data.personalInfo.summary}
          </p>
        </section>
      )}

      {/* Skills Section - Organized by category */}
      {data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-black uppercase">
            Technical Skills
          </h2>
          {data.skills.map((category, index) => (
            <div key={index} className="mb-3">
              <h3 className="font-semibold text-black mb-1">
                {category.category}:
              </h3>
              <p className="text-base text-black">
                {formatSkills(category.skills)}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Professional Experience - Chronological format */}
      {data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-black uppercase">
            Professional Experience
          </h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="mb-2">
                <h3 className="font-bold text-black">
                  {exp.title}
                </h3>
                <p className="font-semibold">
                  {exp.company} | {exp.location}
                </p>
                <p className="text-black">
                  {formatDate(exp.startDate)} - {exp.isCurrentRole ? 'Present' : formatDate(exp.endDate)}
                </p>
              </div>
              <ul className="list-disc ml-4 space-y-1">
                {exp.responsibilities.map((resp, idx) => (
                  <li key={idx} className="text-black">
                    {resp}
                  </li>
                ))}
              </ul>
              {exp.achievements && exp.achievements.length > 0 && (
                <div className="mt-2">
                  <p className="font-semibold">Key Achievements:</p>
                  <ul className="list-disc ml-4 space-y-1">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx} className="text-black">
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {exp.technologies && exp.technologies.length > 0 && (
                <p className="mt-2 text-black">
                  <span className="font-semibold">Technologies Used:</span>{' '}
                  {exp.technologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education Section */}
      {data.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-black uppercase">
            Education
          </h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold text-black">
                {edu.degree} in {edu.fieldOfStudy}
              </h3>
              <p className="font-semibold">
                {edu.school} | {edu.location}
              </p>
              <p className="text-black">
                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
              </p>
              {edu.gpa && (
                <p className="text-black">GPA: {edu.gpa}</p>
              )}
              {edu.achievements && edu.achievements.length > 0 && (
                <ul className="list-disc ml-4 mt-2 space-y-1">
                  {edu.achievements.map((achievement, idx) => (
                    <li key={idx} className="text-black">
                      {achievement}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications Section */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-black uppercase">
            Professional Certifications
          </h2>
          {data.certifications.map((cert, index) => (
            <div key={index} className="mb-3">
              <h3 className="font-bold text-black">
                {cert.name}
              </h3>
              <p className="text-black">
                {cert.issuingOrganization}
              </p>
              <p className="text-black">
                Issued: {formatDate(cert.issueDate)}
                {cert.expiryDate && ` | Expires: ${formatDate(cert.expiryDate)}`}
              </p>
              {cert.credentialId && (
                <p className="text-black">
                  Credential ID: {cert.credentialId}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Projects Section */}
      {data.projects && data.projects.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3 text-black uppercase">
            Notable Projects
          </h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold text-black">
                {project.title}
              </h3>
              <p className="text-black mb-2">
                {project.description}
              </p>
              <p className="text-black">
                <span className="font-semibold">Technologies:</span>{' '}
                {project.technologies.join(', ')}
              </p>
              {(project.liveUrl || project.repoUrl) && (
                <p className="text-black">
                  {project.liveUrl && `Live URL: ${project.liveUrl}`}
                  {project.liveUrl && project.repoUrl && ' | '}
                  {project.repoUrl && `Repository: ${project.repoUrl}`}
                </p>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default ATSTemplate;
