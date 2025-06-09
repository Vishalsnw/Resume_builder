// notification.service.ts

// Define the types of notifications
import notification.service from '@/services/notification.service';
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

// Interface for a notification
export interface Notification {
  message: string;
  type: NotificationType;
  duration?: number; // Duration in milliseconds (optional)
}

// Function to show a notification
export const showNotification = (notification: Notification): void => {
  const { message, type, duration = 3000 } = notification;

  // Example: Using the browser's alert as fallback (replace this with a library like Toastify or Material-UI Snackbar)
  switch (type) {
    case 'success':
      console.log(`✅ SUCCESS: ${message}`);
      break;
    case 'error':
      console.error(`❌ ERROR: ${message}`);
      break;
    case 'info':
      console.info(`ℹ️ INFO: ${message}`);
      break;
    case 'warning':
      console.warn(`⚠️ WARNING: ${message}`);
      break;
  }

  // Example for libraries like Toastify or Material-UI Snackbar (uncomment if using):
  // toast(message, {
  //   type: type,
  //   autoClose: duration,
  // });
};

/**
 * Utility function to show a success notification.
 * @param message - The notification message.
 */
export const showSuccessNotification = (message: string): void => {
  showNotification({ message, type: 'success' });
};

/**
 * Utility function to show an error notification.
 * @param message - The notification message.
 */
export const showErrorNotification = (message: string): void => {
  showNotification({ message, type: 'error' });
};

/**
 * Utility function to show an info notification.
 * @param message - The notification message.
 */
export const showInfoNotification = (message: string): void => {
  showNotification({ message, type: 'info' });
};

/**
 * Utility function to show a warning notification.
 * @param message - The notification message.
 */
export const showWarningNotification = (message: string): void => {
  showNotification({ message, type: 'warning' });
};
