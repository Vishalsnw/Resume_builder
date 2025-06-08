import { Template } from '../models/template.model'; // Assuming you have a Template model
import { AppError } from '../utils/app-error'; // Custom error class

export class TemplateService {
  /**
   * Get all available templates
   */
  static async getAllTemplates() {
    // Fetch all templates from the database
    const templates = await Template.find();
    if (!templates || templates.length === 0) {
      throw new AppError('No templates found', 404);
    }
    return templates;
  }

  /**
   * Get a specific template by its ID
   * @param templateId - The ID of the template
   */
  static async getTemplateById(templateId: string) {
    // Fetch the template by ID
    const template = await Template.findById(templateId);
    if (!template) {
      throw new AppError('Template not found', 404);
    }
    return template;
  }

  /**
   * Create a new template (Admin only)
   * @param templateData - Data for the new template
   */
  static async createTemplate(templateData: { name: string; description: string; layout: string }) {
    // Create the new template
    const newTemplate = await Template.create(templateData);
    return newTemplate;
  }

  /**
   * Update an existing template by its ID (Admin only)
   * @param templateId - The ID of the template
   * @param updateData - Data to update (e.g., name, description, layout)
   */
  static async updateTemplate(templateId: string, updateData: { name?: string; description?: string; layout?: string }) {
    // Find and update the template
    const updatedTemplate = await Template.findByIdAndUpdate(templateId, updateData, { new: true });
    if (!updatedTemplate) {
      throw new AppError('Template not found or update failed', 404);
    }
    return updatedTemplate;
  }

  /**
   * Delete a specific template by its ID (Admin only)
   * @param templateId - The ID of the template
   */
  static async deleteTemplate(templateId: string) {
    // Delete the template
    const deletedTemplate = await Template.findByIdAndDelete(templateId);
    if (!deletedTemplate) {
      throw new AppError('Template not found or deletion failed', 404);
    }
    return { message: 'Template deleted successfully' };
  }
}
