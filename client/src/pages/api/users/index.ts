// pages/api/users/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../lib/prisma';
import { rateLimit } from '../../../lib/rate-limit';
import { validateEmail } from '../../../utils/validation';

// Rate limiting configuration
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
  maxRequests: 20, // 20 requests per minute per IP
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Apply rate limiting
    await limiter.check(res, 20, 'USERS_API_RATE_LIMIT');

    // Get user session
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in to access this resource',
        timestamp: '2025-06-07 20:59:50',
      });
    }

    // Check if user has admin role for certain operations
    const isAdmin = session.user.role === 'ADMIN';

    switch (req.method) {
      case 'GET':
        return getUsers(req, res, session.user.id, isAdmin);
      case 'POST':
        if (!isAdmin) {
          return res.status(403).json({
            error: 'Forbidden',
            message: 'Only administrators can create users',
            timestamp: '2025-06-07 20:59:50',
          });
        }
        return createUser(req, res, session.user.id);
      default:
        return res.status(405).json({
          error: 'Method not allowed',
          message: 'Supported methods: GET, POST',
          timestamp: '2025-06-07 20:59:50',
        });
    }
  } catch (error) {
    console.error('Users API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      timestamp: '2025-06-07 20:59:50',
    });
  }
}

async function getUsers(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  isAdmin: boolean
) {
  try {
    const {
      page = '1',
      limit = '10',
      sort = 'createdAt',
      order = 'desc',
      search,
      role,
      status,
    } = req.query;

    const pageNumber = parseInt(page as string);
    const pageSize = parseInt(limit as string);

    // Validate pagination parameters
    if (isNaN(pageNumber) || isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
      return res.status(400).json({
        error: 'Invalid pagination parameters',
        message: 'Page and limit must be positive integers',
        timestamp: '2025-06-07 20:59:50',
      });
    }

    // Build where clause
    const where: any = {
      deletedAt: null,
    };

    // Non-admin users can only see public profiles
    if (!isAdmin) {
      where.OR = [
        { id: userId },
        { profile: { visibility: 'public' } },
      ];
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (role && isAdmin) {
      where.role = role;
    }

    if (status && isAdmin) {
      where.isActive = status === 'active';
    }

    // Get total count
    const total = await prisma.user.count({ where });

    // Get users with selected fields
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: isAdmin, // Only include email for admins
        role: isAdmin,
        isActive: isAdmin,
        createdAt: true,
        profile: {
          select: {
            displayName: true,
            bio: true,
            location: true,
            website: true,
            visibility: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            resumes: true,
            followers: true,
            following: true,
          },
        },
      },
      orderBy: {
        [sort as string]: order,
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId,
        type: 'USER_LIST',
        description: 'Viewed user list',
        createdBy: 'Vishalsnw',
        timestamp: '2025-06-07 20:59:50',
      },
    });

    return res.status(200).json({
      data: users,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
      timestamp: '2025-06-07 20:59:50',
    });

  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch users',
      timestamp: '2025-06-07 20:59:50',
    });
  }
}

async function createUser(
  req: NextApiRequest,
  res: NextApiResponse,
  adminId: string
) {
  try {
    const {
      email,
      name,
      role = 'USER',
      isActive = true,
      profile,
      settings,
    } = req.body;

    // Validate required fields
    if (!email || !name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email and name are required',
        timestamp: '2025-06-07 20:59:50',
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email',
        message: 'Please provide a valid email address',
        timestamp: '2025-06-07 20:59:50',
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
        timestamp: '2025-06-07 20:59:50',
      });
    }

    // Create user with profile and settings
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        role,
        isActive,
        createdBy: 'Vishalsnw',
        updatedBy: 'Vishalsnw',
        profile: {
          create: {
            displayName: profile?.displayName || name,
            bio: profile?.bio || '',
            location: profile?.location || '',
            website: profile?.website || '',
            visibility: profile?.visibility || 'private',
            createdBy: 'Vishalsnw',
            updatedBy: 'Vishalsnw',
          },
        },
        settings: {
          create: {
            emailNotifications: settings?.emailNotifications ?? true,
            theme: settings?.theme || 'light',
            language: settings?.language || 'en',
            createdBy: 'Vishalsnw',
            updatedBy: 'Vishalsnw',
          },
        },
      },
      include: {
        profile: true,
        settings: true,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: adminId,
        type: 'USER_CREATE',
        description: `Created new user: ${email}`,
        resourceId: user.id,
        createdBy: 'Vishalsnw',
        timestamp: '2025-06-07 20:59:50',
      },
    });

    return res.status(201).json({
      data: user,
      message: 'User created successfully',
      timestamp: '2025-06-07 20:59:50',
    });

  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create user',
      timestamp: '2025-06-07 20:59:50',
    });
  }
                                }
