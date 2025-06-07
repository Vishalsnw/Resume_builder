// client/src/components/resume/builder/EducationForm.tsx

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ButtonSpinner } from '../../layout/LoadingSpinner';

// Validation schema
const educationSchema = z.object({
  education: z.array(
    z.object({
      degree: z.string().min(2, 'Degree is required'),
      school: z.string().min(2, 'School/University is required'),
      location: z.string().min(2, 'Location is required'),
      fieldOfStudy: z.string().min(2, 'Field of study is required'),
      startDate: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Invalid date format (YYYY-MM)'),
      endDate: z.string()
        .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Invalid date format (YYYY-MM)')
        .or(z.literal('Present')),
      gpa: z.string()
        .regex(/^\d*\.?\d*$/, 'Invalid GPA format')
        .optional()
        .or(z.literal('')),
      achievements: z.array(z.string()).optional(),
      description: z.string().optional(),
    })
  ).min(1, 'At least one education entry is required'),
});

type EducationInputs = z.infer<typeof educationSchema>;

interface EducationFormProps {
  onSubmit: (data: EducationInputs) => void;
  initialData?: EducationInputs;
  currentUser?: string;
  currentDateTime?: string;
}

const EducationForm: React.FC<EducationFormProps> = ({
  onSubmit,
  initialData = { education: [{ 
    degree: '', 
    school: '', 
    location: '', 
    fieldOfStudy: '', 
    startDate: '', 
    endDate: '', 
    gpa: '',
    achievements: [''],
    description: '' 
  }] },
  currentUser = 'Vishalsnw',
  currentDateTime = '2025-06-07 17:43:15'
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<EducationInputs>({
    resolver: zodResolver(educationSchema),
    defaultValues: initialData,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

  // Auto-save functionality
  const watchedFields = watch();
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (isDirty) {
        localStorage.setItem('educationInfo', JSON.stringify(watchedFields));
        toast.success('Progress auto-saved');
      }
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [watchedFields, isDirty]);

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem('educationInfo');
    if (savedData) {
      reset(JSON.parse(savedData));
    }
  }, [reset]);

  const handleFormSubmit: SubmitHandler<EducationInputs> = async (data) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      toast.success('Education information saved successfully');
    } catch (error) {
      toast.error('Failed to save education information');
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
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
              Education #{index + 1}
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
            {/* Degree */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Degree
              </label>
              <input
                type="text"
                {...register(`education.${index}.degree`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Bachelor of Science"
              />
              {errors.education?.[index]?.degree && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.education[index]?.degree?.message}
                </p>
              )}
            </div>

            {/* School */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                School/University
              </label>
              <input
                type="text"
                {...register(`education.${index}.school`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Harvard University"
              />
              {errors.education?.[index]?.school && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.education[index]?.school?.message}
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
                {...register(`education.${index}.location`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Cambridge, MA"
              />
              {errors.education?.[index]?.location && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.education[index]?.location?.message}
                </p>
              )}
            </div>

            {/* Field of Study */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Field of Study
              </label>
              <input
                type="text"
                {...register(`education.${index}.fieldOfStudy`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Computer Science"
              />
              {errors.education?.[index]?.fieldOfStudy && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.education[index]?.fieldOfStudy?.message}
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
                  {...register(`education.${index}.startDate`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.education?.[index]?.startDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.education[index]?.startDate?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="month"
                  {...register(`education.${index}.endDate`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.education?.[index]?.endDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.education[index]?.endDate?.message}
                  </p>
                )}
              </div>
            </div>

            {/* GPA */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                GPA (Optional)
              </label>
              <input
                type="text"
                {...register(`education.${index}.gpa`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., 3.8"
              />
              {errors.education?.[index]?.gpa && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.education[index]?.gpa?.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              {...register(`education.${index}.description`)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add any relevant details about your education..."
            />
          </div>
        </div>
      ))}

      {/* Add Education Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => append({
            degree: '',
            school: '',
            location: '',
            fieldOfStudy: '',
            startDate: '',
            endDate: '',
            gpa: '',
            achievements: [''],
            description: ''
          })}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Add Another Education
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

export default EducationForm;
