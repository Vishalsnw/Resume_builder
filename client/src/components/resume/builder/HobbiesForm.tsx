// client/src/components/resume/builder/HobbiesForm.tsx

import index from '@/pages/help/index';
import [id] from '@/pages/resumes/edit/[id]';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import register from '@/pages/api/auth/register';
// REMOVED INVALID IMPORT
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import HobbiesForm from '@/components/resume/builder/HobbiesForm';
import useForm from '@/hooks/useForm';
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ButtonSpinner } from '../../layout/LoadingSpinner';

// Validation schema
const hobbiesSchema = z.object({
  hobbies: z.array(
    z.object({
      name: z.string().min(2, 'Hobby name is required'),
      category: z.enum([
        'SPORTS',
        'ARTS',
        'MUSIC',
        'TECHNOLOGY',
        'READING',
        'TRAVEL',
        'COOKING',
        'GAMING',
        'FITNESS',
        'OTHER'
      ], {
        errorMap: () => ({ message: 'Please select a category' })
      }),
      description: z.string().optional(),
      skillsGained: z.array(z.string()).optional(),
      achievements: z.array(z.string()).optional(),
      relevantLinks: z.array(
        z.object({
          title: z.string(),
          url: z.string().url('Invalid URL format'),
        })
      ).optional(),
      yearsOfExperience: z.string()
        .regex(/^\d*\.?\d*$/, 'Must be a number')
        .optional()
        .or(z.literal('')),
      isActive: z.boolean().optional(),
    })
  ).min(1, 'At least one hobby is required'),
});

type HobbiesInputs = z.infer<typeof hobbiesSchema>;

interface HobbiesFormProps {
  onSubmit: (data: HobbiesInputs) => void;
  initialData?: HobbiesInputs;
  currentUser: string;
  currentDateTime: string;
}

// Hobby suggestions by category
const HOBBY_SUGGESTIONS: { [key: string]: string[] } = {
  SPORTS: ['Basketball', 'Soccer', 'Tennis', 'Swimming', 'Rock Climbing'],
  ARTS: ['Painting', 'Photography', 'Sculpture', 'Drawing', 'Digital Art'],
  MUSIC: ['Piano', 'Guitar', 'Singing', 'Music Production', 'DJ-ing'],
  TECHNOLOGY: ['Programming', 'Robotics', '3D Printing', 'Arduino', 'AI/ML'],
  READING: ['Fiction', 'Non-fiction', 'Poetry', 'Technical Books', 'Blogs'],
  TRAVEL: ['Backpacking', 'Photography', 'Cultural Exchange', 'Food Tourism'],
  COOKING: ['Baking', 'International Cuisine', 'BBQ', 'Wine Tasting'],
  GAMING: ['eSports', 'Game Development', 'Board Games', 'VR Gaming'],
  FITNESS: ['Yoga', 'CrossFit', 'Running', 'Weightlifting', 'Martial Arts'],
  OTHER: ['Gardening', 'Volunteering', 'Teaching', 'Writing', 'Podcasting'],
};

