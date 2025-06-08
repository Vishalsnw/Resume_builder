import { Schema, model, Document } from 'mongoose';

// Interface for the Subscription Document
export interface ISubscription extends Document {
    userId: string; // Reference to the User
    planId: string; // Unique identifier for the subscription plan
    planName: string; // Name of the plan (e.g., "Pro", "Basic")
    price: number; // Price of the subscription plan
    validUntil: Date; // Expiry date of the subscription
    createdAt: Date; // Timestamp when the subscription was created
    updatedAt: Date; // Timestamp when the subscription was last updated
}

// Mongoose Schema for Subscription
const SubscriptionSchema = new Schema<ISubscription>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: true,
        },
        planId: {
            type: String,
            required: true,
        },
        planName: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
        },
        validUntil: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true, // Automatically creates createdAt and updatedAt fields
    }
);

// Export the Subscription model
export const Subscription = model<ISubscription>('Subscription', SubscriptionSchema);
