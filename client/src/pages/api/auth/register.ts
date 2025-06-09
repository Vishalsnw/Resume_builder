// pages/api/auth/register.ts

import create from '@/pages/resumes/create';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import settings from '@/pages/profile/settings';
import register from '@/pages/api/auth/register';
// REMOVED INVALID IMPORT
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../lib/prisma';
import { rateLimit } from '../../../lib/rate-limit';
import { validateEmail, validatePassword } from '../../../utils/validation';
import { sendVerificationEmail } from '../../../lib/email';

// Rate limiting configuration
const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
  maxRequests: 5, // 5 registration attempts per hour per IP
});

interface RegistrationData {
  email: string;
  password: string;
  name: string;
  acceptedTerms: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only POST requests are allowed for this endpoint',
      timestamp: '2025-06-07 20:49:17',
    });
  }

  try {
    // Apply rate limiting
    await limiter.check(res, 5, 'REGISTER_RATE_LIMIT');

    const { email, password, name, acceptedTerms }: RegistrationData = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email, password, and name are required',
        timestamp: '2025-06-07 20:49:17',
      });
    }

    // Validate terms acceptance
    if (!acceptedTerms) {
      return res.status(400).json({
        error: 'Terms not accepted',
        message: 'You must accept the terms and conditions to register',
        timestamp: '2025-06-07 20:49:17',
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email',
        message: 'Please provide a valid email address',
        timestamp: '2025-06-07 20:49:17',
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Invalid password',
        message: passwordValidation.message,
        requirements: passwordValidation.requirements,
        timestamp: '2025-06-07 20:49:17',
      });
    }

    // Check if email is already registered
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'Email already registered',
        message: 'This email address is already in use',
        timestamp: '2025-06-07 20:49:17',
      });
    }

    // Generate verification token
    const verificationToken = crypto.randomUUID();

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role: 'USER',
        isActive: false, // Requires email verification
        verificationToken,
        acceptedTerms: true,
        acceptedTermsAt: new Date(),
        registrationIp: req.headers['x-forwarded-for']?.toString() || 
                       req.socket.remoteAddress || 
                       'Unknown',
        userAgent: req.headers['user-agent'] || 'Unknown',
        createdBy: 'Vishalsnw',
        updatedBy: 'Vishalsnw',
      },
    });

    // Create initial profile
    await prisma.profile.create({
      data: {
        userId: user.id,
        displayName: name,
        visibility: 'private',
        createdBy: 'Vishalsnw',
        updatedBy: 'Vishalsnw',
      },
    });

    // Create account settings with defaults
    await prisma.userSettings.create({
      data: {
        userId: user.id,
        emailNotifications: true,
        twoFactorEnabled: false,
        language: 'en',
        theme: 'light',
        createdBy: 'Vishalsnw',
        updatedBy: 'Vishalsnw',
      },
    });

    // Log registration activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        type: 'REGISTRATION',
        description: 'New user registration',
        ipAddress: req.headers['x-forwarded-for']?.toString() || 
                  req.socket.remoteAddress || 
                  'Unknown',
        userAgent: req.headers['user-agent'] || 'Unknown',
        createdBy: 'Vishalsnw',
      },
    });

    // Send verification email
    try {
      await sendVerificationEmail({
        email: user.email,
        name: user.name,
        verificationToken,
        timestamp: '2025-06-07 20:49:17',
      });
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't return error to client, but log it
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          type: 'EMAIL_FAILURE',
          description: 'Failed to send verification email',
          error: JSON.stringify(error),
          createdBy: 'Vishalsnw',
        },
      });
    }

    // Return success response
    return res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      userId: user.id,
      requiresVerification: true,
      timestamp: '2025-06-07 20:49:17',
    });

  } catch (error) {
    console.error('Registration error:', error);

    // Log the error
    await prisma.errorLog.create({
      data: {
        type: 'REGISTRATION_ERROR',
        description: 'Error during user registration',
        error: JSON.stringify(error),
        stackTrace: (error as Error).stack,
        ipAddress: req.headers['x-forwarded-for']?.toString() || 
                  req.socket.remoteAddress || 
                  'Unknown',
        userAgent: req.headers['user-agent'] || 'Unknown',
        createdBy: 'Vishalsnw',
      },
    });

    return res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred during registration',
      timestamp: '2025-06-07 20:49:17',
    });
  }
}

// Password validation requirements
const passwordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxLength: 128,
};

// Email validation regex
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// Export for testing
export { passwordRequirements, emailRegex };
