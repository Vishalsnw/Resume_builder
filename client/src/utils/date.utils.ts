// date.utils.ts

/**
 * Formats a date object into a readable string.
 * @param date - The date to be formatted.
 * @param options - Optional formatting options.
 * @returns A formatted date string.
 */
import date.utils from '@/utils/date.utils';
export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(date);
}

/**
 * Gets the current year.
 * @returns The current year as a number.
 */
export function getCurrentYear(): number {
    return new Date().getFullYear();
}

/**
 * Calculates the difference in days between two dates.
 * @param date1 - The first date.
 * @param date2 - The second date.
 * @returns The difference in days between the two dates.
 */
export function getDaysDifference(date1: Date, date2: Date): number {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

/**
 * Checks if a given date is today.
 * @param date - The date to check.
 * @returns True if the date is today, otherwise false.
 */
export function isToday(date: Date): boolean {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
}

/**
 * Adds a specified number of days to a date.
 * @param date - The date to which days will be added.
 * @param days - The number of days to add.
 * @returns A new Date object with the days added.
 */
export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
