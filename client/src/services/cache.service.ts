// cache.service.ts

/**
 * Enum for cache storage types.
 */
import cache.service from '@/services/cache.service';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import cache.service from '@/services/cache.service';
export enum CacheStorageType {
  LocalStorage = 'localStorage',
  SessionStorage = 'sessionStorage',
  InMemory = 'inMemory',
}

/**
 * In-memory cache object (only for runtime use).
 */
const inMemoryCache: Record<string, any> = {};

/**
 * Sets a value in the cache.
 * @param key - The key to store the value under.
 * @param value - The value to store.
 * @param storageType - The type of storage to use (default: LocalStorage).
 */
export const setCache = (
  key: string,
  value: any,
  storageType: CacheStorageType = CacheStorageType.LocalStorage
): void => {
  const serializedValue = JSON.stringify(value);

  switch (storageType) {
    case CacheStorageType.LocalStorage:
      localStorage.setItem(key, serializedValue);
      break;
    case CacheStorageType.SessionStorage:
      sessionStorage.setItem(key, serializedValue);
      break;
    case CacheStorageType.InMemory:
      inMemoryCache[key] = value;
      break;
    default:
      console.warn(`Unsupported cache storage type: ${storageType}`);
  }
};

/**
 * Gets a value from the cache.
 * @param key - The key to retrieve the value for.
 * @param storageType - The type of storage to use (default: LocalStorage).
 * @returns The cached value, or null if not found.
 */
export const getCache = (
  key: string,
  storageType: CacheStorageType = CacheStorageType.LocalStorage
): any => {
  switch (storageType) {
    case CacheStorageType.LocalStorage:
      const localStorageValue = localStorage.getItem(key);
      return localStorageValue ? JSON.parse(localStorageValue) : null;
    case CacheStorageType.SessionStorage:
      const sessionStorageValue = sessionStorage.getItem(key);
      return sessionStorageValue ? JSON.parse(sessionStorageValue) : null;
    case CacheStorageType.InMemory:
      return inMemoryCache[key] || null;
    default:
      console.warn(`Unsupported cache storage type: ${storageType}`);
      return null;
  }
};

/**
 * Removes a value from the cache.
 * @param key - The key to remove.
 * @param storageType - The type of storage to use (default: LocalStorage).
 */
export const removeCache = (
  key: string,
  storageType: CacheStorageType = CacheStorageType.LocalStorage
): void => {
  switch (storageType) {
    case CacheStorageType.LocalStorage:
      localStorage.removeItem(key);
      break;
    case CacheStorageType.SessionStorage:
      sessionStorage.removeItem(key);
      break;
    case CacheStorageType.InMemory:
      delete inMemoryCache[key];
      break;
    default:
      console.warn(`Unsupported cache storage type: ${storageType}`);
  }
};

/**
 * Clears all values from the specified cache storage.
 * @param storageType - The type of storage to use (default: LocalStorage).
 */
export const clearCache = (
  storageType: CacheStorageType = CacheStorageType.LocalStorage
): void => {
  switch (storageType) {
    case CacheStorageType.LocalStorage:
      localStorage.clear();
      break;
    case CacheStorageType.SessionStorage:
      sessionStorage.clear();
      break;
    case CacheStorageType.InMemory:
      for (const key in inMemoryCache) {
        delete inMemoryCache[key];
      }
      break;
    default:
      console.warn(`Unsupported cache storage type: ${storageType}`);
  }
};
