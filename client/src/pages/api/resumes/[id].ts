// pages/api/resumes/[id].ts

// REMOVED INVALID IMPORT
// REMOVED INVALID IMPORT
import create from '@/pages/resumes/create';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../lib/prisma';
import { rateLimit } from '../../../lib/rate-limit';

// Rate limiting configuration
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
  maxRequests: 30, // 30 requests per minute per IP
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Apply rate limiting
    await limiter.check(res, 30, 'RESUME_API_RATE_LIMIT');

    // Get user session
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in to access this resource',
        timestamp: '2025-06-07 20:56:56',
      });
    }

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        error: 'Invalid resume ID',
        message: 'A valid resume ID is required',
        timestamp: '2025-06-07 20:56:56',
      });
    }

    switch (req.method) {
      case 'GET':
        return getResume(req, res, session.user.id, id);
      case 'PUT':
        return updateResume(req, res, session.user.id, id);
      case 'DELETE':
        return deleteResume(req, res, session.user.id, id);
      default:
        return res.status(405).json({
          error: 'Method not allowed',
          message: 'Supported methods: GET, PUT, DELETE',
          timestamp: '2025-06-07 20:56:56',
        });
    }
  } catch (error) {
    console.error('Resume API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      timestamp: '2025-06-07 20:56:56',
    });
  }
}

async function getResume(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  resumeId: string
) {
  try {
    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        OR: [
          { userId },
          { isPublic: true },
          { sharedWith: { some: { userId } } },
        ],
        deletedAt: null,
      },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take: 1,
        },
        sharedWith: true,
        comments: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!resume) {
      return res.status(404).json({
        error: 'Resume not found',
        message: 'The requested resume does not exist or you do not have access to it',
        timestamp: '2025-06-07 20:56:56',
      });
    }

    // Increment view count if viewer is not the owner
    if (resume.userId !== userId) {
      await prisma.resume.update({
        where: { id: resumeId },
        data: { views: { increment: 1 } },
      });

      // Log view activity
      await prisma.activityLog.create({
        data: {
          userId,
          type: 'RESUME_VIEW',
          description: `Viewed resume: ${resume.title}`,
          resourceId: resumeId,
          createdBy: 'Vishalsnw',
          timestamp: '2025-06-07 20:56:56',
        },
      });
    }

    return res.status(200).json({
      data: resume,
      timestamp: '2025-06-07 20:56:56',
    });

  } catch (error) {
    console.error('Get resume error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch resume',
      timestamp: '2025-06-07 20:56:56',
    });
  }
}

async function updateResume(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  resumeId: string
) {
  try {
    // Check resume ownership
    const existingResume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId,
        deletedAt: null,
      },
    });

    if (!existingResume) {
      return res.status(404).json({
        error: 'Resume not found',
        message: 'The requested resume does not exist or you do not have access to it',
        timestamp: '2025-06-07 20:56:56',
      });
    }

    const {
      title,
      content,
      isPublic,
      tags,
      status,
    } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Title is required',
        timestamp: '2025-06-07 20:56:56',
      });
    }

    // Create new version if content changed
    if (content && JSON.stringify(content) !== JSON.stringify(existingResume.content)) {
      await prisma.resumeVersion.create({
        data: {
          resumeId,
          content,
          version: (await prisma.resumeVersion.count({
            where: { resumeId },
          })) + 1,
          createdBy: 'Vishalsnw',
        },
      });
    }

    // Update resume
    const updatedResume = await prisma.resume.update({
      where: { id: resumeId },
      data: {
        title,
        content,
        isPublic,
        tags,
        status,
        updatedAt: new Date(),
        updatedBy: 'Vishalsnw',
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId,
        type: 'RESUME_UPDATE',
        description: `Updated resume: ${title}`,
        resourceId: resumeId,
        createdBy: 'Vishalsnw',
        timestamp: '2025-06-07 20:56:56',
      },
    });

    return res.status(200).json({
      data: updatedResume,
      message: 'Resume updated successfully',
      timestamp: '2025-06-07 20:56:56',
    });

  } catch (error) {
    console.error('Update resume error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update resume',
      timestamp: '2025-06-07 20:56:56',
    });
  }
}

async function deleteResume(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  resumeId: string
) {
  try {
    // Check resume ownership
    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId,
        deletedAt: null,
      },
    });

    if (!resume) {
      return res.status(404).json({
        error: 'Resume not found',
        message: 'The requested resume does not exist or you do not have access to it',
        timestamp: '2025-06-07 20:56:56',
      });
    }

    // Soft delete resume
    await prisma.resume.update({
      where: { id: resumeId },
      data: {
        deletedAt: new Date(),
        deletedBy: 'Vishalsnw',
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId,
        type: 'RESUME_DELETE',
        description: `Deleted resume: ${resume.title}`,
        resourceId: resumeId,
        createdBy: 'Vishalsnw',
        timestamp: '2025-06-07 20:56:56',
      },
    });

    return res.status(200).json({
      message: 'Resume deleted successfully',
      timestamp: '2025-06-07 20:56:56',
    });

  } catch (error) {
    console.error('Delete resume error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete resume',
      timestamp: '2025-06-07 20:56:56',
    });
  }
        }