const HobbiesForm: React.FC<HobbiesFormProps> = ({
  onSubmit,
  initialData = {
    hobbies: [{
      name: '',
      category: 'OTHER',
      description: '',
      skillsGained: [''],
      achievements: [''],
      relevantLinks: [{ title: '', url: '' }],
      yearsOfExperience: '',
      isActive: true,
    }]
  },
  currentUser = 'Vishalsnw',
  currentDateTime = '2025-06-07 17:57:30'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
  } = useForm<HobbiesInputs>({
    resolver: zodResolver(hobbiesSchema),
    defaultValues: initialData,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'hobbies',
  });

  // Auto-save functionality
  const watchedFields = watch();
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (isDirty) {
        localStorage.setItem('hobbiesInfo', JSON.stringify(watchedFields));
        toast.success('Progress auto-saved');
      }
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [watchedFields, isDirty]);

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem('hobbiesInfo');
    if (savedData) {
      reset(JSON.parse(savedData));
    }
  }, [reset]);

  const handleFormSubmit: SubmitHandler<HobbiesInputs> = async (data) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      toast.success('Hobbies saved successfully');
    } catch (error) {
      toast.error('Failed to save hobbies');
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (index: number, category: string) => {
    setValue(`hobbies.${index}.category`, category as any);
    setSuggestions(HOBBY_SUGGESTIONS[category] || []);
  };

  const handleLinkAdd = (index: number) => {
    const links = watch(`hobbies.${index}.relevantLinks`) || [];
    setValue(`hobbies.${index}.relevantLinks`, [...links, { title: '', url: '' }]);
  };

  const handleLinkRemove = (hobbyIndex: number, linkIndex: number) => {
    const links = watch(`hobbies.${hobbyIndex}.relevantLinks`) || [];
    setValue(
      `hobbies.${hobbyIndex}.relevantLinks`,
      links.filter((_, idx) => idx !== linkIndex)
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
              Hobby #{index + 1}
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
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => handleCategoryChange(index, e.target.value)}
                value={watch(`hobbies.${index}.category`)}
              >
                {Object.keys(HOBBY_SUGGESTIONS).map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0) + category.slice(1).toLowerCase().replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Hobby Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hobby Name
              </label>
              <input
                type="text"
                {...register(`hobbies.${index}.name`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                list={`hobby-suggestions-${index}`}
                placeholder="e.g., Photography"
              />
              <datalist id={`hobby-suggestions-${index}`}>
                {suggestions.map((suggestion) => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
              {errors.hobbies?.[index]?.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.hobbies[index]?.name?.message}
                </p>
              )}
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
                {...register(`hobbies.${index}.yearsOfExperience`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., 5"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center h-full">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register(`hobbies.${index}.isActive`)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  I currently practice this hobby
                </span>
              </label>
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register(`hobbies.${index}.description`)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe your involvement and passion for this hobby..."
              />
            </div>

            {/* Skills Gained */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Skills Gained (Optional)
              </label>
              {watch(`hobbies.${index}.skillsGained`)?.map((_, skillIndex) => (
                <div key={skillIndex} className="flex mb-2">
                  <input
                    type="text"
                    {...register(`hobbies.${index}.skillsGained.${skillIndex}`)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., Team Collaboration"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const skills = watch(`hobbies.${index}.skillsGained`) || [];
                      setValue(
                        `hobbies.${index}.skillsGained`,
                        skills.filter((_, idx) => idx !== skillIndex)
                      );
                    }}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const skills = watch(`hobbies.${index}.skillsGained`) || [];
                  setValue(`hobbies.${index}.skillsGained`, [...skills, '']);
                }}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Skill
              </button>
            </div>

            {/* Achievements */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Achievements (Optional)
              </label>
              {watch(`hobbies.${index}.achievements`)?.map((_, achieveIndex) => (
                <div key={achieveIndex} className="flex mb-2">
                  <input
                    type="text"
                    {...register(`hobbies.${index}.achievements.${achieveIndex}`)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., Won first place in local competition"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const achievements = watch(`hobbies.${index}.achievements`) || [];
                      setValue(
                        `hobbies.${index}.achievements`,
                        achievements.filter((_, idx) => idx !== achieveIndex)
                      );
                    }}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const achievements = watch(`hobbies.${index}.achievements`) || [];
                  setValue(`hobbies.${index}.achievements`, [...achievements, '']);
                }}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Achievement
              </button>
            </div>

            {/* Relevant Links */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Relevant Links (Optional)
              </label>
              {watch(`hobbies.${index}.relevantLinks`)?.map((_, linkIndex) => (
                <div key={linkIndex} className="grid grid-cols-3 gap-2 mb-2">
                  <div className="col-span-1">
                    <input
                      type="text"
                      {...register(`hobbies.${index}.relevantLinks.${linkIndex}.title`)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Link Title"
                    />
                  </div>
                  <div className="col-span-2 flex">
                    <input
                      type="url"
                      {...register(`hobbies.${index}.relevantLinks.${linkIndex}.url`)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="https://..."
                    />
                    <button
                      type="button"
                      onClick={() => handleLinkRemove(index, linkIndex)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleLinkAdd(index)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Link
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add Hobby Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => append({
            name: '',
            category: 'OTHER',
            description: '',
            skillsGained: [''],
            achievements: [''],
            relevantLinks: [{ title: '', url: '' }],
            yearsOfExperience: '',
            isActive: true,
          })}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Add Another Hobby
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

export default HobbiesForm;
