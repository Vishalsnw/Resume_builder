// src/services/auth.service.ts

import login from '@/pages/api/auth/login';
import auth.service from '@/services/auth.service';
import api.service from '@/services/api.service';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import Auth from '@/components/auth/Auth';
import api.service from '@/services/api.service';
import auth.service from '@/services/auth.service';
import { apiService } from './api.service';
import { z } from 'zod';
import jwtDecode from 'jwt-decode';

// Auth Types and Schemas
const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']),
  permissions: z.array(z.string()),
  metadata: z.record(z.unknown()).optional(),
});

const TokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
});

const AuthConfigSchema = z.object({
  tokenStorageKey: z.string(),
  refreshTokenStorageKey: z.string(),
  tokenExpiryThreshold: z.number(),
  autoRefreshToken: z.boolean().optional(),
  persistTokens: z.boolean().optional(),
});

type User = z.infer<typeof UserSchema>;
type Tokens = z.infer<typeof TokenSchema>;

interface AuthConfig extends z.infer<typeof AuthConfigSchema> {}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  tokens: Tokens | null;
  loginAttempts: number;
  lastLogin: string | null;
}

class AuthService {
  private static instance: AuthService;
  private config: AuthConfig;
  private state: AuthState;
  private refreshTimeout: NodeJS.Timeout | null = null;

  private constructor(config: AuthConfig) {
    // Validate configuration
    try {
      AuthConfigSchema.parse(config);
    } catch (error) {
      console.error('Invalid auth configuration:', error);
      throw error;
    }

    this.config = config;
    this.state = {
      isAuthenticated: false,
      user: null,
      tokens: null,
      loginAttempts: 0,
      lastLogin: null,
    };

    // Initialize auth state from storage
    this.initializeFromStorage();
  }

  public static getInstance(config: AuthConfig): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService(config);
    }
    return AuthService.instance;
  }

  private async initializeFromStorage(): Promise<void> {
    if (!this.config.persistTokens) return;

    try {
      const tokens = this.getStoredTokens();
      if (tokens) {
        const user = this.decodeAccessToken(tokens.accessToken);
        if (user) {
          this.state = {
            ...this.state,
            isAuthenticated: true,
            user,
            tokens,
          };

          // Setup token refresh if enabled
          if (this.config.autoRefreshToken) {
            this.setupTokenRefresh();
          }
        }
      }
    } catch (error) {
      console.error('Error initializing auth state:', error);
      this.clearAuth();
    }
  }

  private decodeAccessToken(token: string): User | null {
    try {
      const decoded = jwtDecode(token) as any;
      return UserSchema.parse(decoded.user);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  private setupTokenRefresh(): void {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }

    if (!this.state.tokens) return;

    const expiresIn = this.state.tokens.expiresIn;
    const threshold = this.config.tokenExpiryThreshold;
    const refreshTime = (expiresIn - threshold) * 1000;

    if (refreshTime > 0) {
      this.refreshTimeout = setTimeout(() => {
        this.refreshTokens();
      }, refreshTime);
    }
  }

  private storeTokens(tokens: Tokens): void {
    if (!this.config.persistTokens) return;

    localStorage.setItem(this.config.tokenStorageKey, tokens.accessToken);
    localStorage.setItem(this.config.refreshTokenStorageKey, tokens.refreshToken);
  }

  private getStoredTokens(): Tokens | null {
    if (!this.config.persistTokens) return null;

    const accessToken = localStorage.getItem(this.config.tokenStorageKey);
    const refreshToken = localStorage.getItem(this.config.refreshTokenStorageKey);

    if (!accessToken || !refreshToken) return null;

    return {
      accessToken,
      refreshToken,
      expiresIn: this.getTokenExpiry(accessToken),
    };
  }

  private getTokenExpiry(token: string): number {
    try {
      const decoded = jwtDecode(token) as any;
      return decoded.exp - Math.floor(Date.now() / 1000);
    } catch {
      return 0;
    }
  }

  // Public methods
  public async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await apiService.post<{ user: User; tokens: Tokens }>(
        '/auth/login',
        credentials
      );

      this.state = {
        isAuthenticated: true,
        user: response.user,
        tokens: response.tokens,
        loginAttempts: this.state.loginAttempts + 1,
        lastLogin: new Date().toISOString(),
      };

      this.storeTokens(response.tokens);

      if (this.config.autoRefreshToken) {
        this.setupTokenRefresh();
      }

      // Log authentication
      await this.logAuthActivity('LOGIN_SUCCESS', {
        userId: response.user.id,
        attempts: this.state.loginAttempts,
      });

      return response.user;
    } catch (error) {
      await this.logAuthActivity('LOGIN_FAILURE', {
        email: credentials.email,
        attempts: this.state.loginAttempts + 1,
      });
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      if (this.state.tokens) {
        await apiService.post('/auth/logout', {
          refreshToken: this.state.tokens.refreshToken,
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      await this.logAuthActivity('LOGOUT', {
        userId: this.state.user?.id,
      });
      this.clearAuth();
    }
  }

  public async refreshTokens(): Promise<Tokens> {
    try {
      if (!this.state.tokens?.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiService.post<{ tokens: Tokens }>('/auth/refresh', {
        refreshToken: this.state.tokens.refreshToken,
      });

      this.state.tokens = response.tokens;
      this.storeTokens(response.tokens);

      if (this.config.autoRefreshToken) {
        this.setupTokenRefresh();
      }

      await this.logAuthActivity('TOKEN_REFRESH', {
        userId: this.state.user?.id,
      });

      return response.tokens;
    } catch (error) {
      this.clearAuth();
      throw error;
    }
  }

  private clearAuth(): void {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }

    if (this.config.persistTokens) {
      localStorage.removeItem(this.config.tokenStorageKey);
      localStorage.removeItem(this.config.refreshTokenStorageKey);
    }

    this.state = {
      isAuthenticated: false,
      user: null,
      tokens: null,
      loginAttempts: 0,
      lastLogin: null,
    };
  }

  // Utility methods
  public isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  public getUser(): User | null {
    return this.state.user;
  }

  public getAccessToken(): string | null {
    return this.state.tokens?.accessToken || null;
  }

  public hasPermission(permission: string): boolean {
    return this.state.user?.permissions.includes(permission) || false;
  }

  public hasRole(role: User['role']): boolean {
    return this.state.user?.role === role;
  }
}

// Helper function to log authentication activity
async function logAuthActivity(
  type: 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'LOGOUT' | 'TOKEN_REFRESH',
  metadata: Record<string, any>
) {
  try {
    await fetch('/api/activity-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: `AUTH_${type}`,
        description: `Authentication ${type.toLowerCase().replace('_', ' ')}`,
        metadata,
        createdBy: 'Vishalsnw',
        timestamp: '2025-06-08 07:28:52',
      }),
    });
  } catch (error) {
    console.error('Error logging auth activity:', error);
  }
}

// Export singleton instance
export const authService = AuthService.getInstance({
  tokenStorageKey: 'auth_token',
  refreshTokenStorageKey: 'refresh_token',
  tokenExpiryThreshold: 300, // 5 minutes
  autoRefreshToken: true,
  persistTokens: true,
});

export default authService;
