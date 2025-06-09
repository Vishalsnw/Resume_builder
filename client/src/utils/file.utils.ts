// file.utils.ts

/**
 * Reads a file as text.
 * @param file - The file to read.
 * @returns A promise that resolves to the file content as a string.
 */
import file.utils from '@/utils/file.utils';
export function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result as string);
        };

        reader.onerror = () => {
            reject(new Error('Error reading file as text.'));
        };

        reader.readAsText(file);
    });
}

/**
 * Reads a file as a Data URL (e.g., for images).
 * @param file - The file to read.
 * @returns A promise that resolves to the file content as a Data URL string.
 */
export function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result as string);
        };

        reader.onerror = () => {
            reject(new Error('Error reading file as Data URL.'));
        };

        reader.readAsDataURL(file);
    });
}

/**
 * Downloads a file with the specified content and filename.
 * @param content - The content of the file.
 * @param filename - The filename for the downloaded file.
 * @param type - The MIME type of the file (default: 'text/plain').
 */
export function downloadFile(content: string, filename: string, type: string = 'text/plain'): void {
    const blob = new Blob([content], { type });
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    URL.revokeObjectURL(link.href); // Clean up the object URL
}

/**
 * Converts a file size in bytes to a human-readable string.
 * @param size - The file size in bytes.
 * @returns A human-readable file size string (e.g., "1.2 MB").
 */
export function formatFileSize(size: number): string {
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    let index = 0;

    while (size >= 1024 && index < units.length - 1) {
        size /= 1024;
        index++;
    }

    return `${size.toFixed(2)} ${units[index]}`;
}

/**
 * Validates a file's size and type.
 * @param file - The file to validate.
 * @param maxSize - The maximum allowed size in bytes.
 * @param allowedTypes - An array of allowed MIME types.
 * @returns An object indicating if the file is valid and any error message.
 */
export function validateFile(
    file: File,
    maxSize: number,
    allowedTypes: string[]
): { isValid: boolean; errorMessage: string | null } {
    if (file.size > maxSize) {
        return { isValid: false, errorMessage: `File size exceeds the maximum limit of ${formatFileSize(maxSize)}.` };
    }

    if (!allowedTypes.includes(file.type)) {
        return { isValid: false, errorMessage: `File type "${file.type}" is not allowed.` };
    }

    return { isValid: true, errorMessage: null };
                             }
