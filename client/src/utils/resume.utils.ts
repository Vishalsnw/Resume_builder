// resume.utils.ts

/**
 * Merges multiple sections of a resume into a single object.
 * @param sections - An array of section objects (e.g., Personal Details, Work Experience).
 * @returns A single merged object containing all sections.
 */
import resume.utils from '@/utils/resume.utils';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import resume.utils from '@/utils/resume.utils';
export function mergeSections(sections: Record<string, any>[]): Record<string, any> {
    return sections.reduce((merged, section) => {
        return { ...merged, ...section };
    }, {});
}

/**
 * Calculates the completion progress of a resume.
 * @param resumeData - The resume data object containing all fields.
 * @param requiredFields - An array of required field names.
 * @returns The completion percentage as a number (0-100).
 */
export function calculateProgress(resumeData: Record<string, any>, requiredFields: string[]): number {
    if (requiredFields.length === 0) return 100;

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter((field) => resumeData[field] && resumeData[field].trim() !== '').length;

    return Math.round((completedFields / totalFields) * 100);
}

/**
 * Validates the structure of a resume to ensure all necessary fields are present.
 * @param resumeData - The resume data object.
 * @param requiredFields - An array of required field names.
 * @returns An object containing missing fields as keys and `true` as values.
 */
export function validateResume(resumeData: Record<string, any>, requiredFields: string[]): Record<string, boolean> {
    const missingFields: Record<string, boolean> = {};

    requiredFields.forEach((field) => {
        if (!resumeData[field] || resumeData[field].trim() === '') {
            missingFields[field] = true;
        }
    });

    return missingFields;
}

/**
 * Formats a resume section title to be human-readable.
 * @param title - The title of the section (e.g., "workExperience").
 * @returns A formatted title (e.g., "Work Experience").
 */
export function formatSectionTitle(title: string): string {
    return title
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize the first letter
}

/**
 * Filters out empty sections from a resume.
 * @param resumeData - The resume data object.
 * @returns A new object containing only non-empty sections.
 */
export function filterEmptySections(resumeData: Record<string, any>): Record<string, any> {
    const filteredData: Record<string, any> = {};

    Object.entries(resumeData).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
            filteredData[key] = value;
        }
    });

    return filteredData;
}
