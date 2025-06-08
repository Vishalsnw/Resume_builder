import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    /**
     * Handles user registration.
     */
    public static async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, name } = req.body;
            const user = await AuthService.register(email, password, name);
            res.status(201).json({ message: 'User registered successfully', user });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Handles user login with Email OTP.
     */
    public static async loginWithEmailOTP(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp } = req.body;
            const token = await AuthService.loginWithEmailOTP(email, otp);
            res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    /**
     * Handles login via OAuth (Google, LinkedIn).
     */
    public static async loginWithOAuth(req: Request, res: Response): Promise<void> {
        try {
            const { provider, token } = req.body; // Provider could be 'google' or 'linkedin'
            const user = await AuthService.loginWithOAuth(provider, token);
            res.status(200).json({ message: 'Login successful', user });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    /**
     * Handles user logout.
     */
    public static async logout(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.body; // Assuming you're using userId to identify the user
            await AuthService.logout(userId);
            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Sends an OTP for email login.
     */
    public static async sendEmailOTP(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            await AuthService.sendEmailOTP(email);
            res.status(200).json({ message: 'OTP sent successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
      }
