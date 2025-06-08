import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
    /**
     * Fetches the user's profile.
     */
    public static async getUserProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId; // Assuming userId is passed as a path parameter
            const userProfile = await UserService.getUserProfile(userId);
            res.status(200).json(userProfile);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    /**
     * Updates the user's profile.
     */
    public static async updateUserProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId; // Assuming userId is passed as a path parameter
            const updatedData = req.body; // Updated profile data from the request body
            const updatedUser = await UserService.updateUserProfile(userId, updatedData);
            res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Deletes the user's account.
     */
    public static async deleteAccount(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId; // Assuming userId is passed as a path parameter
            await UserService.deleteAccount(userId);
            res.status(200).json({ message: 'Account deleted successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Fetches all saved resumes for the user.
     */
    public static async getUserResumes(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId; // Assuming userId is passed as a path parameter
            const resumes = await UserService.getUserResumes(userId);
            res.status(200).json(resumes);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    /**
     * Allows users to update their subscription plan.
     */
    public static async updateSubscription(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId; // Assuming userId is passed as a path parameter
            const { subscriptionPlan } = req.body; // New subscription plan from the request body
            const updatedSubscription = await UserService.updateSubscription(userId, subscriptionPlan);
            res.status(200).json({ message: 'Subscription updated successfully', subscription: updatedSubscription });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    }
