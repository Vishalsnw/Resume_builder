import { AppError } from '../utils/app-error'; // Custom error class
import { CloudStorage } from '../utils/cloud-storage'; // Utility for interacting with cloud storage (e.g., AWS S3, Google Cloud Storage)
import { File } from '../models/file.model'; // Assuming you have a File model
import { User } from '../models/user.model'; // Assuming you have a User model

export class FileService {
  /**
   * Upload a file
   * @param userId - The ID of the user
   * @param file - File metadata and content
   */
  static async uploadFile(userId: string, file: { originalname: string; buffer: Buffer; mimetype: string }) {
    // Ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Upload the file to cloud storage
    const fileKey = `${userId}/${Date.now()}_${file.originalname}`;
    const uploadResult = await CloudStorage.uploadFile(fileKey, file.buffer, file.mimetype);

    if (!uploadResult.success) {
      throw new AppError('Failed to upload file', 500);
    }

    // Save file metadata in the database
    const newFile = await File.create({
      userId,
      fileName: file.originalname,
      fileKey,
      mimeType: file.mimetype,
      url: uploadResult.url,
      uploadedAt: new Date(),
    });

    return newFile;
  }

  /**
   * Get metadata for a specific file
   * @param fileId - The ID of the file
   */
  static async getFileMetadata(fileId: string) {
    // Fetch the file metadata
    const file = await File.findById(fileId);
    if (!file) {
      throw new AppError('File not found', 404);
    }

    return file;
  }

  /**
   * Download a file
   * @param fileId - The ID of the file
   */
  static async downloadFile(fileId: string) {
    // Fetch the file metadata
    const file = await File.findById(fileId);
    if (!file) {
      throw new AppError('File not found', 404);
    }

    // Get the file from cloud storage
    const fileBuffer = await CloudStorage.getFile(file.fileKey);
    if (!fileBuffer) {
      throw new AppError('Failed to download file', 500);
    }

    return {
      fileName: file.fileName,
      mimeType: file.mimeType,
      buffer: fileBuffer,
    };
  }

  /**
   * Delete a file
   * @param fileId - The ID of the file
   */
  static async deleteFile(fileId: string) {
    // Fetch the file metadata
    const file = await File.findById(fileId);
    if (!file) {
      throw new AppError('File not found', 404);
    }

    // Delete the file from cloud storage
    const deleteResult = await CloudStorage.deleteFile(file.fileKey);
    if (!deleteResult.success) {
      throw new AppError('Failed to delete file from storage', 500);
    }

    // Delete the file metadata from the database
    await file.deleteOne();

    return { message: 'File deleted successfully' };
  }

  /**
   * List all files uploaded by a specific user
   * @param userId - The ID of the user
   */
  static async listUserFiles(userId: string) {
    // Ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Fetch all files associated with the user
    const files = await File.find({ userId });
    return files;
  }
}
