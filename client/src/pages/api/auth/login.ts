// pages/api/auth/login.ts

import contact from '@/pages/help/contact';
import create from '@/pages/resumes/create';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import login from '@/pages/api/auth/login';
import 500 from '@/pages/500';
import { NextApiRequest, NextApiResponse } from 'next';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../lib/prisma';
import { rateLimit } from '../../../lib/rate-limit';
import { validateEmail } from '../../../utils/validation';

// Rate limiting configuration
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
  maxRequests: 5, // 5 requests per minute per IP
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only POST requests are allowed for this endpoint',
      timestamp: '2025-06-07 20:46:22',
    });
  }

  try {
    // Apply rate limiting
    await limiter.check(res, 10, 'LOGIN_RATE_LIMIT');

    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email and password are required',
        timestamp: '2025-06-07 20:46:22',
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email',
        message: 'Please provide a valid email address',
        timestamp: '2025-06-07 20:46:22',
      });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        isActive: true,
        isTwoFactorEnabled: true,
        failedLoginAttempts: true,
        lastFailedLoginAttempt: true,
        lockedUntil: true,
      },
    });

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password',
        timestamp: '2025-06-07 20:46:22',
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        error: 'Account inactive',
        message: 'Your account has been deactivated. Please contact support.',
        timestamp: '2025-06-07 20:46:22',
      });
    }

    // Check if account is locked
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      const remainingTime = Math.ceil(
        (new Date(user.lockedUntil).getTime() - new Date().getTime()) / 1000 / 60
      );
      return res.status(423).json({
        error: 'Account locked',
        message: `Account is temporarily locked. Please try again in ${remainingTime} minutes.`,
        timestamp: '2025-06-07 20:46:22',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Increment failed login attempts
      const failedAttempts = (user.failedLoginAttempts || 0) + 1;
      const updates: any = {
        failedLoginAttempts: failedAttempts,
        lastFailedLoginAttempt: new Date(),
      };

      // Lock account after 5 failed attempts
      if (failedAttempts >= 5) {
        updates.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updates,
      });

      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password',
        remainingAttempts: 5 - failedAttempts,
        timestamp: '2025-06-07 20:46:22',
      });
    }

    // Reset failed login attempts on successful login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lastFailedLoginAttempt: null,
        lockedUntil: null,
      },
    });

    // Generate JWT token
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: '24h',
      }
    );

    // Create session record
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token,
        userAgent: req.headers['user-agent'] || 'Unknown',
        ipAddress: req.headers['x-forwarded-for']?.toString() || 
                  req.socket.remoteAddress || 
                  'Unknown',
        lastActivity: new Date(),
      },
    });

    // Log login activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        type: 'LOGIN',
        description: 'User logged in successfully',
        ipAddress: req.headers['x-forwarded-for']?.toString() || 
                  req.socket.remoteAddress || 
                  'Unknown',
        userAgent: req.headers['user-agent'] || 'Unknown',
      },
    });

    // Check if 2FA is enabled
    if (user.isTwoFactorEnabled) {
      // Generate and send 2FA code
      const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      await prisma.twoFactorCode.create({
        data: {
          userId: user.id,
          code: twoFactorCode,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        },
      });

      // Send 2FA code via email
      // TODO: Implement email sending logic

      return res.status(200).json({
        requires2FA: true,
        message: 'Please enter the verification code sent to your email',
        timestamp: '2025-06-07 20:46:22',
      });
    }

    // Return success response with token
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      sessionId: session.id,
      message: 'Login successful',
      timestamp: '2025-06-07 20:46:22',
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred during login',
      timestamp: '2025-06-07 20:46:22',
    });
  }
}        
