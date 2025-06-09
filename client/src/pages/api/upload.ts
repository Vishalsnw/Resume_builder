// pages/api/upload.ts

import upload from '@/pages/api/upload';
import 500 from '@/pages/500';
import create from '@/pages/resumes/create';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../lib/prisma';
import { rateLimit } from '../../lib/rate-limit';
import { CloudStorage } from '../../lib/cloud-storage';

// Disable default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Rate limiting configuration
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
  maxRequests: 15, // 15 uploads per minute per IP
});

// File configuration
const FILE_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  types: {
    image: {
      mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      maxSize: 5 * 1024 * 1024, // 5MB
      dimensions: {
        maxWidth: 4096,
        maxHeight: 4096,
      },
    },
    document: {
      mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      maxSize: 10 * 1024 * 1024, // 10MB
    },
    asset: {
      mimeTypes: ['image/svg+xml', 'image/gif', 'application/json'],
      maxSize: 2 * 1024 * 1024, // 2MB
    },
  },
};

interface UploadedFile {
  filepath: string;
  originalFilename: string;
  mimetype: string;
  size: number;
}

interface UploadResult {
  url: string;
  key: string;
  metadata: {
    filename: string;
    mimetype: string;
    size: number;
    dimensions?: {
      width: number;
      height: number;
    };
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check method
    if (req.method !== 'POST') {
      return res.status(405).json({
        error: 'Method not allowed',
        message: 'Only POST requests are allowed',
        timestamp: '2025-06-07 21:05:54',
      });
    }

    // Apply rate limiting
    await limiter.check(res, 15, 'GENERAL_UPLOAD_RATE_LIMIT');

    // Get user session
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in to upload files',
        timestamp: '2025-06-07 21:05:54',
      });
    }

    // Parse form data
    const { files, fields } = await parseFormData(req);
    const file = files.file as UploadedFile;
    const {
      type = 'image',
      scope = 'private',
      category = 'general',
      compress = 'true',
    } = fields;

    // Validate file
    const validationError = await validateFile(file, type as string);
    if (validationError) {
      return res.status(400).json({
        error: 'Invalid file',
        message: validationError,
        timestamp: '2025-06-07 21:05:54',
      });
    }

    // Process and store file
    const uploadResult = await processAndStoreFile(
      file,
      {
        type: type as string,
        scope: scope as string,
        compress: compress === 'true',
        userId: session.user.id,
      }
    );

    // Create file record in database
    const fileRecord = await prisma.file.create({
      data: {
        userId: session.user.id,
        type: type as string,
        category: category as string,
        scope: scope as string,
        url: uploadResult.url,
        key: uploadResult.key,
        filename: uploadResult.metadata.filename,
        mimetype: uploadResult.metadata.mimetype,
        size: uploadResult.metadata.size,
        metadata: uploadResult.metadata,
        createdBy: 'Vishalsnw',
        updatedBy: 'Vishalsnw',
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        type: 'FILE_UPLOAD',
        description: `Uploaded ${type} file: ${file.originalFilename}`,
        resourceId: fileRecord.id,
        metadata: {
          fileType: type,
          scope,
          category,
          size: uploadResult.metadata.size,
        },
        createdBy: 'Vishalsnw',
        timestamp: '2025-06-07 21:05:54',
      },
    });

    return res.status(200).json({
      message: 'File uploaded successfully',
      data: {
        id: fileRecord.id,
        ...uploadResult,
      },
      timestamp: '2025-06-07 21:05:54',
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Log error
    await prisma.errorLog.create({
      data: {
        type: 'UPLOAD_ERROR',
        description: 'File upload failed',
        error: JSON.stringify(error),
        stackTrace: (error as Error).stack,
        createdBy: 'Vishalsnw',
        timestamp: '2025-06-07 21:05:54',
      },
    });

    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to upload file',
      timestamp: '2025-06-07 21:05:54',
    });
  }
}

async function parseFormData(req: NextApiRequest): Promise<{ files: any, fields: any }> {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      maxFileSize: FILE_CONFIG.maxSize,
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ files, fields });
    });
  });
}

async function validateFile(file: UploadedFile, type: string): Promise<string | null> {
  const config = FILE_CONFIG.types[type as keyof typeof FILE_CONFIG.types];
  
  if (!config) {
    return 'Invalid file type category';
  }

  if (!file) {
    return 'No file provided';
  }

  if (file.size > config.maxSize) {
    return `File size exceeds limit (${config.maxSize / (1024 * 1024)}MB)`;
  }

  if (!config.mimeTypes.includes(file.mimetype)) {
    return `Invalid file type. Allowed types: ${config.mimeTypes.join(', ')}`;
  }

  if (type === 'image') {
    try {
      const metadata = await sharp(file.filepath).metadata();
      if (metadata.width && metadata.width > config.dimensions.maxWidth ||
          metadata.height && metadata.height > config.dimensions.maxHeight) {
        return `Image dimensions exceed maximum allowed (${config.dimensions.maxWidth}x${config.dimensions.maxHeight})`;
      }
    } catch (error) {
      return 'Invalid image file';
    }
  }

  return null;
}

async function processAndStoreFile(
  file: UploadedFile,
  options: {
    type: string;
    scope: string;
    compress: boolean;
    userId: string;
  }
): Promise<UploadResult> {
  const fileId = uuidv4();
  const fileExt = path.extname(file.originalFilename || '');
  const fileName = `${fileId}${fileExt}`;
  const storageKey = `${options.scope}/${options.type}/${options.userId}/${fileName}`;

  if (options.type === 'image' && options.compress) {
    // Process image
    const image = sharp(file.filepath);
    const metadata = await image.metadata();

    const processed = await image
      .resize(2048, 2048, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer();

    // Upload to cloud storage
    const url = await CloudStorage.upload(storageKey, processed, {
      contentType: 'image/webp',
    });

    return {
      url,
      key: storageKey,
      metadata: {
        filename: fileName,
        mimetype: 'image/webp',
        size: processed.length,
        dimensions: {
          width: metadata.width || 0,
          height: metadata.height || 0,
        },
      },
    };
  } else {
    // Upload original file
    const fileBuffer = await fs.readFile(file.filepath);
    const url = await CloudStorage.upload(storageKey, fileBuffer, {
      contentType: file.mimetype,
    });

    return {
      url,
      key: storageKey,
      metadata: {
        filename: fileName,
        mimetype: file.mimetype,
        size: file.size,
      },
    };
  }
                  }
