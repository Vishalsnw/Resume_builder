// pages/profile/edit.tsx

import index from '@/pages/help/index';
import edit from '@/pages/profile/edit';
import upload from '@/pages/api/upload';
import [id] from '@/pages/resumes/edit/[id]';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import login from '@/pages/api/auth/login';
import 500 from '@/pages/500';
import Profile from '@/components/profile/Profile';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiGlobe, 
  FiBriefcase,
  FiMapPin,
  FiSave,
  FiX,
  FiUpload,
  FiTrash2,
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi';

interface ProfileFormData {
  fullName: string;
  displayName: string;
  email: string;
  phone: string;
  profession: string;
  company: string;
  location: string;
  website: string;
  bio: string;
  skills: string[];
  languages: Array<{
    name: string;
    level: 'basic' | 'intermediate' | 'fluent' | 'native';
  }>;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
  preferences: {
    emailNotifications: boolean;
    profileVisibility: 'public' | 'private' | 'contacts';
    twoFactorEnabled: boolean;
  };
}

const ProfileEditPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: '',
    displayName: '',
    email: '',
    phone: '',
    profession: '',
    company: '',
    location: '',
    website: '',
    bio: '',
    skills: [],
    languages: [],
    socialLinks: {},
    preferences: {
      emailNotifications: true,
      profileVisibility: 'public',
      twoFactorEnabled: false,
    },
  });

  // Form validation state
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/profile');
          const data = await response.json();
          setFormData(data);
          setAvatarPreview(data.avatarUrl);
        } catch (error) {
          toast.error('Failed to load profile data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [status]);

  // Handle unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProfileFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Valid email is required';
    }

    if (formData.website && !formData.website.match(/^https?:\/\/.+\..+$/)) {
      newErrors.website = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setHasUnsavedChanges(true);
  };

  const handleSkillsChange = (skills: string[]) => {
    setFormData(prev => ({
      ...prev,
      skills,
    }));
    setHasUnsavedChanges(true);
  };

  const handleLanguageChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.map((lang, i) => 
        i === index ? { ...lang, [field]: value } : lang
      ),
    }));
    setHasUnsavedChanges(true);
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handlePreferenceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: type === 'checkbox' ? checked : value,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setHasUnsavedChanges(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setSaving(true);

    try {
      // Upload avatar if changed
      let avatarUrl = formData.avatarUrl;
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        const uploadResponse = await fetch('/api/upload-avatar', {
          method: 'POST',
          body: formData,
        });
        const { url } = await uploadResponse.json();
        avatarUrl = url;
      }

      // Update profile
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          avatarUrl,
        }),
      });

      if (response.ok) {
        toast.success('Profile updated successfully');
        setHasUnsavedChanges(false);
        router.push('/profile');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        router.push('/profile');
      }
    } else {
      router.push('/profile');
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          <p className="mt-1 text-sm text-gray-600">
            Update your profile information and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-8">
          {/* Avatar Section */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <img
                  src={avatarPreview || '/default-avatar.png'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer">
                <FiUpload className="h-4 w-4" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Profile Photo</h3>
              <p className="text-sm text-gray-500">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.fullName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                Display Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Additional fields... */}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !hasUnsavedChanges}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                (saving || !hasUnsavedChanges) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Last updated info */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Last updated by Vishalsnw at 2025-06-07 20:19:15
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;
