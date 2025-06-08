import {
    showSuccessNotification,
    showErrorNotification,
    showInfoNotification,
    showWarningNotification,
    logNotification,
} from './notification.utils';

// Example Usage:
showSuccessNotification('Data saved successfully!');
showErrorNotification('Failed to save data!');
showInfoNotification('Your session is about to expire.');
showWarningNotification('Changes have not been saved.');

logNotification('success', 'This is a success log!');
logNotification('error', 'This is an error log!');
