// template.utils.ts

/**
 * Retrieves the list of available resume templates.
 * @returns An array of template objects with id, name, and description.
 */
import template.utils from '@/utils/template.utils';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import template.utils from '@/utils/template.utils';
export function getAvailableTemplates(): Array<{ id: string; name: string; description: string }> {
    return [
        {
            id: 'template1',
            name: 'Classic',
            description: 'A clean and simple resume template suitable for all industries.',
        },
        {
            id: 'template2',
            name: 'Modern',
            description: 'A sleek and modern resume template with a focus on design.',
        },
        {
            id: 'template3',
            name: 'Professional',
            description: 'A professional template with a traditional layout.',
        },
    ];
}

/**
 * Applies a selected template to the resume data.
 * @param resumeData - The data of the resume (e.g., personal details, experience, etc.).
 * @param templateId - The ID of the selected template.
 * @returns A new object containing the resume data formatted with the selected template.
 */
export function applyTemplate(
    resumeData: Record<string, any>,
    templateId: string
): Record<string, any> {
    // Example: Add a template ID or style property to the resume data
    return {
        ...resumeData,
        templateId,
        style: getTemplateStyle(templateId),
    };
}

/**
 * Retrieves the styling or configuration for a specific template ID.
 * @param templateId - The ID of the selected template.
 * @returns An object containing style-related properties for the template.
 */
function getTemplateStyle(templateId: string): Record<string, string> {
    const styles: Record<string, Record<string, string>> = {
        template1: {
            font: 'Times New Roman',
            color: '#000000',
        },
        template2: {
            font: 'Arial',
            color: '#333333',
        },
        template3: {
            font: 'Georgia',
            color: '#00008B',
        },
    };

    return styles[templateId] || { font: 'Default', color: '#000000' };
      }
