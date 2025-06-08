import express from 'express';
import { ResumeController } from '../controllers/resume.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// Create a new resume
router.post('/:userId/resumes', AuthMiddleware.verifyUser, ResumeController.createResume);

// Get a specific resume by ID
router.get('/:resumeId', AuthMiddleware.verifyUser, ResumeController.getResumeById);

// Update a specific resume by ID
router.put('/:resumeId', AuthMiddleware.verifyUser, ResumeController.updateResume);

// Delete a specific resume by ID
router.delete('/:resumeId', AuthMiddleware.verifyUser, ResumeController.deleteResume);

// Get all resumes for a specific user
router.get('/:userId/resumes', AuthMiddleware.verifyUser, ResumeController.getAllResumesForUser);

export default router;
