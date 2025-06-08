import { Subscription } from '../models/subscription.model'; // Assuming you have a Subscription model
import { User } from '../models/user.model'; // Assuming you have a User model
import { AppError } from '../utils/app-error'; // Custom error class
import { PaymentService } from './payment.service'; // Payment service for handling payments

export class SubscriptionService {
  /**
   * Get all available subscription plans
   */
  static async getAvailablePlans() {
    // Fetch all subscription plans (Assume plans are predefined in the database)
    const plans = await Subscription.find();
    if (!plans || plans.length === 0) {
      throw new AppError('No subscription plans found', 404);
    }
    return plans;
  }

  /**
   * Subscribe a user to a plan
   * @param userId - The ID of the user
   * @param planId - The ID of the subscription plan
   * @param paymentDetails - Payment details for the subscription
   */
  static async subscribeToPlan(userId: string, planId: string, paymentDetails: object) {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Find the subscription plan
    const plan = await Subscription.findById(planId);
    if (!plan) {
      throw new AppError('Subscription plan not found', 404);
    }

    // Process the payment
    const paymentResult = await PaymentService.processPayment(paymentDetails, plan.price);
    if (!paymentResult.success) {
      throw new AppError('Payment failed', 400);
    }

    // Update the user's subscription
    user.subscription = {
      planId: plan._id,
      planName: plan.name,
      validUntil: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000), // Add plan duration in days
    };

    await user.save();

    return {
      message: 'Subscription successful',
      plan: user.subscription,
    };
  }

  /**
   * Get the current subscription details for a user
   * @param userId - The ID of the user
   */
  static async getUserSubscription(userId: string) {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Return the user's subscription details
    if (!user.subscription || !user.subscription.planId) {
      throw new AppError('User does not have an active subscription', 404);
    }

    return user.subscription;
  }

  /**
   * Cancel the user's subscription
   * @param userId - The ID of the user
   */
  static async cancelSubscription(userId: string) {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if the user has an active subscription
    if (!user.subscription || !user.subscription.planId) {
      throw new AppError('User does not have an active subscription to cancel', 400);
    }

    // Cancel the subscription
    user.subscription = null;
    await user.save();

    return { message: 'Subscription canceled successfully' };
  }

  /**
   * Renew the user's subscription
   * @param userId - The ID of the user
   * @param paymentDetails - Payment details for the renewal
   */
  static async renewSubscription(userId: string, paymentDetails: object) {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if the user has an active or expired subscription
    if (!user.subscription || !user.subscription.planId) {
      throw new AppError('User does not have an active or expired subscription to renew', 400);
    }

    // Find the subscription plan
    const plan = await Subscription.findById(user.subscription.planId);
    if (!plan) {
      throw new AppError('Subscription plan not found', 404);
    }

    // Process the payment
    const paymentResult = await PaymentService.processPayment(paymentDetails, plan.price);
    if (!paymentResult.success) {
      throw new AppError('Payment failed', 400);
    }

    // Extend the subscription validity
    const currentValidUntil = user.subscription.validUntil || new Date();
    user.subscription.validUntil = new Date(currentValidUntil.getTime() + plan.duration * 24 * 60 * 60 * 1000);

    await user.save();

    return {
      message: 'Subscription renewed successfully',
      plan: user.subscription,
    };
  }
      }
