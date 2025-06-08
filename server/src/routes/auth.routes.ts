import express from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = express.Router();

// Route to register a new user
router.post('/register', AuthController.register);

// Route to log in a user using email and OTP
router.post('/login/email-otp', AuthController.loginWithEmailOTP);

// Route to log in a user using OAuth
router.post('/login/oauth', AuthController.loginWithOAuth);

// Route to log out a user
router.post('/logout', AuthController.logout);

// Route to send an email OTP for login
router.post('/send-email-otp', AuthController.sendEmailOTP);

export default router;
