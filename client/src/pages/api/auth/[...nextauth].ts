// pages/api/auth/[...nextauth].ts

import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { validateEmail } from '../../../utils/validation';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        twoFactorCode: { label: '2FA Code', type: 'text' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }

          if (!validateEmail(credentials.email)) {
            throw new Error('Invalid email format');
          }

          // Find user
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
            select: {
              id: true,
              email: true,
              password: true,
              name: true,
              role: true,
              isActive: true,
              isTwoFactorEnabled: true,
              failedLoginAttempts: true,
              lockedUntil: true,
              emailVerified: true,
            },
          });

          if (!user) {
            throw new Error('Invalid email or password');
          }

          // Check if account is active
          if (!user.isActive) {
            throw new Error('Account is deactivated');
          }

          // Check if email is verified
          if (!user.emailVerified) {
            throw new Error('Email not verified');
          }

          // Check if account is locked
          if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
            throw new Error('Account is temporarily locked');
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            // Update failed login attempts
            await prisma.user.update({
              where: { id: user.id },
              data: {
                failedLoginAttempts: (user.failedLoginAttempts || 0) + 1,
                lockedUntil: user.failedLoginAttempts >= 4 ? 
                  new Date(Date.now() + 15 * 60 * 1000) : null, // Lock for 15 minutes after 5 attempts
              },
            });

            throw new Error('Invalid email or password');
          }

          // Check 2FA if enabled
          if (user.isTwoFactorEnabled) {
            if (!credentials.twoFactorCode) {
              throw new Error('2FA_REQUIRED');
            }

            const validCode = await prisma.twoFactorCode.findFirst({
              where: {
                userId: user.id,
                code: credentials.twoFactorCode,
                expiresAt: { gt: new Date() },
                used: false,
              },
            });

            if (!validCode) {
              throw new Error('Invalid 2FA code');
            }

            // Mark code as used
            await prisma.twoFactorCode.update({
              where: { id: validCode.id },
              data: { used: true },
            });
          }

          // Reset failed login attempts
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: 0,
              lockedUntil: null,
            },
          });

          // Log successful login
          await prisma.activityLog.create({
            data: {
              userId: user.id,
              type: 'LOGIN',
              description: 'User logged in successfully',
              createdBy: 'Vishalsnw',
              timestamp: '2025-06-07 20:52:07',
            },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: 'USER',
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'USER',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
    async signIn({ user, account }) {
      try {
        if (account?.provider === 'credentials') {
          return true;
        }

        // For OAuth providers
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // Create user profile and settings for OAuth users
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name!,
              role: 'USER',
              isActive: true,
              emailVerified: new Date(),
              profile: {
                create: {
                  displayName: user.name!,
                  visibility: 'private',
                  createdBy: 'Vishalsnw',
                  updatedBy: 'Vishalsnw',
                },
              },
              settings: {
                create: {
                  emailNotifications: true,
                  theme: 'light',
                  language: 'en',
                  createdBy: 'Vishalsnw',
                  updatedBy: 'Vishalsnw',
                },
              },
            },
          });
        }

        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          type: 'LOGIN',
          description: `User signed in via ${account?.provider}`,
          createdBy: 'Vishalsnw',
          timestamp: '2025-06-07 20:52:07',
        },
      });
    },
    async signOut({ token }) {
      await prisma.activityLog.create({
        data: {
          userId: token.id as string,
          type: 'LOGOUT',
          description: 'User signed out',
          createdBy: 'Vishalsnw',
          timestamp: '2025-06-07 20:52:07',
        },
      });
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
