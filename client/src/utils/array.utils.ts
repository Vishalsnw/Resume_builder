// array.utils.ts

/**
 * Removes duplicate values from an array.
 * @param arr - The array to remove duplicates from.
 * @returns A new array with unique values.
 */
import [id] from '@/pages/resumes/edit/[id]';
import array.utils from '@/utils/array.utils';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import array.utils from '@/utils/array.utils';
export function removeDuplicates<T>(arr: T[]): T[] {
    return Array.from(new Set(arr));
}

/**
 * Sorts an array of objects by a specific key.
 * @param arr - The array to sort.
 * @param key - The key to sort by.
 * @param order - The order of sorting: 'asc' for ascending, 'desc' for descending. Default is 'asc'.
 * @returns A new sorted array.
 */
export function sortArray<T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    return [...arr].sort((a, b) => {
        if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

/**
 * Finds the maximum value in an array of numbers.
 * @param arr - The array of numbers.
 * @returns The maximum number in the array, or `undefined` if the array is empty.
 */
export function findMax(arr: number[]): number | undefined {
    return arr.length > 0 ? Math.max(...arr) : undefined;
}

/**
 * Finds the minimum value in an array of numbers.
 * @param arr - The array of numbers.
 * @returns The minimum number in the array, or `undefined` if the array is empty.
 */
export function findMin(arr: number[]): number | undefined {
    return arr.length > 0 ? Math.min(...arr) : undefined;
}

/**
 * Groups an array of objects by a specific key.
 * @param arr - The array to group.
 * @param key - The key to group by.
 * @returns An object where the keys are the grouped values and the values are arrays of objects.
 */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
    return arr.reduce((result, item) => {
        const groupKey = String(item[key]);
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {} as Record<string, T[]>);
}

/**
 * Shuffles an array randomly.
 * @param arr - The array to shuffle.
 * @returns A new array with the elements shuffled.
 */
export function shuffleArray<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

/**
 * Splits an array into chunks of a specified size.
 * @param arr - The array to split.
 * @param chunkSize - The size of each chunk.
 * @returns A new array containing smaller arrays (chunks).
 */
export function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
    if (chunkSize <= 0) throw new Error('Chunk size must be greater than 0');
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        result.push(arr.slice(i, i + chunkSize));
    }
    return result;
                      }
