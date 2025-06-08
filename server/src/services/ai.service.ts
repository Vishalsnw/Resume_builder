import { AppError } from '../utils/app-error'; // Custom error class
import { OpenAIClient } from '../utils/openai-client'; // Utility to interact with OpenAI or other AI APIs
import { Resume } from '../models/resume.model'; // Assuming you have a Resume model

export class AIService {
  /**
   * Generate resume content based on user input
   * @param input - User input including career field, skills, and experience
   */
  static async generateResumeContent(input: { careerField: string; skills: string[]; experience: object[] }) {
    // Validate input
    if (!input.careerField || input.skills.length === 0 || input.experience.length === 0) {
      throw new AppError('Invalid input for generating resume content', 400);
    }

    // Generate content using OpenAI API
    const prompt = `Generate a professional resume for a career in ${input.careerField}. Skills include ${input.skills.join(
      ', '
    )}. Experience: ${JSON.stringify(input.experience)}.`;
    const aiResponse = await OpenAIClient.generateText(prompt);

    if (!aiResponse) {
      throw new AppError('Failed to generate resume content', 500);
    }

    return { content: aiResponse };
  }

  /**
   * Enhance an existing resume using AI
   * @param resumeContent - Existing resume content to enhance
   */
  static async enhanceResume(resumeContent: object) {
    // Validate input
    if (!resumeContent) {
      throw new AppError('Resume content is required for enhancement', 400);
    }

    // Enhance content using OpenAI API
    const prompt = `Improve the following resume content to make it more professional and impactful:\n${JSON.stringify(
      resumeContent
    )}`;
    const aiResponse = await OpenAIClient.generateText(prompt);

    if (!aiResponse) {
      throw new AppError('Failed to enhance resume content', 500);
    }

    return { enhancedContent: aiResponse };
  }

  /**
   * Summarize uploaded resume content
   * @param resumeContent - Content of the uploaded resume
   */
  static async summarizeResume(resumeContent: object) {
    // Validate input
    if (!resumeContent) {
      throw new AppError('Resume content is required for summarization', 400);
    }

    // Summarize content using OpenAI API
    const prompt = `Summarize the following resume content in a concise manner:\n${JSON.stringify(resumeContent)}`;
    const aiResponse = await OpenAIClient.generateText(prompt);

    if (!aiResponse) {
      throw new AppError('Failed to summarize resume content', 500);
    }

    return { summary: aiResponse };
  }

  /**
   * Generate suggestions for improving a resume
   * @param resumeContent - Existing resume content
   */
  static async generateSuggestions(resumeContent: object) {
    // Validate input
    if (!resumeContent) {
      throw new AppError('Resume content is required for generating suggestions', 400);
    }

    // Generate suggestions using OpenAI API
    const prompt = `Provide actionable suggestions to improve the following resume content:\n${JSON.stringify(
      resumeContent
    )}`;
    const aiResponse = await OpenAIClient.generateText(prompt);

    if (!aiResponse) {
      throw new AppError('Failed to generate suggestions for resume content', 500);
    }

    return { suggestions: aiResponse };
  }
}
