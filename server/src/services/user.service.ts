import { User } from '../models/user.model'; // Assuming you have a User model
import { Resume } from '../models/resume.model'; // Assuming you have a Resume model for fetching user resumes
import { AppError } from '../utils/app-error'; // Custom error class

export class UserService {
  /**
   * Get a user's profile by their ID
   * @param userId - The ID of the user
   */
  static async getUserProfile(userId: string) {
    // Fetch the user by ID
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  /**
   * Update a user's profile
   * @param userId - The ID of the user
   * @param updateData - Data to update (e.g., name, email)
   */
  static async updateUserProfile(userId: string, updateData: { name?: string; email?: string }) {
    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!updatedUser) {
      throw new AppError('User not found or update failed', 404);
    }
    return updatedUser;
  }

  /**
   * Delete a user's account
   * @param userId - The ID of the user
   */
  static async deleteUserAccount(userId: string) {
    // Delete the user
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new AppError('User not found or deletion failed', 404);
    }
    return { message: 'User account deleted successfully' };
  }

  /**
   * Get all resumes for a specific user
   * @param userId - The ID of the user
   */
  static async getUserResumes(userId: string) {
    // Fetch the user to ensure they exist
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Fetch resumes associated with the user
    const resumes = await Resume.find({ userId });
    return resumes;
  }

  /**
   * Update subscription details for a user
   * @param userId - The ID of the user
   * @param subscriptionData - Subscription details to update
   */
  static async updateSubscription(userId: string, subscriptionData: { planId: string; validUntil: Date }) {
    // Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Update the subscription details
    user.subscription = subscriptionData;
    await user.save();
    return user;
  }
}
