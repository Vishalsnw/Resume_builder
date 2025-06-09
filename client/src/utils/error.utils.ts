// error.utils.ts

/**
 * Logs an error message to the console.
 * @param error - The error to log.
 * @param context - Optional context or additional information about where the error occurred.
 */
import error.utils from '@/utils/error.utils';
export function logError(error: unknown, context?: string): void {
    console.error(`[Error] ${context ? `[${context}] ` : ''}`, error);
}

/**
 * Formats an error object into a user-friendly message.
 * @param error - The error to format (can be a string, Error object, or unknown).
 * @returns A formatted error message string.
 */
export function formatErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    } else if (typeof error === 'string') {
        return error;
    } else {
        return 'An unknown error occurred.';
    }
}

/**
 * Handles an error by logging it and optionally showing a user-friendly message.
 * @param error - The error to handle.
 * @param showMessage - Optional callback to display a user-friendly error message (e.g., UI alert).
 * @param context - Optional context or additional information about where the error occurred.
 */
export function handleError(
    error: unknown,
    showMessage?: (message: string) => void,
    context?: string
): void {
    // Log the error for debugging
    logError(error, context);

    // Format the error message for the user
    const userMessage = formatErrorMessage(error);

    // Show the user-friendly message if a callback is provided
    if (showMessage) {
        showMessage(userMessage);
    }
}

/**
 * Creates a custom error with a specific message and optional metadata.
 * @param message - The error message.
 * @param metadata - Optional metadata to attach to the error.
 * @returns A new Error object with additional metadata.
 */
export function createCustomError(message: string, metadata?: Record<string, any>): Error {
    const error = new Error(message);
    if (metadata) {
        (error as any).metadata = metadata;
    }
    return error;
}

/**
 * Extracts metadata from a custom error if available.
 * @param error - The error to extract metadata from.
 * @returns The metadata object or `null` if no metadata is found.
 */
export function extractErrorMetadata(error: unknown): Record<string, any> | null {
    if (error instanceof Error && 'metadata' in error) {
        return (error as any).metadata || null;
    }
    return null;
}
