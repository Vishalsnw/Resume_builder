// client/src/components/resume/builder/PersonalInfoForm.tsx

import 500 from '@/pages/500';
import [id] from '@/pages/resumes/edit/[id]';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import register from '@/pages/api/auth/register';
import upload from '@/pages/api/upload';
import Profile from '@/components/profile/Profile';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import useForm from '@/hooks/useForm';
import PersonalInfoForm from '@/components/resume/builder/PersonalInfoForm';
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

// Common components
import Input from '../../common/forms/Input';
import TextArea from '../../common/forms/TextArea';
import FileUpload from '../../common/forms/FileUpload';
import { ButtonSpinner } from '../../layout/LoadingSpinner';

// Form validation schema
const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number'),
  location: z.string().min(2, 'Location is required'),
  title: z.string().min(2, 'Professional title is required'),
  website: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  portfolio: z.string().url().optional().or(z.literal('')),
  summary: z.string().min(50, 'Professional summary must be at least 50 characters'),
});

type PersonalInfoInputs = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  onSubmit: (data: PersonalInfoInputs) => void;
  initialData?: Partial<PersonalInfoInputs>;
  currentUser?: string;
  currentDateTime?: string;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  onSubmit,
  initialData = {},
  currentUser = 'Vishalsnw',
  currentDateTime = '2025-06-07 17:41:05'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<PersonalInfoInputs>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      ...initialData,
    },
  });

  // Auto-save functionality
  const watchedFields = watch();
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (isDirty) {
        localStorage.setItem('personalInfo', JSON.stringify(watchedFields));
        toast.success('Progress auto-saved');
      }
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [watchedFields, isDirty]);

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem('personalInfo');
    if (savedData) {
      reset(JSON.parse(savedData));
    }
  }, [reset]);

  const handleFormSubmit: SubmitHandler<PersonalInfoInputs> = async (data) => {
    setIsLoading(true);
    try {
      // Handle profile image upload if exists
      if (profileImage) {
        const formData = new FormData();
        formData.append('profile', profileImage);
        // Implement your image upload logic here
      }

      await onSubmit(data);
      toast.success('Personal information saved successfully');
    } catch (error) {
      toast.error('Failed to save personal information');
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (file: File) => {
    setProfileImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Profile Image Upload */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile preview"
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-3xl text-gray-400">
                {initialData.firstName?.[0] || currentUser[0]}
              </span>
            </div>
          )}
        </div>
        <FileUpload
          accept="image/*"
          onChange={handleImageUpload}
          maxSize={5 * 1024 * 1024} // 5MB
          label="Upload profile picture"
        />
      </div>

      {/* Personal Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <Input
          label="Last Name"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Phone"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Input
          label="Location"
          error={errors.location?.message}
          {...register('location')}
        />
        <Input
          label="Professional Title"
          error={errors.title?.message}
          {...register('title')}
        />
      </div>

      {/* Online Presence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Website"
          type="url"
          error={errors.website?.message}
          {...register('website')}
        />
        <Input
          label="LinkedIn"
          type="url"
          error={errors.linkedin?.message}
          {...register('linkedin')}
        />
        <Input
          label="GitHub"
          type="url"
          error={errors.github?.message}
          {...register('github')}
        />
        <Input
          label="Portfolio"
          type="url"
          error={errors.portfolio?.message}
          {...register('portfolio')}
        />
      </div>

      {/* Professional Summary */}
      <TextArea
        label="Professional Summary"
        error={errors.summary?.message}
        {...register('summary')}
        rows={4}
      />

      {/* Form Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-gray-500">
          Last saved: {currentDateTime}
        </div>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            disabled={isLoading}
          >
            Reset
          </button>
          <button
            type="submit"
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ButtonSpinner />
                <span className="ml-2">Saving...</span>
              </>
            ) : (
              'Save & Continue'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PersonalInfoForm;
