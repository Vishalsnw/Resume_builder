// client/src/components/resume/builder/SkillsForm.tsx

import index from '@/pages/help/index';
import [id] from '@/pages/resumes/edit/[id]';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import register from '@/pages/api/auth/register';
// REMOVED INVALID IMPORT
import Select from '@/components/common/forms/Select';
import SkillsForm from '@/components/resume/builder/SkillsForm';
import useForm from '@/hooks/useForm';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ButtonSpinner } from '../../layout/LoadingSpinner';

// Validation schema
const skillsSchema = z.object({
  skillCategories: z.array(
    z.object({
      name: z.string().min(2, 'Category name is required'),
      skills: z.array(
        z.object({
          name: z.string().min(2, 'Skill name is required'),
          proficiency: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'], {
            errorMap: () => ({ message: 'Please select proficiency level' })
          }),
          yearsOfExperience: z.string()
            .regex(/^\d*\.?\d*$/, 'Must be a number')
            .optional()
            .or(z.literal('')),
          keywords: z.array(z.string()).optional(),
        })
      ).min(1, 'At least one skill is required'),
    })
  ).min(1, 'At least one category is required'),
});

type SkillsInputs = z.infer<typeof skillsSchema>;

interface SkillsFormProps {
  onSubmit: (data: SkillsInputs) => void;
  initialData?: SkillsInputs;
  currentUser: string;
  currentDateTime: string;
}

// Predefined skill categories and suggestions
const SKILL_CATEGORIES = [
  'Programming Languages',
  'Frameworks & Libraries',
  'Databases',
  'Cloud Services',
  'Development Tools',
  'Soft Skills',
];

const SKILL_SUGGESTIONS: { [key: string]: string[] } = {
  'Programming Languages': ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++'],
  'Frameworks & Libraries': ['React', 'Angular', 'Vue.js', 'Node.js', 'Express'],
  'Databases': ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase'],
  'Cloud Services': ['AWS', 'Azure', 'Google Cloud', 'Heroku', 'DigitalOcean'],
  'Development Tools': ['Git', 'Docker', 'Kubernetes', 'Jenkins', 'JIRA'],
  'Soft Skills': ['Communication', 'Leadership', 'Problem Solving', 'Teamwork'],
};

const SkillsForm: React.FC<SkillsFormProps> = ({
  onSubmit,
  initialData = {
    skillCategories: [{
      name: 'Programming Languages',
      skills: [{
        name: '',
        proficiency: 'INTERMEDIATE',
        yearsOfExperience: '',
        keywords: [''],
      }],
    }],
  },
  currentUser = 'Vishalsnw',
  currentDateTime = '2025-06-07 17:48:28'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
  } = useForm<SkillsInputs>({
    resolver: zodResolver(skillsSchema),
    defaultValues: initialData,
  });

  const { fields: categoryFields, append: appendCategory, remove: removeCategory } = useFieldArray({
    control,
    name: 'skillCategories',
  });

  // Auto-save functionality
  const watchedFields = watch();
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (isDirty) {
        localStorage.setItem('skillsInfo', JSON.stringify(watchedFields));
        toast.success('Progress auto-saved');
      }
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [watchedFields, isDirty]);

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem('skillsInfo');
    if (savedData) {
      reset(JSON.parse(savedData));
    }
  }, [reset]);

  const handleFormSubmit: SubmitHandler<SkillsInputs> = async (data) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      toast.success('Skills saved successfully');
    } catch (error) {
      toast.error('Failed to save skills');
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (index: number, value: string) => {
    setValue(`skillCategories.${index}.name`, value);
    setSelectedCategory(value);
    setSuggestions(SKILL_SUGGESTIONS[value] || []);
  };

  const handleSkillAdd = (categoryIndex: number) => {
    const skills = watch(`skillCategories.${categoryIndex}.skills`) || [];
    setValue(`skillCategories.${categoryIndex}.skills`, [
      ...skills,
      {
        name: '',
        proficiency: 'INTERMEDIATE',
        yearsOfExperience: '',
        keywords: [''],
      }
    ]);
  };

  const handleSkillRemove = (categoryIndex: number, skillIndex: number) => {
    const skills = watch(`skillCategories.${categoryIndex}.skills`) || [];
    setValue(
      `skillCategories.${categoryIndex}.skills`,
      skills.filter((_, idx) => idx !== skillIndex)
    );
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {categoryFields.map((categoryField, categoryIndex) => (
        <div
          key={categoryField.id}
          className="p-6 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="w-full max-w-xs">
              <label className="block text-sm font-medium text-gray-700">
                Skill Category
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => handleCategoryChange(categoryIndex, e.target.value)}
                value={watch(`skillCategories.${categoryIndex}.name`)}
              >
                <option value="">Select a category</option>
                {SKILL_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.skillCategories?.[categoryIndex]?.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.skillCategories[categoryIndex]?.name?.message}
                </p>
              )}
            </div>
            {categoryFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeCategory(categoryIndex)}
                className="text-red-600 hover:text-red-800"
              >
                Remove Category
              </button>
            )}
          </div>

          {/* Skills List */}
          <div className="space-y-4">
            {watch(`skillCategories.${categoryIndex}.skills`)?.map((_, skillIndex) => (
              <div key={skillIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md">
                {/* Skill Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    {...register(`skillCategories.${categoryIndex}.skills.${skillIndex}.name`)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    list={`suggestions-${categoryIndex}-${skillIndex}`}
                  />
                  <datalist id={`suggestions-${categoryIndex}-${skillIndex}`}>
                    {suggestions.map((suggestion) => (
                      <option key={suggestion} value={suggestion} />
                    ))}
                  </datalist>
                  {errors.skillCategories?.[categoryIndex]?.skills?.[skillIndex]?.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.skillCategories[categoryIndex]?.skills?.[skillIndex]?.name?.message}
                    </p>
                  )}
                </div>

                {/* Proficiency Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Proficiency Level
                  </label>
                  <select
                    {...register(`skillCategories.${categoryIndex}.skills.${skillIndex}.proficiency`)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                </div>

                {/* Years of Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    {...register(`skillCategories.${categoryIndex}.skills.${skillIndex}.yearsOfExperience`)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Remove Skill Button */}
                <div className="md:col-span-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSkillRemove(categoryIndex, skillIndex)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove Skill
                  </button>
                </div>
              </div>
            ))}

            {/* Add Skill Button */}
            <button
              type="button"
              onClick={() => handleSkillAdd(categoryIndex)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Skill
            </button>
          </div>
        </div>
      ))}

      {/* Add Category Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => appendCategory({
            name: '',
            skills: [{
              name: '',
              proficiency: 'INTERMEDIATE',
              yearsOfExperience: '',
              keywords: [''],
            }],
          })}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Add Another Category
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

export default SkillsForm;
