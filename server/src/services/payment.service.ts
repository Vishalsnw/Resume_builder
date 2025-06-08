import Stripe from 'stripe';
import { AppError } from '../utils/app-error'; // Custom error class
import { User } from '../models/user.model'; // Assuming you have a User model

// Initialize the Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15',
});

export class PaymentService {
  /**
   * Process a payment for a subscription
   * @param paymentDetails - Payment details (e.g., token or payment method)
   * @param amount - Amount to charge (in smallest currency unit, e.g., cents for USD)
   */
  static async processPayment(
    paymentDetails: { paymentMethodId: string; customerId?: string },
    amount: number
  ) {
    try {
      // Validate amount
      if (amount <= 0) {
        throw new AppError('Invalid payment amount', 400);
      }

      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount, // Amount in smallest currency unit (e.g., cents)
        currency: process.env.STRIPE_CURRENCY || 'usd', // Default to USD
        payment_method: paymentDetails.paymentMethodId,
        customer: paymentDetails.customerId, // Optional customer ID
        confirm: true, // Confirm the payment immediately
      });

      // Return payment confirmation details
      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      };
    } catch (error: any) {
      throw new AppError(`Payment processing failed: ${error.message}`, 500);
    }
  }

  /**
   * Create a Stripe customer for a user
   * @param userId - The ID of the user
   * @param email - The email address of the user
   */
  static async createCustomer(userId: string, email: string) {
    try {
      // Ensure the user exists
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email,
        metadata: {
          userId,
        },
      });

      // Save the customer ID to the user's record
      user.stripeCustomerId = customer.id;
      await user.save();

      return { customerId: customer.id };
    } catch (error: any) {
      throw new AppError(`Failed to create Stripe customer: ${error.message}`, 500);
    }
  }

  /**
   * Refund a payment
   * @param paymentIntentId - The ID of the payment intent to refund
   * @param amount - Amount to refund (optional, in smallest currency unit)
   */
  static async refundPayment(paymentIntentId: string, amount?: number) {
    try {
      // Create a refund
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount, // Optional: refund partial amount
      });

      return {
        success: true,
        refundId: refund.id,
        status: refund.status,
      };
    } catch (error: any) {
      throw new AppError(`Refund processing failed: ${error.message}`, 500);
    }
  }

  /**
   * Retrieve payment details
   * @param paymentIntentId - The ID of the payment intent
   */
  static async retrievePayment(paymentIntentId: string) {
    try {
      // Fetch the payment intent details
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        created: paymentIntent.created,
        customerId: paymentIntent.customer,
        paymentMethod: paymentIntent.payment_method,
      };
    } catch (error: any) {
      throw new AppError(`Failed to retrieve payment details: ${error.message}`, 500);
    }
  }
}
