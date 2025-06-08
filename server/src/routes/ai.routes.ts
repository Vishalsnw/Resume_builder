import express from 'express';
import { AIController } from '../controllers/ai.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// Generate content for a resume
router.post('/generate-resume-content', AuthMiddleware.verifyUser, AIController.generateResumeContent);

// Enhance an existing resume
router.post('/enhance-resume', AuthMiddleware.verifyUser, AIController.enhanceResume);

// Summarize uploaded resume content
router.post('/summarize-resume', AuthMiddleware.verifyUser, AIController.summarizeResume);

// Generate suggestions for improving a resume
router.post('/generate-suggestions', AuthMiddleware.verifyUser, AIController.generateSuggestions);

export default router;
