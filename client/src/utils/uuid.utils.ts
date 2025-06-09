// uuid.utils.ts

/**
 * Generates a Version 4 UUID (Random UUID).
 * @returns A randomly generated UUID string in the format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx.
 */
import uuid.utils from '@/utils/uuid.utils';
export function generateUUIDv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
        const random = Math.random() * 16 | 0; // Generate a random number between 0 and 15.
        const value = char === 'x' ? random : (random & 0x3 | 0x8); // Use 4 for the version and adjust for the variant.
        return value.toString(16); // Convert to hexadecimal.
    });
}

/**
 * Validates if a given string is a valid UUID (Version 4).
 * @param uuid - The UUID string to validate.
 * @returns `true` if the string is a valid UUID, otherwise `false`.
 */
export function isValidUUIDv4(uuid: string): boolean {
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidV4Regex.test(uuid);
}

/**
 * Generates a list of Version 4 UUIDs.
 * @param count - The number of UUIDs to generate.
 * @returns An array of randomly generated UUID strings.
 */
export function generateUUIDList(count: number): string[] {
    if (count <= 0) {
        throw new Error('Count must be a positive integer.');
    }

    const uuids: string[] = [];
    for (let i = 0; i < count; i++) {
        uuids.push(generateUUIDv4());
    }
    return uuids;
}
