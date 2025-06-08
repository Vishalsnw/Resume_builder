import express from 'express';
import { TemplateController } from '../controllers/template.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// Get all templates
router.get('/', AuthMiddleware.verifyUser, TemplateController.getAllTemplates);

// Get a specific template by ID
router.get('/:templateId', AuthMiddleware.verifyUser, TemplateController.getTemplateById);

// Create a new template (Admin only)
router.post('/', AuthMiddleware.verifyAdmin, TemplateController.createTemplate);

// Update an existing template (Admin only)
router.put('/:templateId', AuthMiddleware.verifyAdmin, TemplateController.updateTemplate);

// Delete a template by ID (Admin only)
router.delete('/:templateId', AuthMiddleware.verifyAdmin, TemplateController.deleteTemplate);

export default router;n
