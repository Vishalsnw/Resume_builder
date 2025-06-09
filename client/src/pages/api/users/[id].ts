// pages/api/users/[id].ts

import 404 from '@/pages/404';
import 500 from '@/pages/500';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import settings from '@/pages/profile/settings';
import create from '@/pages/resumes/create';
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
    await limiter.check(res, 20, 'USER_API_RATE_LIMIT');

    // Get user session
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in to access this resource',
        timestamp: '2025-06-07 21:02:26',
      });
    }

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        error: 'Invalid user ID',
        message: 'A valid user ID is required',
        timestamp: '2025-06-07 21:02:26',
      });
    }

    // Check permissions
    const isAdmin = session.user.role === 'ADMIN';
    const isSelfOperation = session.user.id === id;

    if (!isAdmin && !isSelfOperation) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to perform this action',
        timestamp: '2025-06-07 21:02:26',
      });
    }

    switch (req.method) {
      case 'GET':
        return getUser(req, res, id, isAdmin);
      case 'PUT':
        return updateUser(req, res, id, isAdmin, session.user.id);
      case 'DELETE':
        return deleteUser(req, res, id, isAdmin, session.user.id);
      default:
        return res.status(405).json({
          error: 'Method not allowed',
          message: 'Supported methods: GET, PUT, DELETE',
          timestamp: '2025-06-07 21:02:26',
        });
    }
  } catch (error) {
    console.error('User API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      timestamp: '2025-06-07 21:02:26',
    });
  }
}

async function getUser(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  isAdmin: boolean
) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: isAdmin, // Only include email for admins
        role: isAdmin,
        isActive: isAdmin,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            displayName: true,
            bio: true,
            location: true,
            website: true,
            visibility: true,
            avatar: true,
            skills: true,
            experience: true,
            education: true,
          },
        },
        settings: isAdmin ? true : false,
        _count: {
          select: {
            resumes: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist',
        timestamp: '2025-06-07 21:02:26',
      });
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId,
        type: 'USER_VIEW',
        description: `Viewed user profile: ${user.name}`,
        resourceId: userId,
        createdBy: 'Vishalsnw',
        timestamp: '2025-06-07 21:02:26',
      },
    });

    return res.status(200).json({
      data: user,
      timestamp: '2025-06-07 21:02:26',
    });

  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch user',
      timestamp: '2025-06-07 21:02:26',
    });
  }
}

async function updateUser(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  isAdmin: boolean,
  requesterId: string
) {
  try {
    const {
      email,
      name,
      role,
      isActive,
      profile,
      settings,
    } = req.body;

    // Validate email if provided
    if (email && !validateEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email',
        message: 'Please provide a valid email address',
        timestamp: '2025-06-07 21:02:26',
      });
    }

    // Check if email is already taken
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: email.toLowerCase(),
          id: { not: userId },
          deletedAt: null,
        },
      });

      if (existingUser) {
        return res.status(409).json({
          error: 'Email already taken',
          message: 'This email address is already in use',
          timestamp: '2025-06-07 21:02:26',
        });
      }
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
      updatedBy: 'Vishalsnw',
    };

    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (isAdmin && role) updateData.role = role;
    if (isAdmin && typeof isActive === 'boolean') updateData.isActive = isActive;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        profile: profile ? {
          update: {
            ...profile,
            updatedAt: new Date(),
            updatedBy: 'Vishalsnw',
          },
        } : undefined,
        settings: settings && isAdmin ? {
          update: {
            ...settings,
            updatedAt: new Date(),
            updatedBy: 'Vishalsnw',
          },
        } : undefined,
      },
      include: {
        profile: true,
        settings: isAdmin,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: requesterId,
        type: 'USER_UPDATE',
        description: `Updated user: ${updatedUser.name}`,
        resourceId: userId,
        createdBy: 'Vishalsnw',
        timestamp: '2025-06-07 21:02:26',
      },
    });

    return res.status(200).json({
      data: updatedUser,
      message: 'User updated successfully',
      timestamp: '2025-06-07 21:02:26',
    });

  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update user',
      timestamp: '2025-06-07 21:02:26',
    });
  }
}

async function deleteUser(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  isAdmin: boolean,
  requesterId: string
) {
  try {
    // Get user to be deleted
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist',
        timestamp: '2025-06-07 21:02:26',
      });
    }

    // Soft delete user and related data
    await prisma.$transaction([
      // Soft delete user
      prisma.user.update({
        where: { id: userId },
        data: {
          deletedAt: new Date(),
          deletedBy: 'Vishalsnw',
          isActive: false,
        },
      }),
      // Soft delete resumes
      prisma.resume.updateMany({
        where: { userId },
        data: {
          deletedAt: new Date(),
          deletedBy: 'Vishalsnw',
        },
      }),
      // Log activity
      prisma.activityLog.create({
        data: {
          userId: requesterId,
          type: 'USER_DELETE',
          description: `Deleted user: ${user.name}`,
          resourceId: userId,
          createdBy: 'Vishalsnw',
          timestamp: '2025-06-07 21:02:26',
        },
      }),
    ]);

    return res.status(200).json({
      message: 'User deleted successfully',
      timestamp: '2025-06-07 21:02:26',
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete user',
      timestamp: '2025-06-07 21:02:26',
    });
  }
}
