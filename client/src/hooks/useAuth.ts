// hooks/useAuth.ts

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { z } from 'zod';

// Validation schema for credentials
const credentialsSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// User role type
type UserRole = 'USER' | 'ADMIN' | 'PREMIUM';

// Auth state interface
interface AuthState {
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
  });

  // Track auth attempts for rate limiting
  const [authAttempts, setAuthAttempts] = useState<number>(0);
  const MAX_AUTH_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  // Reset auth attempts after lockout period
  useEffect(() => {
    if (authAttempts >= MAX_AUTH_ATTEMPTS) {
      const timer = setTimeout(() => {
        setAuthAttempts(0);
      }, LOCKOUT_DURATION);

      return () => clearTimeout(timer);
    }
  }, [authAttempts]);

  // Login handler
  const login = useCallback(async (email: string, password: string) => {
    // Check for rate limiting
    if (authAttempts >= MAX_AUTH_ATTEMPTS) {
      const remainingTime = Math.ceil(LOCKOUT_DURATION / 60000);
      setAuthState({
        isLoading: false,
        error: `Too many login attempts. Please try again in ${remainingTime} minutes.`,
      });
      return;
    }

    try {
      setAuthState({ isLoading: true, error: null });

      // Validate credentials
      const validatedCredentials = credentialsSchema.parse({ email, password });

      const result = await signIn('credentials', {
        redirect: false,
        email: validatedCredentials.email,
        password: validatedCredentials.password,
      });

      if (result?.error) {
        setAuthAttempts(prev => prev + 1);
        throw new Error(result.error);
      }

      // Reset auth attempts on successful login
      setAuthAttempts(0);

      // Log successful login
      await fetch('/api/activity-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'AUTH_LOGIN',
          description: 'User logged in successfully',
          createdBy: 'Vishalsnw',
          timestamp: '2025-06-08 06:57:30',
        }),
      });

      // Redirect to dashboard or intended page
      const callbackUrl = router.query.callbackUrl as string;
      router.push(callbackUrl || '/dashboard');

    } catch (error) {
      setAuthState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      });
    }
  }, [router, authAttempts]);

  // Logout handler
  const logout = useCallback(async () => {
    try {
      setAuthState({ isLoading: true, error: null });

      // Log logout activity before signing out
      await fetch('/api/activity-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'AUTH_LOGOUT',
          description: 'User logged out',
          createdBy: 'Vishalsnw',
          timestamp: '2025-06-08 06:57:30',
        }),
      });

      await signOut({ redirect: false });
      router.push('/');

    } catch (error) {
      setAuthState({
        isLoading: false,
        error: 'Logout failed',
      });
    }
  }, [router]);

  // Check if user has required role
  const hasRole = useCallback((requiredRole: UserRole | UserRole[]) => {
    if (!session?.user?.role) return false;

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(session.user.role as UserRole);
    }

    return session.user.role === requiredRole;
  }, [session]);

  // Check if user has required permissions
  const hasPermission = useCallback((permission: string) => {
    if (!session?.user?.permissions) return false;
    return session.user.permissions.includes(permission);
  }, [session]);

  // Refresh session
  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to refresh session');
      }

      // Trigger session update
      const event = new Event('visibilitychange');
      document.dispatchEvent(event);

    } catch (error) {
      console.error('Session refresh failed:', error);
      await logout();
    }
  }, [logout]);

  // Set up session refresh interval
  useEffect(() => {
    if (session) {
      const refreshInterval = setInterval(refreshSession, 14 * 60 * 1000); // Refresh every 14 minutes
      return () => clearInterval(refreshInterval);
    }
  }, [session, refreshSession]);

  return {
    user: session?.user,
    isAuthenticated: !!session,
    isLoading: status === 'loading' || authState.isLoading,
    error: authState.error,
    login,
    logout,
    hasRole,
    hasPermission,
    authAttempts,
    isLocked: authAttempts >= MAX_AUTH_ATTEMPTS,
  };
}
