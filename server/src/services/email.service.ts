import nodemailer from 'nodemailer';
import { AppError } from '../utils/app-error'; // Custom error class
import crypto from 'crypto';

// A temporary in-memory store for OTPs (use a database like Redis in production)
const otpStore: { [email: string]: { otp: string; expiresAt: Date } } = {};

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  /**
   * Send a one-time password (OTP) to the user's email
   * @param email - The recipient's email address
   */
  static async sendOTP(email: string) {
    // Generate a random OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Store the OTP in memory (or a database like Redis)
    otpStore[email] = { otp, expiresAt };

    // Prepare the email content
    const subject = 'Your OTP for Login';
    const text = `Your One-Time Password (OTP) is: ${otp}. This OTP is valid for 10 minutes.`;
    const html = `<p>Your One-Time Password (OTP) is: <strong>${otp}</strong>. This OTP is valid for 10 minutes.</p>`;

    // Send the email
    try {
      await EmailService.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'no-reply@example.com',
        to: email,
        subject,
        text,
        html,
      });

      return { message: 'OTP sent to your email', otp }; // Remove OTP in production
    } catch (error) {
      throw new AppError('Failed to send OTP email', 500);
    }
  }

  /**
   * Verify the OTP provided by the user
   * @param email - The recipient's email address
   * @param otp - The OTP to verify
   */
  static async verifyOTP(email: string, otp: string) {
    const storedOTP = otpStore[email];

    if (!storedOTP) {
      throw new AppError('OTP not found or expired', 400);
    }

    if (storedOTP.otp !== otp) {
      throw new AppError('Invalid OTP', 400);
    }

    if (new Date() > storedOTP.expiresAt) {
      delete otpStore[email]; // Remove expired OTP
      throw new AppError('OTP has expired', 400);
    }

    // OTP is valid
    delete otpStore[email]; // Remove OTP after use
    return { message: 'OTP verified successfully' };
  }

  /**
   * Send a generic email
   * @param to - The recipient's email address
   * @param subject - The email subject
   * @param text - The plain text content
   * @param html - The HTML content
   */
  static async sendEmail(to: string, subject: string, text: string, html?: string) {
    try {
      await EmailService.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'no-reply@example.com',
        to,
        subject,
        text,
        html,
      });

      return { message: 'Email sent successfully' };
    } catch (error) {
      throw new AppError('Failed to send email', 500);
    }
  }
}
