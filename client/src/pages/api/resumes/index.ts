// pages/api/resumes/index.ts

import index from '@/pages/help/index';
import 500 from '@/pages/500';
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
    await limiter.check(res, 30, 'RESUMES_API_RATE_LIMIT');

    // Get user session
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in to access this resource',
        timestamp: '2025-06-07 20:55:00',
      });
    }

    switch (req.method) {
      case 'GET':
        return getResumes(req, res, session.user.id);
      case 'POST':
        return createResume(req, res, session.user.id);
      default:
        return res.status(405).json({
          error: 'Method not allowed',
          message: 'Supported methods: GET, POST',
          timestamp: '2025-06-07 20:55:00',
        });
    }
  } catch (error) {
    console.error('Resumes API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      timestamp: '2025-06-07 20:55:00',
    });
  }
}

async function getResumes(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const {
      page = '1',
      limit = '10',
      sort = 'updatedAt',
      order = 'desc',
      status,
      search,
    } = req.query;

    const pageNumber = parseInt(page as string);
    const pageSize = parseInt(limit as string);

    // Validate pagination parameters
    if (isNaN(pageNumber) || isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
      return res.status(400).json({
        error: 'Invalid pagination parameters',
        message: 'Page and limit must be positive integers',
        timestamp: '2025-06-07 20:55:00',
      });
    }

    // Build where clause
    const where: any = {
      userId,
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { tags: { has: search as string } },
      ];
    }

    // Get total count
    const total = await prisma.resume.count({ where });

    // Get resumes
    const resumes = await prisma.resume.findMany({
      where,
      select: {
        id: true,
        title: true,
        template: true,
        status: true,
        tags: true,
        isPublic: true,
        views: true,
        downloads: true,
        lastModified: true,
        createdAt: true,
        updatedAt: true,
        thumbnail: true,
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
        type: 'RESUME_LIST',
        description: 'User viewed resume list',
        createdBy: 'Vishalsnw',
        timestamp: '2025-06-07 20:55:00',
      },
    });

    return res.status(200).json({
      data: resumes,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
      timestamp: '2025-06-07 20:55:00',
    });

  } catch (error) {
    console.error('Get resumes error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch resumes',
      timestamp: '2025-06-07 20:55:00',
    });
  }
}

async function createResume(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  try {
    const {
      title,
      template,
      content,
      isPublic = false,
      tags = [],
    } = req.body;

    // Validate required fields
    if (!title || !template) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Title and template are required',
        timestamp: '2025-06-07 20:55:00',
      });
    }

    // Check user's resume limit
    const userResumeCount = await prisma.resume.count({
      where: {
        userId,
        deletedAt: null,
      },
    });

    const MAX_FREE_RESUMES = 3;
    const userSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active',
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!userSubscription && userResumeCount >= MAX_FREE_RESUMES) {
      return res.status(403).json({
        error: 'Resume limit reached',
        message: 'Free users can only create up to 3 resumes. Please upgrade to create more.',
        timestamp: '2025-06-07 20:55:00',
      });
    }

    // Create resume
    const resume = await prisma.resume.create({
      data: {
        title,
        template,
        content,
        isPublic,
        tags,
        status: 'draft',
        userId,
        createdBy: 'Vishalsnw',
        updatedBy: 'Vishalsnw',
      },
    });

    // Create initial version
    await prisma.resumeVersion.create({
      data: {
        resumeId: resume.id,
        content,
        version: 1,
        createdBy: 'Vishalsnw',
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId,
        type: 'RESUME_CREATE',
        description: `Created new resume: ${title}`,
        resourceId: resume.id,
        createdBy: 'Vishalsnw',
        timestamp: '2025-06-07 20:55:00',
      },
    });

    return res.status(201).json({
      data: resume,
      message: 'Resume created successfully',
      timestamp: '2025-06-07 20:55:00',
    });

  } catch (error) {
    console.error('Create resume error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create resume',
      timestamp: '2025-06-07 20:55:00',
    });
  }
        }
