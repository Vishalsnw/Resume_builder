import { Schema, model, Document } from 'mongoose';

// Interface for the User Document
export interface IUser extends Document {
    name: string;
    email: string;
    password: string; // Stored as a hashed password
    subscriptionStatus: string; // e.g., "active", "inactive"
    role: string; // e.g., "user", "admin"
    createdAt: Date;
    updatedAt: Date;
}

// Mongoose Schema for User
const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        subscriptionStatus: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'inactive',
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    {
        timestamps: true, // Automatically creates createdAt and updatedAt fields
    }
);

// Export the User model
export const User = model<IUser>('User', UserSchema);
