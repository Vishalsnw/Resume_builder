// client/src/components/resume/builder/ExperienceForm.tsx

import index from '@/pages/help/index';
import [id] from '@/pages/resumes/edit/[id]';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import register from '@/pages/api/auth/register';
import 500 from '@/pages/500';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import ExperienceForm from '@/components/resume/builder/ExperienceForm';
import useForm from '@/hooks/useForm';
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ButtonSpinner } from '../../layout/LoadingSpinner';

// Validation schema
const experienceSchema = z.object({
  experiences: z.array(
    z.object({
      title: z.string().min(2, 'Job title is required'),
      company: z.string().min(2, 'Company name is required'),
      location: z.string().min(2, 'Location is required'),
      employmentType: z.enum([
        'FULL_TIME',
        'PART_TIME',
        'CONTRACT',
        'INTERNSHIP',
        'FREELANCE'
      ], {
        errorMap: () => ({ message: 'Please select employment type' })
      }),
      startDate: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Invalid date format (YYYY-MM)'),
      endDate: z.string()
        .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Invalid date format (YYYY-MM)')
        .or(z.literal('Present')),
      isCurrentRole: z.boolean().optional(),
      responsibilities: z.array(
        z.string().min(10, 'Responsibility must be at least 10 characters')
      ).min(1, 'Add at least one responsibility'),
      achievements: z.array(z.string()).optional(),
      technologies: z.array(z.string()).optional(),
    })
  ).min(1, 'At least one work experience is required'),
});

type ExperienceInputs = z.infer<typeof experienceSchema>;

interface ExperienceFormProps {
  onSubmit: (data: ExperienceInputs) => void;
  initialData?: ExperienceInputs;
  currentUser: string;
  currentDateTime: string;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  onSubmit,
  initialData = {
    experiences: [{
      title: '',
      company: '',
      location: '',
      employmentType: 'FULL_TIME',
      startDate: '',
      endDate: '',
      isCurrentRole: false,
      responsibilities: [''],
      achievements: [''],
      technologies: [''],
    }]
  },
  currentUser = 'Vishalsnw',
  currentDateTime = '2025-06-07 17:45:28'
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
  } = useForm<ExperienceInputs>({
    resolver: zodResolver(experienceSchema),
    defaultValues: initialData,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experiences',
  });

  // Auto-save functionality
  const watchedFields = watch();
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (isDirty) {
        localStorage.setItem('experienceInfo', JSON.stringify(watchedFields));
        toast.success('Progress auto-saved');
      }
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [watchedFields, isDirty]);

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem('experienceInfo');
    if (savedData) {
      reset(JSON.parse(savedData));
    }
  }, [reset]);

  const handleFormSubmit: SubmitHandler<ExperienceInputs> = async (data) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      toast.success('Work experience saved successfully');
    } catch (error) {
      toast.error('Failed to save work experience');
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle current role toggle
  const handleCurrentRoleToggle = (index: number, checked: boolean) => {
    if (checked) {
      setValue(`experiences.${index}.endDate`, 'Present');
    } else {
      setValue(`experiences.${index}.endDate`, '');
    }
    setValue(`experiences.${index}.isCurrentRole`, checked);
  };

  // Handle dynamic arrays (responsibilities, achievements, technologies)
  const handleArrayItemAdd = (index: number, field: 'responsibilities' | 'achievements' | 'technologies') => {
    const currentArray = watch(`experiences.${index}.${field}`) || [];
    setValue(`experiences.${index}.${field}`, [...currentArray, '']);
  };

  const handleArrayItemRemove = (
    expIndex: number,
    itemIndex: number,
    field: 'responsibilities' | 'achievements' | 'technologies'
  ) => {
    const currentArray = watch(`experiences.${expIndex}.${field}`) || [];
    setValue(
      `experiences.${expIndex}.${field}`,
      currentArray.filter((_, idx) => idx !== itemIndex)
    );
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="p-6 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Experience #{index + 1}
            </h3>
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <input
                type="text"
                {...register(`experiences.${index}.title`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Senior Software Engineer"
              />
              {errors.experiences?.[index]?.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.experiences[index]?.title?.message}
                </p>
              )}
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <input
                type="text"
                {...register(`experiences.${index}.company`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Google"
              />
              {errors.experiences?.[index]?.company && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.experiences[index]?.company?.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                {...register(`experiences.${index}.location`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Mountain View, CA"
              />
              {errors.experiences?.[index]?.location && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.experiences[index]?.location?.message}
                </p>
              )}
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employment Type
              </label>
              <select
                {...register(`experiences.${index}.employmentType`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="FREELANCE">Freelance</option>
              </select>
              {errors.experiences?.[index]?.employmentType && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.experiences[index]?.employmentType?.message}
                </p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="month"
                  {...register(`experiences.${index}.startDate`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.experiences?.[index]?.startDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.experiences[index]?.startDate?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="month"
                  {...register(`experiences.${index}.endDate`)}
                  disabled={watch(`experiences.${index}.isCurrentRole`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                />
                {errors.experiences?.[index]?.endDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.experiences[index]?.endDate?.message}
                  </p>
                )}
              </div>
            </div>

            {/* Current Role Checkbox */}
            <div className="col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={watch(`experiences.${index}.isCurrentRole`)}
                  onChange={(e) => handleCurrentRoleToggle(index, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  I currently work here
                </span>
              </label>
            </div>
          </div>

          {/* Responsibilities */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Responsibilities
            </label>
            {watch(`experiences.${index}.responsibilities`)?.map((_, respIndex) => (
              <div key={respIndex} className="flex mb-2">
                <input
                  type="text"
                  {...register(`experiences.${index}.responsibilities.${respIndex}`)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Describe your responsibility..."
                />
                <button
                  type="button"
                  onClick={() => handleArrayItemRemove(index, respIndex, 'responsibilities')}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleArrayItemAdd(index, 'responsibilities')}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Responsibility
            </button>
          </div>

          {/* Achievements */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Achievements (Optional)
            </label>
            {watch(`experiences.${index}.achievements`)?.map((_, achieveIndex) => (
              <div key={achieveIndex} className="flex mb-2">
                <input
                  type="text"
                  {...register(`experiences.${index}.achievements.${achieveIndex}`)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Describe your achievement..."
                />
                <button
                  type="button"
                  onClick={() => handleArrayItemRemove(index, achieveIndex, 'achievements')}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleArrayItemAdd(index, 'achievements')}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Achievement
            </button>
          </div>

          {/* Technologies */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technologies Used (Optional)
            </label>
            {watch(`experiences.${index}.technologies`)?.map((_, techIndex) => (
              <div key={techIndex} className="flex mb-2">
                <input
                  type="text"
                  {...register(`experiences.${index}.technologies.${techIndex}`)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., React, Node.js, Python..."
                />
                <button
                  type="button"
                  onClick={() => handleArrayItemRemove(index, techIndex, 'technologies')}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleArrayItemAdd(index, 'technologies')}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Technology
            </button>
          </div>
        </div>
      ))}

      {/* Add Experience Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => append({
            title: '',
            company: '',
            location: '',
            employmentType: 'FULL_TIME',
            startDate: '',
            endDate: '',
            isCurrentRole: false,
            responsibilities: [''],
            achievements: [''],
            technologies: [''],
          })}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Add Another Experience
        </button>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-gray-500">
          Last saved: {currentDateTime}
        </div>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => reset(initialData)}
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

export default ExperienceForm;
