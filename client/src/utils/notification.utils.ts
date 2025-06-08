// notification.utils.ts

/**
 * Displays a success notification.
 * @param message - The message to display.
 */
export function showSuccessNotification(message: string): void {
    console.log(`✅ SUCCESS: ${message}`);
    // Example: You can replace console.log with actual UI notification logic
    // e.g., using a library like Toastr, Notyf, or custom UI components
    // toastr.success(message);
}

/**
 * Displays an error notification.
 * @param message - The message to display.
 */
export function showErrorNotification(message: string): void {
    console.error(`❌ ERROR: ${message}`);
    // Example: Replace with actual UI notification logic
    // toastr.error(message);
}

/**
 * Displays an info notification.
 * @param message - The message to display.
 */
export function showInfoNotification(message: string): void {
    console.info(`ℹ️ INFO: ${message}`);
    // Example: Replace with actual UI notification logic
    // toastr.info(message);
}

/**
 * Displays a warning notification.
 * @param message - The message to display.
 */
export function showWarningNotification(message: string): void {
    console.warn(`⚠️ WARNING: ${message}`);
    // Example: Replace with actual UI notification logic
    // toastr.warning(message);
}

/**
 * Logs a notification to the console (for debugging purposes).
 * @param type - The type of notification (e.g., "success", "error", "info", "warning").
 * @param message - The notification message.
 */
export function logNotification(type: 'success' | 'error' | 'info' | 'warning', message: string): void {
    switch (type) {
        case 'success':
            showSuccessNotification(message);
            break;
        case 'error':
            showErrorNotification(message);
            break;
        case 'info':
            showInfoNotification(message);
            break;
        case 'warning':
            showWarningNotification(message);
            break;
        default:
            console.log(`🔔 NOTIFICATION: ${message}`);
    }
}
