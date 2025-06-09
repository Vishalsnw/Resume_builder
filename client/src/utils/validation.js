// client/src/utils/validation.js

/**
 * Validation Utilities
 * 
 * This file provides common validation functions for form inputs,
 * API payloads, and data validation throughout the application.
 */

// Common validation patterns
const PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,
  NAME: /^[a-zA-Z\s'-]{2,50}$/,
  PHONE: /^\+?[0-9]{10,15}$/,
  URL: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
};

/**
 * Validate an email address
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return PATTERNS.EMAIL.test(email);
}

/**
 * Validate a password
 * - At least 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 */
function validatePassword(password) {
  if (!password || typeof password !== 'string') return false;
  return PATTERNS.PASSWORD.test(password);
}

/**
 * Validate that two fields match (e.g., password confirmation)
 */
function validateMatch(value1, value2) {
  return value1 === value2;
}

/**
 * Validate a string has minimum length
 */
function validateMinLength(value, minLength) {
  if (!value || typeof value !== 'string') return false;
  return value.length >= minLength;
}

/**
 * Validate a string is not longer than maximum length
 */
function validateMaxLength(value, maxLength) {
  if (!value || typeof value !== 'string') return false;
  return value.length <= maxLength;
}

/**
 * Validate a value is not empty
 */
function validateRequired(value) {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (typeof value === 'object') {
    if (Array.isArray(value)) return value.length > 0;
    return Object.keys(value).length > 0;
  }
  return true;
}

/**
 * Validate user registration input
 */
function validateRegistration(data) {
  const errors = {};

  if (!validateRequired(data.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!validateRequired(data.password)) {
    errors.password = 'Password is required';
  } else if (!validatePassword(data.password)) {
    errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and numbers';
  }

  if (data.confirmPassword && !validateMatch(data.password, data.confirmPassword)) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (data.name && !validateMinLength(data.name, 2)) {
    errors.name = 'Name must be at least 2 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate login input
 */
function validateLogin(data) {
  const errors = {};

  if (!validateRequired(data.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!validateRequired(data.password)) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate reset password input
 */
function validateResetPassword(data) {
  const errors = {};

  if (!validateRequired(data.password)) {
    errors.password = 'New password is required';
  } else if (!validatePassword(data.password)) {
    errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and numbers';
  }

  if (!validateMatch(data.password, data.confirmPassword)) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate a URL
 */
function validateUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return PATTERNS.URL.test(url);
}

/**
 * Validate a phone number
 */
function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  return PATTERNS.PHONE.test(phone);
}

/**
 * Validate a date string (YYYY-MM-DD)
 */
function validateDate(date) {
  if (!date || typeof date !== 'string') return false;
  if (!PATTERNS.DATE.test(date)) return false;
  
  // Check if the date is valid
  const [year, month, day] = date.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  return dateObj.getFullYear() === year && 
         dateObj.getMonth() === month - 1 && 
         dateObj.getDate() === day;
}

// Export all validation functions
module.exports = {
  validateEmail,
  validatePassword,
  validateMatch,
  validateMinLength,
  validateMaxLength,
  validateRequired,
  validateRegistration,
  validateLogin,
  validateResetPassword,
  validateUrl,
  validatePhone,
  validateDate,
  PATTERNS
};
