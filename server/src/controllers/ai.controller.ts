import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';

export class AIController {
    /**
     * Generates personalized resume content using AI.
     */
    public static async generateResumeContent(req: Request, res: Response): Promise<void> {
        try {
            const { userInputs, tone, language } = req.body; // Inputs from the request body
            const generatedContent = await AIService.generateResumeContent(userInputs, tone, language);
            res.status(200).json({ message: 'Resume content generated successfully', content: generatedContent });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Enhances an uploaded resume file with AI.
     */
    public static async enhanceResume(req: Request, res: Response): Promise<void> {
        try {
            const { fileContent, tone, language } = req.body; // Extract resume content, tone, and language
            const enhancedContent = await AIService.enhanceResume(fileContent, tone, language);
            res.status(200).json({ message: 'Resume enhanced successfully', content: enhancedContent });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Generates a personalized AI-powered cover letter.
     */
    public static async generateCoverLetter(req: Request, res: Response): Promise<void> {
        try {
            const { userInputs, tone, language } = req.body; // Inputs for the cover letter
            const generatedCoverLetter = await AIService.generateCoverLetter(userInputs, tone, language);
            res.status(200).json({ message: 'Cover letter generated successfully', coverLetter: generatedCoverLetter });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Analyzes a resume for feedback and scoring.
     */
    public static async analyzeResume(req: Request, res: Response): Promise<void> {
        try {
            const { fileContent } = req.body; // Resume content to analyze
            const analysis = await AIService.analyzeResume(fileContent);
            res.status(200).json({ message: 'Resume analysis completed', analysis });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
