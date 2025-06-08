import { Schema, model, Document } from 'mongoose';

// Interface for the File Document
export interface IFile extends Document {
    userId: string; // Reference to the User who uploaded the file
    fileName: string; // Name of the uploaded file
    fileType: string; // Type of the file (e.g., "pdf", "txt")
    storageUrl: string; // URL to the file in cloud storage
    createdAt: Date; // Timestamp when the file was uploaded
    updatedAt: Date; // Timestamp when the file was last updated
}

// Mongoose Schema for File
const FileSchema = new Schema<IFile>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: true,
        },
        fileName: {
            type: String,
            required: true,
            trim: true,
        },
        fileType: {
            type: String,
            required: true,
            enum: ['pdf', 'txt'], // Restrict file types to specific allowed formats
        },
        storageUrl: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true, // Automatically creates createdAt and updatedAt fields
    }
);

// Export the File model
export const File = model<IFile>('File', FileSchema);
