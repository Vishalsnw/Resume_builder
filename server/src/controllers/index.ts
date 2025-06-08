import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ErrorController } from './controllers/error.controller';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { ResumeController } from './controllers/resume.controller';
import { TemplateController } from './controllers/template.controller';
import { AIController } from './controllers/ai.controller';
import { SubscriptionController } from './controllers/subscription.controller';
import { FileController } from './controllers/file.controller';
import { AnalyticsController } from './controllers/analytics.controller';

// Load environment variables
dotenv.config();

// Initialize the Express application
const app: Application = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Server is running!' });
});

// Routes
// Authentication Routes
app.post('/auth/register', AuthController.register);
app.post('/auth/login/email-otp', AuthController.loginWithEmailOTP);
app.post('/auth/login/oauth', AuthController.loginWithOAuth);
app.post('/auth/logout', AuthController.logout);
app.post('/auth/send-email-otp', AuthController.sendEmailOTP);

// User Routes
app.get('/users/:userId/profile', UserController.getUserProfile);
app.put('/users/:userId/profile', UserController.updateUserProfile);
app.delete('/users/:userId', UserController.deleteAccount);
app.get('/users/:userId/resumes', UserController.getUserResumes);
app.put('/users/:userId/subscription', UserController.updateSubscription);

// Resume Routes
app.post('/users/:userId/resumes', ResumeController.createResume);
app.get('/resumes/:resumeId', ResumeController.getResumeById);
app.put('/resumes/:resumeId', ResumeController.updateResume);
app.delete('/resumes/:resumeId', ResumeController.deleteResume);
app.post('/resumes/:resumeId/enhance', ResumeController.enhanceResume);
app.post('/resumes/:resumeId/analyze', ResumeController.analyzeResume);

// Template Routes
app.get('/templates', TemplateController.getTemplates);
app.get('/templates/:templateId', TemplateController.getTemplateById);
app.post('/templates', TemplateController.addTemplate); // Admin only
app.put('/templates/:templateId', TemplateController.updateTemplate); // Admin only
app.delete('/templates/:templateId', TemplateController.deleteTemplate); // Admin only

// AI Routes
app.post('/ai/resume-content', AIController.generateResumeContent);
app.post('/ai/enhance-resume', AIController.enhanceResume);
app.post('/ai/cover-letter', AIController.generateCoverLetter);
app.post('/ai/analyze-resume', AIController.analyzeResume);

// Subscription Routes
app.get('/subscriptions/plans', SubscriptionController.getSubscriptionPlans);
app.post('/users/:userId/subscriptions', SubscriptionController.subscribe);
app.delete('/users/:userId/subscriptions', SubscriptionController.cancelSubscription);
app.get('/users/:userId/subscriptions', SubscriptionController.getUserSubscription);
app.post('/subscriptions/webhook', SubscriptionController.handleWebhook);

// File Routes
app.post('/users/:userId/files', FileController.uploadFile);
app.get('/resumes/:resumeId/download', FileController.downloadResume);
app.post('/files/parse', FileController.parseFile);

// Analytics Routes
app.post('/analytics/events', AnalyticsController.trackEvent);
app.get('/analytics', AnalyticsController.getAnalyticsData); // Admin only
app.get('/analytics/users/:userId', AnalyticsController.getUserAnalytics);

// 404 Handler
app.use(ErrorController.handleNotFound);

// Global Error Handler
app.use(ErrorController.handleError);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
