import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model'; // Assuming you have a User model
import { EmailService } from './email.service'; // Service for sending emails
import { AppError } from '../utils/app-error'; // Custom error class

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret'; // Use environment variable for the secret
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d'; // Default expiration time for tokens

export class AuthService {
  /**
   * Register a new user
   * @param name - User's name
   * @param email - User's email address
   * @param password - User's password
   */
  static async register(name: string, email: string, password: string) {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User already exists with this email', 400);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({ name, email, password: hashedPassword });

    // Return the newly created user
    return newUser;
  }

  /**
   * Login a user with email and password
   * @param email - User's email address
   * @param password - User's password
   */
  static async login(email: string, password: string) {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return { token, user };
  }

  /**
   * Login a user with email and OTP
   * @param email - User's email address
   * @param otp - One-time password
   */
  static async loginWithEmailOTP(email: string, otp: string) {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify the OTP (Assuming OTP verification logic is implemented)
    const isOTPValid = await EmailService.verifyOTP(email, otp);
    if (!isOTPValid) {
      throw new AppError('Invalid OTP', 401);
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return { token, user };
  }

  /**
   * Sends an OTP to the user's email
   * @param email - User's email address
   */
  static async sendEmailOTP(email: string) {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Generate and send an OTP (Assuming EmailService handles OTP generation and email sending)
    await EmailService.sendOTP(email);

    return { message: 'OTP sent to your email' };
  }

  /**
   * Logout the user
   * (Typically handled client-side by removing the token, but could involve server-side token blacklisting)
   */
  static async logout() {
    // For stateless JWT, logout is handled by the client (e.g., deleting the token)
    return { message: 'User logged out successfully' };
  }
      }
