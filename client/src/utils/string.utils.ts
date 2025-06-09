// string.utils.ts

/**
 * Capitalizes the first letter of a string.
 * @param str - The string to capitalize.
 * @returns The string with the first letter capitalized.
 */
import string.utils from '@/utils/string.utils';
export function capitalizeFirstLetter(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncates a string to the specified maximum length and adds "..." if truncated.
 * @param str - The string to truncate.
 * @param maxLength - The maximum length allowed.
 * @returns The truncated string with "..." appended if needed.
 */
export function truncateString(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + '...';
}

/**
 * Converts a string to kebab-case (lowercase words separated by hyphens).
 * @param str - The string to convert.
 * @returns The kebab-case version of the string.
 */
export function toKebabCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2') // Add hyphen between camelCase words
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .toLowerCase();
}

/**
 * Converts a string to snake_case (lowercase words separated by underscores).
 * @param str - The string to convert.
 * @returns The snake_case version of the string.
 */
export function toSnakeCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, '$1_$2') // Add underscore between camelCase words
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .toLowerCase();
}

/**
 * Checks if a string is empty or contains only whitespace.
 * @param str - The string to check.
 * @returns True if the string is empty or whitespace, otherwise false.
 */
export function isEmptyOrWhitespace(str: string): boolean {
    return str.trim().length === 0;
}

/**
 * Reverses a given string.
 * @param str - The string to reverse.
 * @returns The reversed string.
 */
export function reverseString(str: string): string {
    return str.split('').reverse().join('');
}

/**
 * Counts the number of words in a given string.
 * @param str - The string to count words in.
 * @returns The word count as a number.
 */
export function countWords(str: string): number {
    return str.trim().split(/\s+/).length;
}
