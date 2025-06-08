import { Schema, model, Document } from 'mongoose';

// Interface for the Resume Document
export interface IResume extends Document {
    userId: string; // Reference to the User
    title: string; // Title of the resume
    content: string; // Resume content, can be JSON or plain text
    templateId: string; // Reference to the Template used
    createdAt: Date; // Timestamp when the resume was created
    updatedAt: Date; // Timestamp when the resume was last updated
}

// Mongoose Schema for Resume
const ResumeSchema = new Schema<IResume>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String, // Can be JSON, plain text, or structured content
            required: true,
        },
        templateId: {
            type: Schema.Types.ObjectId,
            ref: 'Template', // Reference to the Template model
            required: true,
        },
    },
    {
        timestamps: true, // Automatically creates createdAt and updatedAt fields
    }
);

// Export the Resume model
export const Resume = model<IResume>('Resume', ResumeSchema);
