import Cache from './cache.utils';

// Create a cache instance
const myCache = new Cache<string>();

// Set a value with a 5-second TTL
myCache.set('username', 'Vishalsnw', 5000);

// Get the value
console.log(myCache.get('username')); // Output: 'Vishalsnw'

// Check if the key exists
console.log(myCache.has('username')); // Output: true

// Wait for 6 seconds and check again
setTimeout(() => {
    console.log(myCache.get('username')); // Output: null (expired)
    console.log(myCache.has('username')); // Output: false
}, 6000);

// Clear the cache
myCache.clear();
