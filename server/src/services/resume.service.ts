import { Resume } from '../models/resume.model'; // Assuming you have a Resume model
import { User } from '../models/user.model'; // Assuming you have a User model
import { AppError } from '../utils/app-error'; // Custom error class

export class ResumeService {
  /**
   * Create a new resume for a user
   * @param userId - The ID of the user
   * @param resumeData - Data for the new resume
   */
  static async createResume(userId: string, resumeData: { title: string; content: object; templateId: string }) {
    // Ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Create the resume
    const newResume = await Resume.create({ ...resumeData, userId });
    return newResume;
  }

  /**
   * Get a specific resume by its ID
   * @param resumeId - The ID of the resume
   */
  static async getResumeById(resumeId: string) {
    // Fetch the resume
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      throw new AppError('Resume not found', 404);
    }
    return resume;
  }

  /**
   * Update a specific resume by its ID
   * @param resumeId - The ID of the resume
   * @param updateData - Data to update (e.g., title, content, templateId)
   */
  static async updateResume(resumeId: string, updateData: { title?: string; content?: object; templateId?: string }) {
    // Find and update the resume
    const updatedResume = await Resume.findByIdAndUpdate(resumeId, updateData, { new: true });
    if (!updatedResume) {
      throw new AppError('Resume not found or update failed', 404);
    }
    return updatedResume;
  }

  /**
   * Delete a specific resume by its ID
   * @param resumeId - The ID of the resume
   */
  static async deleteResume(resumeId: string) {
    // Delete the resume
    const deletedResume = await Resume.findByIdAndDelete(resumeId);
    if (!deletedResume) {
      throw new AppError('Resume not found or deletion failed', 404);
    }
    return { message: 'Resume deleted successfully' };
  }

  /**
   * Get all resumes for a specific user
   * @param userId - The ID of the user
   */
  static async getAllResumesForUser(userId: string) {
    // Ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Fetch all resumes for the user
    const resumes = await Resume.find({ userId });
    return resumes;
  }
      }
