import express from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// Create a new analytics event
router.post('/', AuthMiddleware.verifyUser, AnalyticsController.logEvent);

// Get analytics data (Admin only)
router.get('/', AuthMiddleware.verifyAdmin, AnalyticsController.getAnalyticsData);

// Get analytics data for a specific user (Admin only)
router.get('/user/:userId', AuthMiddleware.verifyAdmin, AnalyticsController.getUserAnalytics);

// Get analytics events by event type (Admin only)
router.get('/events/:eventType', AuthMiddleware.verifyAdmin, AnalyticsController.getEventsByType);

export default router;
