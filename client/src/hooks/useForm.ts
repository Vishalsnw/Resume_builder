// hooks/useForm.ts

import { useState, useCallback, useEffect } from 'react';
import { z } from 'zod';
import { debounce } from 'lodash';

interface FormOptions<T> {
  initialValues: T;
  validationSchema?: z.ZodSchema<T>;
  onSubmit?: (values: T) => Promise<void>;
  autoSave?: boolean;
  autoSaveDelay?: number;
  transformBeforeSubmit?: (values: T) => any;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  isSaving: boolean;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  autoSave = false,
  autoSaveDelay = 2000,
  transformBeforeSubmit,
  validateOnChange = true,
  validateOnBlur = true,
}: FormOptions<T>) {
  // Form state
  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: true,
    isDirty: false,
    isSaving: false,
  });

  // Track last saved values for dirty state
  const [lastSavedValues, setLastSavedValues] = useState(initialValues);

  // Validation function
  const validateForm = useCallback((values: T): Partial<Record<keyof T, string>> => {
    if (!validationSchema) return {};

    try {
      validationSchema.parse(values);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors.reduce((acc, curr) => {
          const path = curr.path[0] as keyof T;
          acc[path] = curr.message;
          return acc;
        }, {} as Partial<Record<keyof T, string>>);
      }
      return {};
    }
  }, [validationSchema]);

  // Auto-save function
  const autoSaveForm = useCallback(
    debounce(async (values: T) => {
      if (!onSubmit || !formState.isDirty) return;

      try {
        setFormState(prev => ({ ...prev, isSaving: true }));
        await onSubmit(transformBeforeSubmit ? transformBeforeSubmit(values) : values);
        setLastSavedValues(values);
        
        // Log auto-save activity
        await fetch('/api/activity-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'FORM_AUTO_SAVE',
            description: 'Form auto-saved',
            metadata: { formValues: values },
            createdBy: 'Vishalsnw',
            timestamp: '2025-06-08 07:01:52',
          }),
        });

      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setFormState(prev => ({ ...prev, isSaving: false }));
      }
    }, autoSaveDelay),
    [onSubmit, transformBeforeSubmit, formState.isDirty]
  );

  // Handle field change
  const handleChange = useCallback((
    name: keyof T,
    value: any,
    shouldValidate: boolean = validateOnChange
  ) => {
    setFormState(prev => {
      const newValues = { ...prev.values, [name]: value };
      const errors = shouldValidate ? validateForm(newValues) : prev.errors;
      const isDirty = JSON.stringify(newValues) !== JSON.stringify(lastSavedValues);

      return {
        ...prev,
        values: newValues,
        errors,
        touched: { ...prev.touched, [name]: true },
        isValid: Object.keys(errors).length === 0,
        isDirty,
      };
    });
  }, [validateForm, validateOnChange, lastSavedValues]);

  // Handle field blur
  const handleBlur = useCallback((name: keyof T) => {
    if (validateOnBlur) {
      setFormState(prev => {
        const errors = validateForm(prev.values);
        return {
          ...prev,
          errors,
          touched: { ...prev.touched, [name]: true },
          isValid: Object.keys(errors).length === 0,
        };
      });
    }
  }, [validateForm, validateOnBlur]);

  // Handle form submission
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setFormState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const errors = validateForm(formState.values);
      if (Object.keys(errors).length > 0) {
        setFormState(prev => ({
          ...prev,
          errors,
          isValid: false,
          isSubmitting: false,
        }));
        return;
      }

      if (onSubmit) {
        const valuesToSubmit = transformBeforeSubmit 
          ? transformBeforeSubmit(formState.values)
          : formState.values;

        await onSubmit(valuesToSubmit);
        setLastSavedValues(formState.values);

        // Log form submission
        await fetch('/api/activity-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'FORM_SUBMIT',
            description: 'Form submitted successfully',
            metadata: { formValues: formState.values },
            createdBy: 'Vishalsnw',
            timestamp: '2025-06-08 07:01:52',
          }),
        });
      }
    } catch (error) {
      console.error('Form submission failed:', error);
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          submit: 'Form submission failed',
        },
      }));
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [formState.values, validateForm, onSubmit, transformBeforeSubmit]);

  // Reset form
  const resetForm = useCallback((newValues: T = initialValues) => {
    setFormState({
      values: newValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: true,
      isDirty: false,
      isSaving: false,
    });
    setLastSavedValues(newValues);
  }, [initialValues]);

  // Auto-save effect
  useEffect(() => {
    if (autoSave && formState.isDirty && !formState.isSubmitting) {
      autoSaveForm(formState.values);
    }
    return () => {
      autoSaveForm.cancel();
    };
  }, [autoSave, formState.values, formState.isDirty, formState.isSubmitting, autoSaveForm]);

  return {
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    isSubmitting: formState.isSubmitting,
    isValid: formState.isValid,
    isDirty: formState.isDirty,
    isSaving: formState.isSaving,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
}
