// math.utils.ts

/**
 * Calculates the factorial of a number.
 * @param num - The number to calculate the factorial for.
 * @returns The factorial of the number.
 */
import math.utils from '@/utils/math.utils';
export function factorial(num: number): number {
    if (num < 0) {
        throw new Error('Factorial is not defined for negative numbers.');
    }
    if (num === 0 || num === 1) {
        return 1;
    }
    return num * factorial(num - 1);
}

/**
 * Calculates the greatest common divisor (GCD) of two numbers using the Euclidean algorithm.
 * @param a - The first number.
 * @param b - The second number.
 * @returns The GCD of the two numbers.
 */
export function gcd(a: number, b: number): number {
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return Math.abs(a);
}

/**
 * Calculates the least common multiple (LCM) of two numbers.
 * @param a - The first number.
 * @param b - The second number.
 * @returns The LCM of the two numbers.
 */
export function lcm(a: number, b: number): number {
    if (a === 0 || b === 0) {
        return 0;
    }
    return Math.abs(a * b) / gcd(a, b);
}

/**
 * Checks if a number is a prime number.
 * @param num - The number to check.
 * @returns `true` if the number is prime, otherwise `false`.
 */
export function isPrime(num: number): boolean {
    if (num <= 1) {
        return false;
    }
    if (num <= 3) {
        return true;
    }
    if (num % 2 === 0 || num % 3 === 0) {
        return false;
    }
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) {
            return false;
        }
    }
    return true;
}

/**
 * Generates a random number between a given minimum and maximum value (inclusive).
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns A random number between `min` and `max`.
 */
export function randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calculates the nth Fibonacci number.
 * @param n - The position in the Fibonacci sequence (0-based index).
 * @returns The nth Fibonacci number.
 */
export function fibonacci(n: number): number {
    if (n < 0) {
        throw new Error('Fibonacci is not defined for negative numbers.');
    }
    const fib = [0, 1];
    for (let i = 2; i <= n; i++) {
        fib[i] = fib[i - 1] + fib[i - 2];
    }
    return fib[n];
}

/**
 * Rounds a number to the specified number of decimal places.
 * @param num - The number to round.
 * @param decimalPlaces - The number of decimal places to round to.
 * @returns The rounded number.
 */
export function roundToDecimalPlaces(num: number, decimalPlaces: number): number {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(num * factor) / factor;
                      }
