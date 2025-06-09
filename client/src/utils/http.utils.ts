// http.utils.ts

/**
 * Performs a GET request to the specified URL and returns the JSON response.
 * @param url - The URL to send the GET request to.
 * @returns A promise resolving to the JSON response.
 */
import http.utils from '@/utils/http.utils';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import http.utils from '@/utils/http.utils';
export async function getRequest<T>(url: string): Promise<T> {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`GET request failed: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error during GET request:', error);
        throw error;
    }
}

/**
 * Performs a POST request to the specified URL with the provided data.
 * @param url - The URL to send the POST request to.
 * @param data - The data to send in the request body.
 * @returns A promise resolving to the JSON response.
 */
export async function postRequest<T>(url: string, data: Record<string, any>): Promise<T> {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`POST request failed: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error during POST request:', error);
        throw error;
    }
}

/**
 * Performs a PUT request to the specified URL with the provided data.
 * @param url - The URL to send the PUT request to.
 * @param data - The data to send in the request body.
 * @returns A promise resolving to the JSON response.
 */
export async function putRequest<T>(url: string, data: Record<string, any>): Promise<T> {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`PUT request failed: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error during PUT request:', error);
        throw error;
    }
}

/**
 * Performs a DELETE request to the specified URL.
 * @param url - The URL to send the DELETE request to.
 * @returns A promise resolving to the JSON response.
 */
export async function deleteRequest<T>(url: string): Promise<T> {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`DELETE request failed: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error during DELETE request:', error);
        throw error;
    }
}
