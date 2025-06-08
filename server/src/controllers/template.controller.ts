import { Request, Response } from 'express';
import { TemplateService } from '../services/template.service';

export class TemplateController {
    /**
     * Fetches all available resume templates.
     */
    public static async getTemplates(req: Request, res: Response): Promise<void> {
        try {
            const templates = await TemplateService.getAllTemplates();
            res.status(200).json(templates);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Fetches a specific resume template by its ID.
     */
    public static async getTemplateById(req: Request, res: Response): Promise<void> {
        try {
            const templateId = req.params.templateId; // Assuming templateId is passed as a path parameter
            const template = await TemplateService.getTemplateById(templateId);
            res.status(200).json(template);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    /**
     * Adds a new resume template (Admin only).
     */
    public static async addTemplate(req: Request, res: Response): Promise<void> {
        try {
            const templateData = req.body; // Template details from the request body
            const newTemplate = await TemplateService.addTemplate(templateData);
            res.status(201).json({ message: 'Template added successfully', template: newTemplate });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Updates an existing resume template (Admin only).
     */
    public static async updateTemplate(req: Request, res: Response): Promise<void> {
        try {
            const templateId = req.params.templateId; // Assuming templateId is passed as a path parameter
            const updatedData = req.body; // Updated template data from the request body
            const updatedTemplate = await TemplateService.updateTemplate(templateId, updatedData);
            res.status(200).json({ message: 'Template updated successfully', template: updatedTemplate });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Deletes a resume template by its ID (Admin only).
     */
    public static async deleteTemplate(req: Request, res: Response): Promise<void> {
        try {
            const templateId = req.params.templateId; // Assuming templateId is passed as a path parameter
            await TemplateService.deleteTemplate(templateId);
            res.status(200).json({ message: 'Template deleted successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
