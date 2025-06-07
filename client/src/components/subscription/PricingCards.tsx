// client/src/components/pricing/PricingCards.tsx

import React, { useState } from 'react';
import { 
  FiCheck, 
  FiX, 
  FiCreditCard, 
  FiDollarSign,
  FiGlobe,
  FiRefreshCw
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface PricingTier {
  id: string;
  name: string;
  description: string;
  prices: {
    [key: string]: number; // Currency code as key, price as value
    USD: number;
    EUR: number;
    GBP: number;
    INR: number;
    JPY: number;
    AUD: number;
    CAD: number;
    CNY: number;
    SGD: number;
  };
  features: {
    text: string;
    included: boolean;
  }[];
  billingPeriod: 'monthly' | 'yearly';
  popular?: boolean;
}

interface PricingCardsProps {
  currentUser?: string;
  currentDateTime?: string;
}

const PricingCards: React.FC<PricingCardsProps> = ({
  currentUser = 'Vishalsnw',
  currentDateTime = '2025-06-07 18:40:33'
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    AUD: 'A$',
    CAD: 'C$',
    CNY: '¥',
    SGD: 'S$',
  };

  const currencyNames: { [key: string]: string } = {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    INR: 'Indian Rupee',
    JPY: 'Japanese Yen',
    AUD: 'Australian Dollar',
    CAD: 'Canadian Dollar',
    CNY: 'Chinese Yuan',
    SGD: 'Singapore Dollar',
  };

  const pricingTiers: PricingTier[] = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Perfect for getting started',
      prices: {
        USD: 9.99,
        EUR: 8.99,
        GBP: 7.99,
        INR: 799,
        JPY: 1099,
        AUD: 13.99,
        CAD: 12.99,
        CNY: 69,
        SGD: 13.99,
      },
      features: [
        { text: 'Basic Resume Builder', included: true },
        { text: 'Export to PDF', included: true },
        { text: 'Limited Templates', included: true },
        { text: 'Basic AI Suggestions', included: true },
        { text: 'Email Support', included: true },
        { text: 'Advanced Features', included: false },
        { text: 'Cover Letter Generator', included: false },
        { text: 'Priority Support', included: false },
      ],
      billingPeriod: 'monthly',
    },
    {
      id: 'pro',
      name: 'Professional',
      description: 'Most popular choice for job seekers',
      prices: {
        USD: 19.99,
        EUR: 17.99,
        GBP: 15.99,
        INR: 1599,
        JPY: 2199,
        AUD: 27.99,
        CAD: 25.99,
        CNY: 139,
        SGD: 27.99,
      },
      features: [
        { text: 'Everything in Basic', included: true },
        { text: 'Unlimited Templates', included: true },
        { text: 'Advanced AI Features', included: true },
        { text: 'Cover Letter Generator', included: true },
        { text: 'Multiple Export Formats', included: true },
        { text: 'Priority Support', included: true },
        { text: 'Custom Branding', included: false },
        { text: 'API Access', included: false },
      ],
      billingPeriod: 'monthly',
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For teams and businesses',
      prices: {
        USD: 49.99,
        EUR: 44.99,
        GBP: 39.99,
        INR: 3999,
        JPY: 5499,
        AUD: 69.99,
        CAD: 64.99,
        CNY: 349,
        SGD: 69.99,
      },
      features: [
        { text: 'Everything in Professional', included: true },
        { text: 'Custom Branding', included: true },
        { text: 'API Access', included: true },
        { text: 'Dedicated Account Manager', included: true },
        { text: 'Team Management', included: true },
        { text: 'Analytics Dashboard', included: true },
        { text: 'Custom Integration', included: true },
        { text: 'SLA Support', included: true },
      ],
      billingPeriod: 'monthly',
    },
  ];

  const handleSubscribe = async (tierId: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierId,
          currency: selectedCurrency,
          billingPeriod,
          user: currentUser,
        }),
      });

      if (!response.ok) throw new Error('Subscription failed');

      const data = await response.json();
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error('Failed to process subscription');
    } finally {
      setIsProcessing(false);
    }
  };

  const getAdjustedPrice = (price: number, currency: string): string => {
    if (billingPeriod === 'yearly') {
      price = price * 10; // 2 months free
    }
    
    // Format based on currency
    switch (currency) {
      case 'JPY':
      case 'CNY':
        return Math.round(price).toString();
      case 'INR':
        return price.toLocaleString('en-IN');
      default:
        return price.toFixed(2);
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Currency and Billing Period Selection */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {Object.entries(currencyNames).map(([code, name]) => (
                <option key={code} value={code}>
                  {code} - {name}
                </option>
              ))}
            </select>
            <FiGlobe className="text-gray-400 w-5 h-5" />
          </div>

          <div className="bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                billingPeriod === 'monthly'
                  ? 'bg-white shadow'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                billingPeriod === 'yearly'
                  ? 'bg-white shadow'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Yearly (2 months free)
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-lg border ${
                tier.popular
                  ? 'border-blue-200 shadow-lg'
                  : 'border-gray-200'
              } p-6 space-y-6`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                <p className="mt-2 text-gray-500">{tier.description}</p>
              </div>

              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">
                  {currencySymbols[selectedCurrency]}
                </span>
                <span className="text-5xl font-extrabold text-gray-900">
                  {getAdjustedPrice(tier.prices[selectedCurrency], selectedCurrency)}
                </span>
                <span className="ml-1 text-gray-500">
                  /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                </span>
              </div>

              <ul className="space-y-4">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.included ? (
                      <FiCheck className="w-5 h-5 text-green-500 shrink-0" />
                    ) : (
                      <FiX className="w-5 h-5 text-gray-300 shrink-0" />
                    )}
                    <span className={`ml-3 ${
                      feature.included ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(tier.id)}
                disabled={isProcessing}
                className={`w-full flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium ${
                  tier.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-800 text-white hover:bg-gray-900'
                } disabled:opacity-50`}
              >
                {isProcessing ? (
                  <>
                    <FiRefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FiCreditCard className="w-5 h-5 mr-2" />
                    Subscribe Now
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            All prices are in {currencyNames[selectedCurrency]} ({selectedCurrency}).
            {billingPeriod === 'yearly' && ' Yearly billing includes 2 months free.'}
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Last updated: {currentDateTime} by {currentUser}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingCards;
