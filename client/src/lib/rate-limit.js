// client/src/lib/rate-limit.js

/**
 * Simple Rate Limiting Utility
 * 
 * This file provides a basic rate limiting functionality for API routes
 * to prevent abuse and ensure fair usage of resources.
 */

// Store for tracking request counts (in-memory for development)
const requestStore = new Map();

// Default clean interval (1 hour)
const CLEAN_INTERVAL = 60 * 60 * 1000;

// Clean up old entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requestStore.entries()) {
    if (now - data.timestamp > data.windowMs) {
      requestStore.delete(key);
    }
  }
}, CLEAN_INTERVAL);

/**
 * Rate limit middleware factory
 * @param {Object} options - Configuration options
 * @param {number} options.limit - Maximum requests allowed in the window
 * @param {number} options.windowMs - Time window in milliseconds
 * @returns {Function} - Express/Next.js compatible middleware
 */
function rateLimit(options = {}) {
  const {
    limit = 5,         // Default: 5 requests
    windowMs = 60000,  // Default: 1 minute
    message = 'Too many requests, please try again later.',
    statusCode = 429,
  } = options;

  return async function rateLimitMiddleware(req, res, next) {
    // For API routes in Next.js
    if (!next && typeof res.status === 'function') {
      try {
        const result = await checkRateLimit(req, {limit, windowMs, message, statusCode});
        if (result.blocked) {
          return res.status(statusCode).json({ error: message });
        }
        return true; // Allow request to proceed
      } catch (error) {
        console.error('Rate limiting error:', error);
        return true; // On error, allow the request rather than blocking legitimate users
      }
    }
    
    // For Express-style middleware
    try {
      const result = await checkRateLimit(req, {limit, windowMs, message, statusCode});
      if (result.blocked) {
        return res.status(statusCode).json({ error: message });
      }
      return next();
    } catch (error) {
      console.error('Rate limiting error:', error);
      return next(); // On error, allow the request rather than blocking legitimate users
    }
  };
}

/**
 * Check if a request should be rate limited
 */
async function checkRateLimit(req, options) {
  const { limit, windowMs } = options;
  
  // Create a key based on IP or other identifier
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  const route = req.url || 'unknown-route';
  const key = `${ip}:${route}`;
  
  const now = Date.now();
  let requestData = requestStore.get(key);
  
  if (!requestData) {
    requestData = {
      count: 0,
      timestamp: now,
      windowMs,
    };
    requestStore.set(key, requestData);
  } else if (now - requestData.timestamp > windowMs) {
    // Reset counter if the time window has passed
    requestData.count = 0;
    requestData.timestamp = now;
  }
  
  // Increment the counter
  requestData.count += 1;
  
  // Determine if request should be blocked
  const blocked = requestData.count > limit;
  
  return {
    blocked,
    current: requestData.count,
    limit,
    remaining: Math.max(0, limit - requestData.count),
  };
}

// Export the main middleware and helper function
module.exports = {
  rateLimit,
  checkRateLimit,
};
