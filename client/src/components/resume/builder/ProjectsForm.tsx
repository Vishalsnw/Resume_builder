// client/src/components/resume/builder/ProjectsForm.tsx

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ButtonSpinner } from '../../layout/LoadingSpinner';

// Validation schema
const projectSchema = z.object({
  projects: z.array(
    z.object({
      title: z.string().min(2, 'Project title is required'),
      description: z.string().min(10, 'Project description must be at least 10 characters'),
      role: z.string().min(2, 'Your role is required'),
      startDate: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Invalid date format (YYYY-MM)'),
      endDate: z.string()
        .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Invalid date format (YYYY-MM)')
        .or(z.literal('Present')),
      isOngoing: z.boolean().optional(),
      technologies: z.array(z.string()).min(1, 'At least one technology is required'),
      liveUrl: z.string().url().optional().or(z.literal('')),
      repoUrl: z.string().url().optional().or(z.literal('')),
      highlights: z.array(
        z.string().min(10, 'Highlight must be at least 10 characters')
      ).min(1, 'At least one project highlight is required'),
      teamSize: z.string()
        .regex(/^\d+$/, 'Must be a number')
        .optional()
        .or(z.literal('')),
      impact: z.string().optional(),
    })
  ).min(1, 'At least one project is required'),
});

type ProjectInputs = z.infer<typeof projectSchema>;

interface ProjectsFormProps {
  onSubmit: (data: ProjectInputs) => void;
  initialData?: ProjectInputs;
  currentUser: string;
  currentDateTime: string;
}

const TECHNOLOGY_SUGGESTIONS = [
  'React', 'Node.js', 'TypeScript', 'Python', 'Django',
  'AWS', 'Docker', 'MongoDB', 'PostgreSQL', 'Firebase',
  'Next.js', 'Express', 'GraphQL', 'Redux', 'TailwindCSS'
];

