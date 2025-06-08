import express from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// Get user profile
router.get('/:userId/profile', AuthMiddleware.verifyUser, UserController.getUserProfile);

// Update user profile
router.put('/:userId/profile', AuthMiddleware.verifyUser, UserController.updateUserProfile);

// Delete user account
router.delete('/:userId', AuthMiddleware.verifyUser, UserController.deleteAccount);

// Get all resumes for a user
router.get('/:userId/resumes', AuthMiddleware.verifyUser, UserController.getUserResumes);

// Update subscription details for a user
router.put('/:userId/subscription', AuthMiddleware.verifyUser, UserController.updateSubscription);

export default router;
