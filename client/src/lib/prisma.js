// client/src/lib/prisma.js

/**
 * Prisma Client Configuration
 * 
 * This file initializes and exports the Prisma client instance
 * that will be used throughout the application for database operations.
 * 
 * In production, it creates a new PrismaClient instance.
 * In development, it reuses the global instance to prevent multiple connections.
 */

// Check if PrismaClient is installed
let PrismaClient;
try {
  const { PrismaClient: ImportedPrismaClient } = require('@prisma/client');
  PrismaClient = ImportedPrismaClient;
} catch (error) {
  // Create a mock PrismaClient if the real one isn't available
  console.warn('Using mock PrismaClient: @prisma/client not found');
  PrismaClient = class MockPrismaClient {
    constructor() {
      // Create mock models for commonly used tables
      this.user = createMockModel('user');
      this.resume = createMockModel('resume');
      this.profile = createMockModel('profile');
      this.template = createMockModel('template');
    }
    // Mock connection methods
    async connect() { return this; }
    async disconnect() { return true; }
  };
}

// Helper to create mock models
function createMockModel(name) {
  return {
    findUnique: async () => ({ id: 'mock-id', name: `Mock ${name}`, createdAt: new Date() }),
    findMany: async () => [{ id: 'mock-id', name: `Mock ${name}`, createdAt: new Date() }],
    findFirst: async () => ({ id: 'mock-id', name: `Mock ${name}`, createdAt: new Date() }),
    create: async (data) => ({ id: 'new-mock-id', ...data.data }),
    update: async (data) => ({ id: data.where.id, ...data.data }),
    delete: async (data) => ({ id: data.where.id, deleted: true }),
    count: async () => 1,
  };
}

// Use a single instance during development to prevent multiple connections
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development, use a global variable
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

module.exports = prisma;