const ProjectsForm: React.FC<ProjectsFormProps> = ({
  onSubmit,
  initialData = {
    projects: [{
      title: '',
      description: '',
      role: '',
      startDate: '',
      endDate: '',
      isOngoing: false,
      technologies: [''],
      liveUrl: '',
      repoUrl: '',
      highlights: [''],
      teamSize: '',
      impact: '',
    }]
  },
  currentUser = 'Vishalsnw',
  currentDateTime = '2025-06-07 17:50:53'
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
  } = useForm<ProjectInputs>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'projects',
  });

  // Auto-save functionality
  const watchedFields = watch();
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (isDirty) {
        localStorage.setItem('projectsInfo', JSON.stringify(watchedFields));
        toast.success('Progress auto-saved');
      }
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [watchedFields, isDirty]);

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem('projectsInfo');
    if (savedData) {
      reset(JSON.parse(savedData));
    }
  }, [reset]);

  const handleFormSubmit: SubmitHandler<ProjectInputs> = async (data) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      toast.success('Projects saved successfully');
    } catch (error) {
      toast.error('Failed to save projects');
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTechnologyAdd = (index: number) => {
    const technologies = watch(`projects.${index}.technologies`) || [];
    setValue(`projects.${index}.technologies`, [...technologies, '']);
  };

  const handleTechnologyRemove = (projectIndex: number, techIndex: number) => {
    const technologies = watch(`projects.${projectIndex}.technologies`) || [];
    setValue(
      `projects.${projectIndex}.technologies`,
      technologies.filter((_, idx) => idx !== techIndex)
    );
  };

  const handleHighlightAdd = (index: number) => {
    const highlights = watch(`projects.${index}.highlights`) || [];
    setValue(`projects.${index}.highlights`, [...highlights, '']);
  };

  const handleHighlightRemove = (projectIndex: number, highlightIndex: number) => {
    const highlights = watch(`projects.${projectIndex}.highlights`) || [];
    setValue(
      `projects.${projectIndex}.highlights`,
      highlights.filter((_, idx) => idx !== highlightIndex)
    );
  };

  const handleOngoingToggle = (index: number, checked: boolean) => {
    setValue(`projects.${index}.isOngoing`, checked);
    if (checked) {
      setValue(`projects.${index}.endDate`, 'Present');
    } else {
      setValue(`projects.${index}.endDate`, '');
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
              Project #{index + 1}
            </h3>
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove Project
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Title */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Project Title
              </label>
              <input
                type="text"
                {...register(`projects.${index}.title`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., E-commerce Platform"
              />
              {errors.projects?.[index]?.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.projects[index]?.title?.message}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Your Role
              </label>
              <input
                type="text"
                {...register(`projects.${index}.role`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Lead Developer"
              />
              {errors.projects?.[index]?.role && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.projects[index]?.role?.message}
                </p>
              )}
            </div>

            {/* Team Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Team Size
              </label>
              <input
                type="number"
                min="1"
                {...register(`projects.${index}.teamSize`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., 5"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="month"
                  {...register(`projects.${index}.startDate`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.projects?.[index]?.startDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.projects[index]?.startDate?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="month"
                  {...register(`projects.${index}.endDate`)}
                  disabled={watch(`projects.${index}.isOngoing`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                />
                {errors.projects?.[index]?.endDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.projects[index]?.endDate?.message}
                  </p>
                )}
              </div>
            </div>

            {/* Ongoing Project Checkbox */}
            <div className="col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={watch(`projects.${index}.isOngoing`)}
                  onChange={(e) => handleOngoingToggle(index, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  This is an ongoing project
                </span>
              </label>
            </div>

            {/* URLs */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Live URL
              </label>
              <input
                type="url"
                {...register(`projects.${index}.liveUrl`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Repository URL
              </label>
              <input
                type="url"
                {...register(`projects.${index}.repoUrl`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://github.com/..."
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Project Description
              </label>
              <textarea
                {...register(`projects.${index}.description`)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe the project and its objectives..."
              />
              {errors.projects?.[index]?.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.projects[index]?.description?.message}
                </p>
              )}
            </div>

            {/* Technologies */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies Used
              </label>
              {watch(`projects.${index}.technologies`)?.map((_, techIndex) => (
                <div key={techIndex} className="flex mb-2">
                  <input
                    type="text"
                    {...register(`projects.${index}.technologies.${techIndex}`)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., React"
                    list={`tech-suggestions-${index}-${techIndex}`}
                  />
                  <datalist id={`tech-suggestions-${index}-${techIndex}`}>
                    {TECHNOLOGY_SUGGESTIONS.map((tech) => (
                      <option key={tech} value={tech} />
                    ))}
                  </datalist>
                  <button
                    type="button"
                    onClick={() => handleTechnologyRemove(index, techIndex)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleTechnologyAdd(index)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Technology
              </button>
            </div>

            {/* Project Highlights */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Highlights
              </label>
              {watch(`projects.${index}.highlights`)?.map((_, highlightIndex) => (
                <div key={highlightIndex} className="flex mb-2">
                  <textarea
                    {...register(`projects.${index}.highlights.${highlightIndex}`)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={2}
                    placeholder="Describe a key achievement or feature..."
                  />
                  <button
                    type="button"
                    onClick={() => handleHighlightRemove(index, highlightIndex)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleHighlightAdd(index)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Highlight
              </button>
            </div>

            {/* Impact */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Project Impact (Optional)
              </label>
              <textarea
                {...register(`projects.${index}.impact`)}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe the project's impact, metrics, or results..."
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add Project Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => append({
            title: '',
            description: '',
            role: '',
            startDate: '',
            endDate: '',
            isOngoing: false,
            technologies: [''],
            liveUrl: '',
            repoUrl: '',
            highlights: [''],
            teamSize: '',
            impact: '',
          })}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Add Another Project
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

export default ProjectsForm;
