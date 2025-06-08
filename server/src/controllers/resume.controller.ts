import { Request, Response } from 'express';
import { ResumeService } from '../services/resume.service';

export class ResumeController {
    /**
     * Creates a new resume.
     */
    public static async createResume(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId; // Assuming userId is passed as a path parameter
            const resumeData = req.body; // Resume data from the request body
            const newResume = await ResumeService.createResume(userId, resumeData);
            res.status(201).json({ message: 'Resume created successfully', resume: newResume });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Fetches a resume by its ID.
     */
    public static async getResumeById(req: Request, res: Response): Promise<void> {
        try {
            const resumeId = req.params.resumeId; // Assuming resumeId is passed as a path parameter
            const resume = await ResumeService.getResumeById(resumeId);
            res.status(200).json(resume);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    /**
     * Updates an existing resume.
     */
    public static async updateResume(req: Request, res: Response): Promise<void> {
        try {
            const resumeId = req.params.resumeId; // Assuming resumeId is passed as a path parameter
            const updatedData = req.body; // Updated resume data from the request body
            const updatedResume = await ResumeService.updateResume(resumeId, updatedData);
            res.status(200).json({ message: 'Resume updated successfully', resume: updatedResume });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Deletes a resume by its ID.
     */
    public static async deleteResume(req: Request, res: Response): Promise<void> {
        try {
            const resumeId = req.params.resumeId; // Assuming resumeId is passed as a path parameter
            await ResumeService.deleteResume(resumeId);
            res.status(200).json({ message: 'Resume deleted successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Fetches all resumes for a specific user.
     */
    public static async getAllResumesByUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId; // Assuming userId is passed as a path parameter
            const resumes = await ResumeService.getAllResumesByUser(userId);
            res.status(200).json(resumes);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    /**
     * Enhances a resume using AI.
     */
    public static async enhanceResume(req: Request, res: Response): Promise<void> {
        try {
            const resumeId = req.params.resumeId; // Assuming resumeId is passed as a path parameter
            const { tone, language } = req.body; // Additional options for AI enhancement
            const enhancedResume = await ResumeService.enhanceResume(resumeId, tone, language);
            res.status(200).json({ message: 'Resume enhanced successfully', resume: enhancedResume });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Analyzes a resume for feedback and scoring.
     */
    public static async analyzeResume(req: Request, res: Response): Promise<void> {
        try {
            const resumeId = req.params.resumeId; // Assuming resumeId is passed as a path parameter
            const analysis = await ResumeService.analyzeResume(resumeId);
            res.status(200).json({ message: 'Resume analysis completed', analysis });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }  
}
