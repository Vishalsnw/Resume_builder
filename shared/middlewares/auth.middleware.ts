import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/app-error';

interface AuthenticatedRequest extends Request {
  user?: any; // Extend the request object to include the user information
}

/**
 * Middleware for authenticating users using a JWT token.
 * @param req - The Express request object
 * @param res - The Express response object
 * @param next - The next middleware function
 */
export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication token is missing or invalid', 401);
    }

    const token = authHeader.split(' ')[1]; // Extract the token part after "Bearer"

    // Verify the token
    const secretKey = process.env.JWT_SECRET || 'default-secret-key';
    const decodedToken = jwt.verify(token, secretKey);

    // Attach the decoded user information to the request object
    req.user = decodedToken;

    next(); // Proceed to the next middleware or route handler
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid or malformed token', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Token has expired', 401));
    } else {
      next(new AppError('Authentication failed', 401));
    }
  }
};
