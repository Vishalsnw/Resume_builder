/**
 * Represents a subscription plan
 */
export interface SubscriptionPlan {
  planId: string; // Unique ID for the subscription plan
  name: string; // Name of the subscription plan
  price: number; // Price of the plan (in smallest currency unit, e.g., cents for USD)
  currency: string; // Currency code (e.g., USD, EUR)
  durationInDays: number; // Duration of the subscription in days
  features: string[]; // List of features included in the plan
}

/**
 * Represents an active subscription for a user
 */
export interface ActiveSubscription {
  userId: string; // ID of the user
  planId: string; // ID of the subscription plan
  subscriptionStartDate: Date; // Start date of the subscription
  subscriptionEndDate: Date; // End date of the subscription
  paymentStatus: 'paid' | 'pending' | 'failed'; // Status of the payment for the subscription
}

/**
 * Represents a subscription payment detail
 */
export interface PaymentDetail {
  paymentId: string; // Unique ID for the payment
  userId: string; // ID of the user who made the payment
  planId: string; // ID of the subscription plan associated with the payment
  amount: number; // Amount paid (in smallest currency unit, e.g., cents for USD)
  currency: string; // Currency code (e.g., USD, EUR)
  paymentDate: Date; // Date of the payment
  paymentStatus: 'paid' | 'pending' | 'failed'; // Status of the payment
}
