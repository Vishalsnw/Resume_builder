// hooks/useResume.ts

import useLocalStorage from '@/hooks/useLocalStorage';
import useDebounce from '@/hooks/useDebounce';
import useResume from '@/hooks/useResume';
import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { useLocalStorage } from './useLocalStorage';
import { useDebounce } from './useDebounce';

// Resume Schema Definition
const ResumeSchema = z.object({
  id: z.string().uuid(),
  version: z.number(),
  lastModified: z.string(),
  title: z.string().min(1).max(100),
  basics: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    location: z.object({
      city: z.string(),
      country: z.string(),
    }).optional(),
    summary: z.string().max(500).optional(),
  }),
  experience: z.array(z.object({
    id: z.string().uuid(),
    company: z.string(),
    position: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    current: z.boolean(),
    description: z.string(),
    highlights: z.array(z.string()),
  })),
  education: z.array(z.object({
    id: z.string().uuid(),
    institution: z.string(),
    degree: z.string(),
    field: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    gpa: z.string().optional(),
  })),
  skills: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    keywords: z.array(z.string()),
  })),
});

type Resume = z.infer<typeof ResumeSchema>;

interface UseResumeOptions {
  autoSave?: boolean;
  autoSaveDelay?: number;
  validateOnChange?: boolean;
}

export function useResume(resumeId: string, options: UseResumeOptions = {}) {
  const {
    autoSave = true,
    autoSaveDelay = 2000,
    validateOnChange = true,
  } = options;

  // State management
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<Array<{ timestamp: string; changes: Partial<Resume> }>>([]);

  // Local storage for draft handling
  const { storedValue: draftResume, setValue: setDraftResume } = useLocalStorage({
    key: `resume_draft_${resumeId}`,
    initialValue: null,
    validator: ResumeSchema,
    expiresIn: 24 * 60 * 60 * 1000, // 24 hours
  });

  // Debounce save operations
  const { debouncedCallback: debouncedSave } = useDebounce<Resume>({
    delay: autoSaveDelay,
    onError: (error) => {
      console.error('Auto-save error:', error);
      setError('Failed to auto-save resume');
    },
  });

  // Fetch resume data
  const fetchResume = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/resumes/${resumeId}`);
      if (!response.ok) throw new Error('Failed to fetch resume');

      const data = await response.json();
      const validatedResume = ResumeSchema.parse(data);
      
      setResume(validatedResume);
      setDraftResume(null); // Clear draft if fetch successful

    } catch (error) {
      console.error('Fetch resume error:', error);
      setError('Failed to load resume');
      
      // Try to load from draft
      if (draftResume) {
        setResume(draftResume);
      }
    } finally {
      setIsLoading(false);
    }
  }, [resumeId, draftResume, setDraftResume]);

  // Save resume changes
  const saveResume = useCallback(async (updatedResume: Resume) => {
    try {
      setIsSaving(true);
      setError(null);

      // Validate resume data
      const validatedResume = ResumeSchema.parse(updatedResume);

      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedResume),
      });

      if (!response.ok) throw new Error('Failed to save resume');

      // Update history
      setHistory(prev => [
        {
          timestamp: new Date().toISOString(),
          changes: updatedResume,
        },
        ...prev,
      ]);

      // Clear draft after successful save
      setDraftResume(null);

      // Log activity
      await fetch('/api/activity-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'RESUME_UPDATE',
          description: 'Resume updated',
          metadata: { resumeId },
          createdBy: 'Vishalsnw',
          timestamp: '2025-06-08 07:10:39',
        }),
      });

      return true;
    } catch (error) {
      console.error('Save resume error:', error);
      setError('Failed to save resume');
      
      // Save to draft if main save fails
      setDraftResume(updatedResume);
      
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [resumeId, setDraftResume]);

  // Update resume section
  const updateSection = useCallback(<K extends keyof Resume>(
    section: K,
    data: Resume[K],
    shouldValidate: boolean = validateOnChange
  ) => {
    if (!resume) return;

    try {
      const updatedResume = {
        ...resume,
        [section]: data,
        lastModified: new Date().toISOString(),
      };

      if (shouldValidate) {
        ResumeSchema.parse(updatedResume);
      }

      setResume(updatedResume);

      if (autoSave) {
        debouncedSave(updatedResume);
      }

      // Save to draft
      setDraftResume(updatedResume);

    } catch (error) {
      console.error(`Update ${String(section)} error:`, error);
      setError(`Invalid ${String(section)} data`);
    }
  }, [resume, autoSave, debouncedSave, setDraftResume, validateOnChange]);

  // Export resume
  const exportResume = useCallback(async (format: 'pdf' | 'docx' | 'json') => {
    if (!resume) return null;

    try {
      const response = await fetch(`/api/resumes/${resumeId}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format }),
      });

      if (!response.ok) throw new Error('Export failed');

      return await response.blob();
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export resume');
      return null;
    }
  }, [resumeId, resume]);

  // Initial load
  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  return {
    resume,
    isLoading,
    error,
    isSaving,
    history,
    hasDraft: !!draftResume,
    updateSection,
    saveResume,
    exportResume,
    revertToDraft: () => draftResume && setResume(draftResume),
    discardDraft: () => setDraftResume(null),
  };
      }
