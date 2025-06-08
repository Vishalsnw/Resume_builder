// validation.utils.ts

/**
 * Validates if an email address is in the correct format.
 * @param email - The email address to validate.
 * @returns True if the email is valid, otherwise false.
 */
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates if a phone number is in a valid format.
 * @param phone - The phone number to validate.
 * @returns True if the phone number is valid, otherwise false.
 */
export function validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^[0-9]{10}$/; // Example: Matches 10-digit numbers
    return phoneRegex.test(phone);
}

/**
 * Validates if all required fields in an object are filled.
 * @param data - The object containing form data.
 * @param requiredFields - An array of required field names.
 * @returns An object with missing field names as keys and `true` as values.
 */
export function validateRequiredFields(data: object, requiredFields: string[]): Record<string, boolean> {
    const missingFields: Record<string, boolean> = {};
    requiredFields.forEach((field) => {
        if (!data[field]) {
            missingFields[field] = true;
        }
    });
    return missingFields;
}

/**
 * Validates if a string has a minimum length.
 * @param value - The string to validate.
 * @param minLength - The minimum length required.
 * @returns True if the string meets the minimum length, otherwise false.
 */
export function validateMinLength(value: string, minLength: number): boolean {
    return value.length >= minLength;
}

/**
 * Validates if a string has a maximum length.
 * @param value - The string to validate.
 * @param maxLength - The maximum length allowed.
 * @returns True if the string is within the maximum length, otherwise false.
 */
export function validateMaxLength(value: string, maxLength: number): boolean {
    return value.length <= maxLength;
}

/**
 * Checks if a given value is a valid URL.
 * @param url - The URL string to validate.
 * @returns True if the URL is valid, otherwise false.
 */
export function validateURL(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}
