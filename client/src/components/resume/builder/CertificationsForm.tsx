// client/src/components/resume/builder/CertificationsForm.tsx

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ButtonSpinner } from '../../layout/LoadingSpinner';

// Validation schema
const certificationsSchema = z.object({
  certifications: z.array(
    z.object({
      name: z.string().min(2, 'Certification name is required'),
      issuingOrganization: z.string().min(2, 'Issuing organization is required'),
      credentialId: z.string().optional(),
      credentialURL: z.string().url().optional().or(z.literal('')),
      issueDate: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Invalid date format (YYYY-MM)'),
      expiryDate: z.string()
        .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Invalid date format (YYYY-MM)')
        .optional()
        .or(z.literal('')),
      noExpiry: z.boolean().optional(),
      description: z.string().optional(),
      skills: z.array(z.string()).optional(),
      category: z.enum([
        'TECHNICAL',
        'PROFESSIONAL',
        'ACADEMIC',
        'LANGUAGE',
        'OTHER'
      ]).default('TECHNICAL'),
    })
  ).min(1, 'At least one certification is required'),
});

type CertificationInputs = z.infer<typeof certificationsSchema>;

interface CertificationsFormProps {
  onSubmit: (data: CertificationInputs) => void;
  initialData?: CertificationInputs;
  currentUser: string;
  currentDateTime: string;
}

// Common certification providers for suggestions
const CERTIFICATION_PROVIDERS = [
  'AWS',
  'Microsoft',
  'Google',
  'Cisco',
  'CompTIA',
  'Oracle',
  'IBM',
  'PMI',
  'Salesforce',
  'Adobe',
];

const CertificationsForm: React.FC<CertificationsFormProps> = ({
  onSubmit,
  initialData = {
    certifications: [{
      name: '',
      issuingOrganization: '',
      credentialId: '',
      credentialURL: '',
      issueDate: '',
      expiryDate: '',
      noExpiry: false,
      description: '',
      skills: [''],
      category: 'TECHNICAL',
    }]
  },
  currentUser = 'Vishalsnw',
  currentDateTime = '2025-06-07 17:54:36'
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
  } = useForm<CertificationInputs>({
    resolver: zodResolver(certificationsSchema),
    defaultValues: initialData,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'certifications',
  });

  // Auto-save functionality
  const watchedFields = watch();
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (isDirty) {
        localStorage.setItem('certificationsInfo', JSON.stringify(watchedFields));
        toast.success('Progress auto-saved');
      }
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [watchedFields, isDirty]);

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem('certificationsInfo');
    if (savedData) {
      reset(JSON.parse(savedData));
    }
  }, [reset]);

  const handleFormSubmit: SubmitHandler<CertificationInputs> = async (data) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      toast.success('Certifications saved successfully');
    } catch (error) {
      toast.error('Failed to save certifications');
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoExpiryToggle = (index: number, checked: boolean) => {
    setValue(`certifications.${index}.noExpiry`, checked);
    if (checked) {
      setValue(`certifications.${index}.expiryDate`, '');
    }
  };

  const handleSkillAdd = (index: number) => {
    const skills = watch(`certifications.${index}.skills`) || [];
    setValue(`certifications.${index}.skills`, [...skills, '']);
  };

  const handleSkillRemove = (certIndex: number, skillIndex: number) => {
    const skills = watch(`certifications.${certIndex}.skills`) || [];
    setValue(
      `certifications.${certIndex}.skills`,
      skills.filter((_, idx) => idx !== skillIndex)
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
              Certification #{index + 1}
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
            {/* Certification Name */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Certification Name
              </label>
              <input
                type="text"
                {...register(`certifications.${index}.name`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., AWS Certified Solutions Architect"
              />
              {errors.certifications?.[index]?.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.certifications[index]?.name?.message}
                </p>
              )}
            </div>

            {/* Issuing Organization */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Issuing Organization
              </label>
              <input
                type="text"
                {...register(`certifications.${index}.issuingOrganization`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                list={`org-suggestions-${index}`}
                placeholder="e.g., Amazon Web Services"
              />
              <datalist id={`org-suggestions-${index}`}>
                {CERTIFICATION_PROVIDERS.map((provider) => (
                  <option key={provider} value={provider} />
                ))}
              </datalist>
              {errors.certifications?.[index]?.issuingOrganization && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.certifications[index]?.issuingOrganization?.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                {...register(`certifications.${index}.category`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="TECHNICAL">Technical</option>
                <option value="PROFESSIONAL">Professional</option>
                <option value="ACADEMIC">Academic</option>
                <option value="LANGUAGE">Language</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Credential ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Credential ID
              </label>
              <input
                type="text"
                {...register(`certifications.${index}.credentialId`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., ABC123XYZ"
              />
            </div>

            {/* Credential URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Credential URL
              </label>
              <input
                type="url"
                {...register(`certifications.${index}.credentialURL`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>

            {/* Issue Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Issue Date
              </label>
              <input
                type="month"
                {...register(`certifications.${index}.issueDate`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.certifications?.[index]?.issueDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.certifications[index]?.issueDate?.message}
                </p>
              )}
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="month"
                {...register(`certifications.${index}.expiryDate`)}
                disabled={watch(`certifications.${index}.noExpiry`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            {/* No Expiry Checkbox */}
            <div className="col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={watch(`certifications.${index}.noExpiry`)}
                  onChange={(e) => handleNoExpiryToggle(index, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  This certification does not expire
                </span>
              </label>
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description (Optional)
              </label>
              <textarea
                {...register(`certifications.${index}.description`)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe what you learned or achieved..."
              />
            </div>

            {/* Skills */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills Acquired (Optional)
              </label>
              {watch(`certifications.${index}.skills`)?.map((_, skillIndex) => (
                <div key={skillIndex} className="flex mb-2">
                  <input
                    type="text"
                    {...register(`certifications.${index}.skills.${skillIndex}`)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., Cloud Architecture"
                  />
                  <button
                    type="button"
                    onClick={() => handleSkillRemove(index, skillIndex)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleSkillAdd(index)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Skill
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add Certification Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => append({
            name: '',
            issuingOrganization: '',
            credentialId: '',
            credentialURL: '',
            issueDate: '',
            expiryDate: '',
            noExpiry: false,
            description: '',
            skills: [''],
            category: 'TECHNICAL',
          })}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Add Another Certification
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

export default CertificationsForm;
