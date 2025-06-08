import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscription.service';

export class SubscriptionController {
    /**
     * Fetches all available subscription plans.
     */
    public static async getSubscriptionPlans(req: Request, res: Response): Promise<void> {
        try {
            const plans = await SubscriptionService.getAllPlans();
            res.status(200).json(plans);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Subscribes a user to a plan.
     */
    public static async subscribe(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId; // Assuming userId is passed as a path parameter
            const { planId, paymentDetails } = req.body; // Plan ID and payment details from the request body
            const subscription = await SubscriptionService.subscribe(userId, planId, paymentDetails);
            res.status(201).json({ message: 'Subscription successful', subscription });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Cancels a user's active subscription.
     */
    public static async cancelSubscription(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId; // Assuming userId is passed as a path parameter
            const cancellation = await SubscriptionService.cancelSubscription(userId);
            res.status(200).json({ message: 'Subscription cancelled successfully', cancellation });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Retrieves the subscription details of a user.
     */
    public static async getUserSubscription(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId; // Assuming userId is passed as a path parameter
            const subscription = await SubscriptionService.getUserSubscription(userId);
            res.status(200).json(subscription);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    /**
     * Handles webhook events from the payment gateway.
     */
    public static async handleWebhook(req: Request, res: Response): Promise<void> {
        try {
            const webhookEvent = req.body; // Webhook payload from the payment gateway
            await SubscriptionService.handleWebhookEvent(webhookEvent);
            res.status(200).json({ message: 'Webhook handled successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
