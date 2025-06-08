import { Schema, model, Document } from 'mongoose';

// Interface for the Analytics Document
export interface IAnalytics extends Document {
    userId?: string; // Reference to the User (optional for system-level events)
    event: string; // Name of the event (e.g., "resume_created", "template_selected")
    metadata: Record<string, any>; // Additional data for the event (e.g., templateId, duration, etc.)
    timestamp: Date; // Timestamp when the event occurred
}

// Mongoose Schema for Analytics
const AnalyticsSchema = new Schema<IAnalytics>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: false, // Optional for system-level events
        },
        event: {
            type: String,
            required: true,
            trim: true,
        },
        metadata: {
            type: Schema.Types.Mixed, // Allows storing any kind of object
            required: false,
        },
        timestamp: {
            type: Date,
            required: true,
            default: Date.now, // Defaults to the current timestamp
        },
    },
    {
        timestamps: true, // Automatically creates createdAt and updatedAt fields
    }
);

// Export the Analytics model
export const Analytics = model<IAnalytics>('Analytics', AnalyticsSchema);
