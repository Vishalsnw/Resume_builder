import { Schema, model, Document } from 'mongoose';

// Interface for the Template Document
export interface ITemplate extends Document {
    name: string; // Name of the template
    description: string; // Brief description of the template
    layout: string; // HTML/CSS layout for the template
    createdAt: Date; // Timestamp when the template was created
    updatedAt: Date; // Timestamp when the template was last updated
}

// Mongoose Schema for Template
const TemplateSchema = new Schema<ITemplate>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        layout: {
            type: String, // Stores the HTML/CSS content of the template
            required: true,
        },
    },
    {
        timestamps: true, // Automatically creates createdAt and updatedAt fields
    }
);

// Export the Template model
export const Template = model<ITemplate>('Template', TemplateSchema);
