// logger.service.ts

// Define log levels
export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * Logs a message with the specified log level.
 * @param level - The log level (info, warn, error, debug).
 * @param message - The message to log.
 * @param additionalData - Optional additional data to log (e.g., objects, arrays).
 */
export const log = (level: LogLevel, message: string, additionalData?: any): void => {
  const timestamp = new Date().toISOString();
  
  switch (level) {
    case 'info':
      console.info(`[INFO] [${timestamp}] ${message}`, additionalData || '');
      break;
    case 'warn':
      console.warn(`[WARN] [${timestamp}] ${message}`, additionalData || '');
      break;
    case 'error':
      console.error(`[ERROR] [${timestamp}] ${message}`, additionalData || '');
      break;
    case 'debug':
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[DEBUG] [${timestamp}] ${message}`, additionalData || '');
      }
      break;
    default:
      console.log(`[LOG] [${timestamp}] ${message}`, additionalData || '');
      break;
  }
};

/**
 * Logs an info message.
 * @param message - The message to log.
 * @param additionalData - Optional additional data to log.
 */
export const logInfo = (message: string, additionalData?: any): void => {
  log('info', message, additionalData);
};

/**
 * Logs a warning message.
 * @param message - The message to log.
 * @param additionalData - Optional additional data to log.
 */
export const logWarn = (message: string, additionalData?: any): void => {
  log('warn', message, additionalData);
};

/**
 * Logs an error message.
 * @param message - The message to log.
 * @param additionalData - Optional additional data to log.
 */
export const logError = (message: string, additionalData?: any): void => {
  log('error', message, additionalData);
};

/**
 * Logs a debug message (only in development mode).
 * @param message - The message to log.
 * @param additionalData - Optional additional data to log.
 */
export const logDebug = (message: string, additionalData?: any): void => {
  log('debug', message, additionalData);
};
