import { AnalyticsEvent } from '../models/analytics-event.model'; // Assuming you have an AnalyticsEvent model
import { User } from '../models/user.model'; // Assuming you have a User model
import { AppError } from '../utils/app-error'; // Custom error class

export class AnalyticsService {
  /**
   * Log an analytics event
   * @param userId - The ID of the user
   * @param event - The event name
   * @param metadata - Additional metadata associated with the event
   */
  static async logEvent(userId: string, event: string, metadata: object) {
    // Ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Create an analytics event
    const newEvent = await AnalyticsEvent.create({
      userId,
      event,
      metadata,
      timestamp: new Date(),
    });

    return newEvent;
  }

  /**
   * Get aggregated analytics data (Admin only)
   */
  static async getAnalyticsData() {
    // Aggregate analytics events by event type
    const analyticsData = await AnalyticsEvent.aggregate([
      {
        $group: {
          _id: '$event',
          count: { $sum: 1 },
        },
      },
    ]);

    return analyticsData;
  }

  /**
   * Get analytics data for a specific user (Admin only)
   * @param userId - The ID of the user
   */
  static async getUserAnalytics(userId: string) {
    // Ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Fetch analytics events for the user
    const userAnalytics = await AnalyticsEvent.find({ userId });
    return userAnalytics;
  }

  /**
   * Get analytics events filtered by event type (Admin only)
   * @param eventType - The event type to filter by
   */
  static async getEventsByType(eventType: string) {
    // Fetch events matching the specified type
    const events = await AnalyticsEvent.find({ event: eventType });
    if (events.length === 0) {
      throw new AppError('No events found for the specified type', 404);
    }

    return events;
  }
}
