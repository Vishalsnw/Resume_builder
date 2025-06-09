// client/src/lib/email.js

/**
 * Email Service Utility
 * 
 * This file provides email sending capabilities and template management
 * for authentication flows and notifications.
 */

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

/**
 * Mock email sender function
 * In production, this would integrate with a real email service like SendGrid, AWS SES, etc.
 */
async function sendEmail(options) {
  const { to, subject, html, text } = options;
  
  // In development or testing, just log the email
  console.log('📧 MOCK EMAIL SENT:');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('Content:', text || html);
  
  // Return a success response
  return {
    success: true,
    messageId: `mock-email-${Date.now()}`,
    timestamp: new Date().toISOString()
  };
}

/**
 * Email templates for common scenarios
 */
const templates = {
  // Welcome email after registration
  welcome: (user) => ({
    subject: 'Welcome to AI Resume Builder',
    text: `Hello ${user.name || 'there'},
    
Welcome to AI Resume Builder! We're excited to have you join us.

You can now create professional resumes with the help of AI.

Let's get started: https://resume-builder.app/dashboard

Best regards,
The AI Resume Builder Team`,
    html: `<div>
      <h1>Welcome to AI Resume Builder</h1>
      <p>Hello ${user.name || 'there'},</p>
      <p>We're excited to have you join us. You can now create professional resumes with the help of AI.</p>
      <p><a href="https://resume-builder.app/dashboard">Let's get started</a></p>
      <p>Best regards,<br>The AI Resume Builder Team</p>
    </div>`
  }),
  
  // Password reset email
  passwordReset: (user, token) => ({
    subject: 'Reset Your Password',
    text: `Hello ${user.name || 'there'},
    
You recently requested to reset your password. Click the link below to reset it:

https://resume-builder.app/reset-password?token=${token}

If you didn't request this, please ignore this email or contact support.

The link will expire in 1 hour.

Best regards,
The AI Resume Builder Team`,
    html: `<div>
      <h1>Reset Your Password</h1>
      <p>Hello ${user.name || 'there'},</p>
      <p>You recently requested to reset your password. Click the button below to reset it:</p>
      <p><a href="https://resume-builder.app/reset-password?token=${token}" 
            style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
        Reset Password
      </a></p>
      <p>If you didn't request this, please ignore this email or contact support.</p>
      <p>The link will expire in 1 hour.</p>
      <p>Best regards,<br>The AI Resume Builder Team</p>
    </div>`
  }),
  
  // Email verification
  verification: (user, token) => ({
    subject: 'Verify Your Email Address',
    text: `Hello ${user.name || 'there'},
    
Thank you for registering! Please verify your email address by clicking the link below:

https://resume-builder.app/verify-email?token=${token}

The link will expire in 24 hours.

Best regards,
The AI Resume Builder Team`,
    html: `<div>
      <h1>Verify Your Email Address</h1>
      <p>Hello ${user.name || 'there'},</p>
      <p>Thank you for registering! Please verify your email address by clicking the button below:</p>
      <p><a href="https://resume-builder.app/verify-email?token=${token}" 
            style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
        Verify Email
      </a></p>
      <p>The link will expire in 24 hours.</p>
      <p>Best regards,<br>The AI Resume Builder Team</p>
    </div>`
  })
};

/**
 * Validate email address format
 */
function validateEmail(email) {
  return EMAIL_REGEX.test(email);
}

/**
 * Generate a verification/reset token
 */
function generateToken(length = 32) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

// Export the email utilities
module.exports = {
  sendEmail,
  templates,
  validateEmail,
  generateToken
};
