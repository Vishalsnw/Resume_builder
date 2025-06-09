// storage.utils.ts

/**
 * Saves a value to localStorage.
 * @param key - The key under which the value will be stored.
 * @param value - The value to store (can be a string, object, or array).
 */
import storage.utils from '@/utils/storage.utils';
export function saveToLocalStorage(key: string, value: any): void {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

/**
 * Retrieves a value from localStorage.
 * @param key - The key under which the value is stored.
 * @returns The parsed value, or `null` if the key does not exist.
 */
export function getFromLocalStorage<T>(key: string): T | null {
    try {
        const serializedValue = localStorage.getItem(key);
        return serializedValue ? JSON.parse(serializedValue) : null;
    } catch (error) {
        console.error('Error retrieving from localStorage:', error);
        return null;
    }
}

/**
 * Removes a key and its associated value from localStorage.
 * @param key - The key to remove.
 */
export function removeFromLocalStorage(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
}

/**
 * Clears all data from localStorage.
 */
export function clearLocalStorage(): void {
    try {
        localStorage.clear();
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
}

/**
 * Saves a value to sessionStorage.
 * @param key - The key under which the value will be stored.
 * @param value - The value to store (can be a string, object, or array).
 */
export function saveToSessionStorage(key: string, value: any): void {
    try {
        const serializedValue = JSON.stringify(value);
        sessionStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error('Error saving to sessionStorage:', error);
    }
}

/**
 * Retrieves a value from sessionStorage.
 * @param key - The key under which the value is stored.
 * @returns The parsed value, or `null` if the key does not exist.
 */
export function getFromSessionStorage<T>(key: string): T | null {
    try {
        const serializedValue = sessionStorage.getItem(key);
        return serializedValue ? JSON.parse(serializedValue) : null;
    } catch (error) {
        console.error('Error retrieving from sessionStorage:', error);
        return null;
    }
}

/**
 * Removes a key and its associated value from sessionStorage.
 * @param key - The key to remove.
 */
export function removeFromSessionStorage(key: string): void {
    try {
        sessionStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from sessionStorage:', error);
    }
}

/**
 * Clears all data from sessionStorage.
 */
export function clearSessionStorage(): void {
    try {
        sessionStorage.clear();
    } catch (error) {
        console.error('Error clearing sessionStorage:', error);
    }
}
