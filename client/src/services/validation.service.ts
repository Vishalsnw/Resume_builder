// validation.service.ts

/**
 * Validates whether a string is a valid email address.
 * @param email - The email string to validate.
 * @returns True if valid, otherwise false.
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates whether a string is a valid phone number.
 * @param phone - The phone number string to validate.
 * @returns True if valid, otherwise false.
 */
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format for international numbers
  return phoneRegex.test(phone);
};

/**
 * Validates whether a field is not empty.
 * @param value - The value to check.
 * @returns True if not empty, otherwise false.
 */
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validates whether a string meets minimum and maximum length requirements.
 * @param value - The string to validate.
 * @param minLength - The minimum length required.
 * @param maxLength - The maximum length allowed (optional).
 * @returns True if valid, otherwise false.
 */
export const validateLength = (value: string, minLength: number, maxLength?: number): boolean => {
  if (value.length < minLength) return false;
  if (maxLength !== undefined && value.length > maxLength) return false;
  return true;
};

/**
 * Validates whether a string matches a specific pattern.
 * @param value - The string to validate.
 * @param regex - The regex pattern to match.
 * @returns True if it matches the pattern, otherwise false.
 */
export const validatePattern = (value: string, regex: RegExp): boolean => {
  return regex.test(value);
};

/**
 * Validates whether two strings (e.g., password and confirm password) match.
 * @param value1 - The first string to compare.
 * @param value2 - The second string to compare.
 * @returns True if they match, otherwise false.
 */
export const validateMatch = (value1: string, value2: string): boolean => {
  return value1 === value2;
};

/**
 * Validates whether a number is within a specific range.
 * @param number - The number to validate.
 * @param min - The minimum value allowed.
 * @param max - The maximum value allowed.
 * @returns True if valid, otherwise false.
 */
export const validateNumberRange = (number: number, min: number, max: number): boolean => {
  return number >= min && number <= max;
};
