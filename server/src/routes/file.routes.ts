import express from 'express';
import { FileController } from '../controllers/file.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// Upload a file
router.post('/:userId/upload', AuthMiddleware.verifyUser, FileController.uploadFile);

// Get metadata for a specific file
router.get('/:fileId', AuthMiddleware.verifyUser, FileController.getFileMetadata);

// Download a specific file
router.get('/:fileId/download', AuthMiddleware.verifyUser, FileController.downloadFile);

// Delete a specific file
router.delete('/:fileId', AuthMiddleware.verifyUser, FileController.deleteFile);

// List all files uploaded by a user
router.get('/:userId/files', AuthMiddleware.verifyUser, FileController.listUserFiles);

export default router;
