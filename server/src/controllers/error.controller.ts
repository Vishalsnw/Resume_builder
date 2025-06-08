import { Request, Response, NextFunction } from 'express';

export class ErrorController {
    /**
     * Handles all application errors and sends a structured response.
     */
    public static handleError(err: any, req: Request, res: Response, next: NextFunction): void {
        const statusCode = err.statusCode || 500; // Default to internal server error
        const errorMessage = err.message || 'An unexpected error occurred';

        // Log the error for debugging purposes
        console.error(`[${new Date().toISOString()}] Error:`, {
            message: err.message,
            stack: err.stack,
            path: req.path,
            method: req.method,
        });

        // Send a structured error response
        res.status(statusCode).json({
            success: false,
            message: errorMessage,
            error: {
                statusCode,
                path: req.path,
                method: req.method,
                timestamp: new Date().toISOString(),
            },
        });
    }

    /**
     * Handles 404 errors for undefined routes.
     */
    public static handleNotFound(req: Request, res: Response): void {
        res.status(404).json({
            success: false,
            message: 'The requested resource was not found',
            error: {
                statusCode: 404,
                path: req.path,
                method: req.method,
                timestamp: new Date().toISOString(),
            },
        });
    }
}
