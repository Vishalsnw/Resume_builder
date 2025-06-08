import { Request, Response } from 'express';
import { FileService } from '../services/file.service';

export class FileController {
    /**
     * Handles uploading a resume file (PDF or text).
     */
    public static async uploadFile(req: Request, res: Response): Promise<void> {
        try {
            // Assuming the file is attached to the request body as 'file'
            const file = req.file; // Use middleware like multer to handle file uploads
            const userId = req.params.userId; // Assuming userId is passed as a path parameter

            if (!file) {
                throw new Error('No file uploaded');
            }

            const savedFile = await FileService.uploadFile(userId, file);
            res.status(201).json({ message: 'File uploaded successfully', file: savedFile });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Downloads a generated resume as a PDF or DOCX.
     */
    public static async downloadResume(req: Request, res: Response): Promise<void> {
        try {
            const resumeId = req.params.resumeId; // Assuming resumeId is passed as a path parameter
            const format = req.query.format || 'pdf'; // Default to PDF if format is not specified (query parameter)

            const fileStream = await FileService.downloadResume(resumeId, format as string);

            // Set headers and send the file
            res.setHeader('Content-Disposition', `attachment; filename=resume.${format}`);
            res.setHeader('Content-Type', format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            fileStream.pipe(res);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Parses an uploaded resume file for AI enhancement.
     */
    public static async parseFile(req: Request, res: Response): Promise<void> {
        try {
            const file = req.file; // Use middleware like multer to handle file uploads

            if (!file) {
                throw new Error('No file uploaded');
            }

            const parsedContent = await FileService.parseFile(file);
            res.status(200).json({ message: 'File parsed successfully', content: parsedContent });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
