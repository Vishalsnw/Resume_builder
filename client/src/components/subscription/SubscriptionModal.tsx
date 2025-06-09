// client/src/components/subscription/SubscriptionModal.tsx

import index from '@/pages/help/index';
// REMOVED INVALID IMPORT
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import Modal from '@/components/common/feedback/Modal';
import SubscriptionModal from '@/components/subscription/SubscriptionModal';
import React, { useState, useEffect } from 'react';
import {
  FiX,
  FiCheck,
  FiAlertTriangle,
  FiCreditCard,
  FiCalendar,
  FiArrowUpCircle,
  FiRefreshCw,
  FiDollarSign,
  FiClock
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
  currentUser?: string;
  currentDateTime?: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  popular?: boolean;
}

interface BillingInfo {
  lastFour: string;
  expiryDate: string;
  cardType: string;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentPlan = 'basic',
  currentUser = 'Vishalsnw',
  currentDateTime = '2025-06-07 18:47:50'
}) => {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlan);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      currency: 'USD',
      features: [
        'Basic Resume Builder',
        'Export to PDF',
        'Limited Templates',
        'Email Support'
      ]
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 19.99,
      currency: 'USD',
      features: [
        'Everything in Basic',
        'Unlimited Templates',
        'AI-Powered Features',
        'Priority Support',
        'Cover Letter Generator'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 49.99,
      currency: 'USD',
      features: [
        'Everything in Professional',
        'Custom Branding',
        'API Access',
        'Dedicated Support',
        'Team Management'
      ]
    }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchSubscriptionDetails();
    }
  }, [isOpen]);

  const fetchSubscriptionDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/subscription/details', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch subscription details');
      
      const data = await response.json();
      setSubscriptionDetails(data.subscription);
      setBillingInfo(data.billingInfo);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast.error('Failed to load subscription details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (selectedPlan === currentPlan) {
      toast.error('Please select a different plan to upgrade');
      return;
    }

    setShowConfirmation(true);
  };

  const confirmUpgrade = async () => {
    setProcessing(true);
    try {
      const response = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          newPlan: selectedPlan,
          billingCycle,
          timestamp: currentDateTime,
          user: currentUser
        })
      });

      if (!response.ok) throw new Error('Upgrade failed');

      const data = await response.json();
      toast.success('Subscription upgraded successfully');
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      toast.error('Failed to upgrade subscription');
    } finally {
      setProcessing(false);
      setShowConfirmation(false);
    }
  };

  const calculatePrice = (basePrice: number): number => {
    if (billingCycle === 'yearly') {
      return basePrice * 10; // 2 months free
    }
    return basePrice;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal Panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Modal Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Manage Subscription
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <FiRefreshCw className="w-8 h-8 mx-auto animate-spin text-blue-600" />
              <p className="mt-2 text-gray-600">Loading subscription details...</p>
            </div>
          ) : (
            <>
              {/* Current Subscription */}
              <div className="px-6 py-4 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Current Plan</h4>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {plans.find(p => p.id === currentPlan)?.name}
                    </p>
                  </div>
                  {billingInfo && (
                    <div className="text-right">
                      <h4 className="text-sm font-medium text-gray-500">Payment Method</h4>
                      <p className="mt-1 text-gray-900">
                        {billingInfo.cardType} •••• {billingInfo.lastFour}
                      </p>
                      <p className="text-sm text-gray-500">
                        Expires {billingInfo.expiryDate}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Billing Cycle Toggle */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      billingCycle === 'monthly'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      billingCycle === 'yearly'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Yearly Billing
                    <span className="ml-1 text-green-600 text-xs">Save 16%</span>
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative rounded-lg border p-4 ${
                        selectedPlan === plan.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Popular
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{plan.name}</h3>
                          <div className="mt-2">
                            <span className="text-2xl font-bold">
                              ${calculatePrice(plan.price)}
                            </span>
                            <span className="text-gray-500">
                              /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                            </span>
                          </div>
                        </div>
                        <input
                          type="radio"
                          checked={selectedPlan === plan.id}
                          onChange={() => setSelectedPlan(plan.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                      </div>
                      <ul className="mt-4 space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <FiCheck className="w-5 h-5 text-green-500 shrink-0" />
                            <span className="ml-2 text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpgrade}
                  disabled={selectedPlan === currentPlan || processing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {processing ? (
                    <>
                      <FiRefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiArrowUpCircle className="w-5 h-5 mr-2" />
                      Upgrade Subscription
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
            <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirm Subscription Change
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to upgrade to the {plans.find(p => p.id === selectedPlan)?.name} plan?
                You will be charged ${calculatePrice(plans.find(p => p.id === selectedPlan)?.price || 0)} 
                {billingCycle === 'monthly' ? '/month' : '/year'}.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUpgrade}
                  disabled={processing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Confirm Upgrade'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionModal;
