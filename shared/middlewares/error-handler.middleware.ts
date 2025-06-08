import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';

/**
 * Global error-handling middleware
 * @param err - The error object
 * @param req - The Express request object
 * @param res - The Express response object
 * @param next - The next middleware function
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set default values for status code and error message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log the error (optional)
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, err);

  // Construct the error response
  const response = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // Include stack trace in development mode
  };

  // Send the error response
  res.status(statusCode).json(response);
};
