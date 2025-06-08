import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';

export class AnalyticsController {
    /**
     * Tracks a specific user event for analytics purposes.
     */
    public static async trackEvent(req: Request, res: Response): Promise<void> {
        try {
            const { userId, event, metadata } = req.body; // Event data from the request body
            await AnalyticsService.trackEvent(userId, event, metadata);
            res.status(200).json({ message: 'Event tracked successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Retrieves aggregated analytics data.
     * (Admin only).
     */
    public static async getAnalyticsData(req: Request, res: Response): Promise<void> {
        try {
            const { startDate, endDate } = req.query; // Optional query parameters for date range
            const analyticsData = await AnalyticsService.getAnalyticsData(startDate as string, endDate as string);
            res.status(200).json(analyticsData);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Retrieves user-specific analytics data.
     */
    public static async getUserAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId; // Assuming userId is passed as a path parameter
            const userAnalytics = await AnalyticsService.getUserAnalytics(userId);
            res.status(200).json(userAnalytics);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}
