import express from 'express';
import { SubscriptionController } from '../controllers/subscription.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// Get available subscription plans
router.get('/plans', AuthMiddleware.verifyUser, SubscriptionController.getAvailablePlans);

// Subscribe to a plan
router.post('/:userId/subscribe', AuthMiddleware.verifyUser, SubscriptionController.subscribeToPlan);

// Get user's current subscription details
router.get('/:userId', AuthMiddleware.verifyUser, SubscriptionController.getUserSubscription);

// Cancel a user's subscription
router.delete('/:userId/cancel', AuthMiddleware.verifyUser, SubscriptionController.cancelSubscription);

// Renew a user's subscription
router.post('/:userId/renew', AuthMiddleware.verifyUser, SubscriptionController.renewSubscription);

export default router;
