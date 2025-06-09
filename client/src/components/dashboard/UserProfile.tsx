// client/src/components/profile/UserProfile.tsx

import index from '@/pages/help/index';
// REMOVED INVALID IMPORT
import dashboard from '@/pages/dashboard';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import UserProfile from '@/components/dashboard/UserProfile';
import React, { forwardRef, useState } from 'react';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiEdit2,
  FiCamera,
  FiLink,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiLock,
  FiCheckCircle,
  FiAlertCircle,
  FiUpload,
  FiTrash2
} from 'react-icons/fi';

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  joinDate: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  links?: {
    website?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  skills?: string[];
  experience?: {
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description?: string;
  }[];
  education?: {
    degree: string;
    school: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
  }[];
}

interface UserProfileProps {
  userData: UserProfileData;
  editable?: boolean;
  onSave?: (data: Partial<UserProfileData>) => Promise<void>;
  onAvatarUpload?: (file: File) => Promise<string>;
  loading?: boolean;
  className?: string;
  currentDateTime?: string;
  currentUser?: string;
}

const UserProfile = forwardRef<HTMLDivElement, UserProfileProps>(({
  userData,
  editable = false,
  onSave,
  onAvatarUpload,
  loading = false,
  className = '',
  currentDateTime = '2025-06-07 19:32:16',
  currentUser = 'Vishalsnw',
}, ref) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<UserProfileData>>(userData);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'experience' | 'education'>('overview');

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedData(userData);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: keyof UserProfileData, value: any) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      await onSave?.(editedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onAvatarUpload) {
      try {
        setAvatarLoading(true);
        const avatarUrl = await onAvatarUpload(file);
        handleInputChange('avatar', avatarUrl);
      } catch (error) {
        console.error('Error uploading avatar:', error);
      } finally {
        setAvatarLoading(false);
      }
    }
  };

  const renderProfileHeader = () => (
    <div className="relative">
      {/* Cover Photo */}
      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg" />

      {/* Avatar and Basic Info */}
      <div className="px-6 pb-6">
        <div className="relative -mt-16 flex items-end space-x-5">
          <div className="relative">
            <div className={`
              w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden
              ${avatarLoading ? 'animate-pulse' : ''}
            `}>
              {editedData.avatar ? (
                <img
                  src={editedData.avatar}
                  alt={editedData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <FiUser className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg cursor-pointer">
                <FiCamera className="w-5 h-5 text-gray-600" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-2xl font-bold"
                  />
                ) : (
                  <h1 className="text-2xl font-bold">{userData.name}</h1>
                )}
                <p className="text-gray-500">{userData.role}</p>
              </div>
              {editable && (
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        disabled={loading}
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleEditToggle}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEditToggle}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 border-t">
      <div className="flex items-center space-x-2">
        <FiMail className="w-5 h-5 text-gray-400" />
        {isEditing ? (
          <input
            type="email"
            value={editedData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="flex-1 border-b focus:border-blue-500"
          />
        ) : (
          <span>{userData.email}</span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <FiPhone className="w-5 h-5 text-gray-400" />
        {isEditing ? (
          <input
            type="tel"
            value={editedData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="flex-1 border-b focus:border-blue-500"
          />
        ) : (
          <span>{userData.phone}</span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <FiMapPin className="w-5 h-5 text-gray-400" />
        {isEditing ? (
          <input
            type="text"
            value={editedData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="flex-1 border-b focus:border-blue-500"
          />
        ) : (
          <span>{userData.location}</span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <FiCalendar className="w-5 h-5 text-gray-400" />
        <span>Joined {new Date(userData.joinDate).toLocaleDateString()}</span>
      </div>
    </div>
  );

  const renderSocialLinks = () => (
    <div className="flex space-x-4 p-6 border-t">
      {Object.entries(userData.links || {}).map(([platform, url]) => {
        const Icon = {
          website: FiLink,
          github: FiGithub,
          linkedin: FiLinkedin,
          twitter: FiTwitter,
        }[platform];

        return url && Icon ? (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600"
          >
            <Icon className="w-6 h-6" />
          </a>
        ) : null;
      })}
    </div>
  );

  const renderSkills = () => (
    <div className="p-6 border-t">
      <h2 className="text-lg font-semibold mb-4">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {userData.skills?.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 bg-gray-100 rounded-full text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="p-6 border-t">
      <h2 className="text-lg font-semibold mb-4">Experience</h2>
      <div className="space-y-4">
        {userData.experience?.map((exp, index) => (
          <div key={index} className="border-l-2 border-gray-200 pl-4">
            <div className="font-medium">{exp.title}</div>
            <div className="text-gray-600">{exp.company}</div>
            <div className="text-sm text-gray-500">
              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
            </div>
            {exp.description && (
              <p className="mt-2 text-gray-600">{exp.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="p-6 border-t">
      <h2 className="text-lg font-semibold mb-4">Education</h2>
      <div className="space-y-4">
        {userData.education?.map((edu, index) => (
          <div key={index} className="border-l-2 border-gray-200 pl-4">
            <div className="font-medium">{edu.degree}</div>
            <div className="text-gray-600">{edu.school}</div>
            <div className="text-sm text-gray-500">
              {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      ref={ref}
      className={`bg-white rounded-lg shadow ${className}`}
    >
      {renderProfileHeader()}
      
      {/* Navigation */}
      <div className="border-t border-b">
        <nav className="flex space-x-8 px-6">
          {['overview', 'experience', 'education'].map((section) => (
            <button
              key={section}
              className={`
                py-4 px-2 border-b-2 font-medium
                ${activeSection === section
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'}
              `}
              onClick={() => setActiveSection(section as any)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeSection === 'overview' && (
        <>
          {renderContactInfo()}
          {renderSocialLinks()}
          {renderSkills()}
        </>
      )}
      
      {activeSection === 'experience' && renderExperience()}
      {activeSection === 'education' && renderEducation()}

      {/* Metadata */}
      <div className="px-6 py-4 text-xs text-gray-500 border-t">
        Last modified by {currentUser} at {currentDateTime}
      </div>
    </div>
  );
});

UserProfile.displayName = 'UserProfile';

export default UserProfile;
