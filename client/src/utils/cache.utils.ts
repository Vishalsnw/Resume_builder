// cache.utils.ts

/**
 * A simple in-memory cache implementation.
 */
import cache.utils from '@/utils/cache.utils';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import cache.utils from '@/utils/cache.utils';
class Cache<T> {
    private store: Map<string, { value: T; expiry: number | null }> = new Map();

    /**
     * Sets a value in the cache with an optional expiry time.
     * @param key - The key to store the value under.
     * @param value - The value to store.
     * @param ttl - Time-to-live in milliseconds (optional). If not provided, the value will not expire.
     */
    set(key: string, value: T, ttl?: number): void {
        const expiry = ttl ? Date.now() + ttl : null;
        this.store.set(key, { value, expiry });
    }

    /**
     * Gets a value from the cache.
     * @param key - The key of the value to retrieve.
     * @returns The cached value, or `null` if the key does not exist or has expired.
     */
    get(key: string): T | null {
        const item = this.store.get(key);

        if (!item) {
            return null;
        }

        if (item.expiry !== null && Date.now() > item.expiry) {
            this.store.delete(key); // Remove expired item
            return null;
        }

        return item.value;
    }

    /**
     * Deletes a value from the cache.
     * @param key - The key of the value to delete.
     */
    delete(key: string): void {
        this.store.delete(key);
    }

    /**
     * Clears all entries from the cache.
     */
    clear(): void {
        this.store.clear();
    }

    /**
     * Checks if a key exists in the cache and is not expired.
     * @param key - The key to check.
     * @returns `true` if the key exists and is not expired, otherwise `false`.
     */
    has(key: string): boolean {
        const item = this.store.get(key);

        if (!item) {
            return false;
        }

        if (item.expiry !== null && Date.now() > item.expiry) {
            this.store.delete(key); // Remove expired item
            return false;
        }

        return true;
    }
}

export default Cache;
