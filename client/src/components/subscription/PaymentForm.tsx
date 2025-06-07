// client/src/components/payment/PaymentForm.tsx

import React, { useState, useEffect } from 'react';
import {
  FiCreditCard,
  FiLock,
  FiShield,
  FiRefreshCw,
  FiAlertCircle,
  FiCheck,
  FiClock
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface PaymentFormProps {
  amount: number;
  currency: string;
  productName: string;
  recurringBilling?: boolean;
  billingPeriod?: 'monthly' | 'yearly';
  currentUser?: string;
  currentDateTime?: string;
}

interface CardDetails {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
}

interface BillingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency,
  productName,
  recurringBilling = false,
  billingPeriod = 'monthly',
  currentUser = 'Vishalsnw',
  currentDateTime = '2025-06-07 18:44:32'
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [useSavedCard, setUseSavedCard] = useState(false);
  const [selectedSavedCard, setSelectedSavedCard] = useState<string>('');
  const [saveCard, setSaveCard] = useState(false);
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });
  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [upiId, setUpiId] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Fetch saved cards for the current user
    const fetchSavedCards = async () => {
      try {
        const response = await fetch('/api/saved-cards', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
          const data = await response.json();
          setSavedCards(data.cards);
        }
      } catch (error) {
        console.error('Error fetching saved cards:', error);
      }
    };

    fetchSavedCards();
  }, []);

  const validateCard = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!useSavedCard) {
      if (!cardDetails.number.replace(/\s/g, '').match(/^[0-9]{16}$/)) {
        newErrors.cardNumber = 'Invalid card number';
      }

      if (!cardDetails.expiry.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
        newErrors.expiry = 'Invalid expiry date (MM/YY)';
      }

      if (!cardDetails.cvc.match(/^[0-9]{3,4}$/)) {
        newErrors.cvc = 'Invalid CVC';
      }

      if (!cardDetails.name.trim()) {
        newErrors.name = 'Name is required';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const validateUPI = (): boolean => {
    if (!upiId.match(/^[a-zA-Z0-9.-]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/)) {
      setErrors({ upi: 'Invalid UPI ID' });
      return false;
    }
    return true;
  };

  const validateBillingAddress = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!billingAddress.street.trim()) {
      newErrors.street = 'Street address is required';
    }
    if (!billingAddress.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!billingAddress.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!billingAddress.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }
    if (!billingAddress.country.trim()) {
      newErrors.country = 'Country is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    let isValid = validateBillingAddress();

    switch (paymentMethod) {
      case 'card':
        isValid = isValid && validateCard();
        break;
      case 'upi':
        isValid = isValid && validateUPI();
        break;
      case 'netbanking':
        isValid = isValid && !!bankCode;
        break;
    }

    if (!isValid) {
      toast.error('Please correct the errors before proceeding');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount,
          currency,
          productName,
          paymentMethod,
          recurringBilling,
          billingPeriod,
          paymentDetails: paymentMethod === 'card' 
            ? (useSavedCard ? { savedCardId: selectedSavedCard } : cardDetails)
            : paymentMethod === 'upi'
            ? { upiId }
            : { bankCode },
          billingAddress,
          saveCard: paymentMethod === 'card' ? saveCard : false,
          timestamp: currentDateTime,
          user: currentUser,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Payment failed');

      toast.success('Payment processed successfully!');
      
      // Redirect to success page
      window.location.href = `/payment/success/${data.transactionId}`;
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (input: string) => {
    const cleaned = input.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    return formatted.substring(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiry = (input: string) => {
    const cleaned = input.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
        <p className="mt-1 text-gray-600">
          {productName} - {currency} {amount.toFixed(2)}
          {recurringBilling && ` / ${billingPeriod}`}
        </p>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setPaymentMethod('card')}
            className={`flex-1 p-4 rounded-lg border ${
              paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <FiCreditCard className="w-6 h-6 mb-2" />
            <span>Card</span>
          </button>
          {currency === 'INR' && (
            <>
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`flex-1 p-4 rounded-lg border ${
                  paymentMethod === 'upi' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <FiShield className="w-6 h-6 mb-2" />
                <span>UPI</span>
              </button>
              <button
                onClick={() => setPaymentMethod('netbanking')}
                className={`flex-1 p-4 rounded-lg border ${
                  paymentMethod === 'netbanking' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <FiLock className="w-6 h-6 mb-2" />
                <span>Net Banking</span>
              </button>
            </>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Payment Fields */}
        {paymentMethod === 'card' && (
          <div className="space-y-4">
            {savedCards.length > 0 && (
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={useSavedCard}
                    onChange={(e) => setUseSavedCard(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2">Use saved card</span>
                </label>
                
                {useSavedCard && (
                  <select
                    value={selectedSavedCard}
                    onChange={(e) => setSelectedSavedCard(e.target.value)}
                    className="mt-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select a saved card</option>
                    {savedCards.map((card) => (
                      <option key={card.id} value={card.id}>
                        **** **** **** {card.last4} ({card.brand})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {!useSavedCard && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Card Number</label>
                  <input
                    type="text"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: formatCardNumber(e.target.value) })}
                    placeholder="1234 5678 9012 3456"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    maxLength={19}
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                    <input
                      type="text"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: formatExpiry(e.target.value) })}
                      placeholder="MM/YY"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      maxLength={5}
                    />
                    {errors.expiry && (
                      <p className="mt-1 text-sm text-red-600">{errors.expiry}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">CVC</label>
                    <input
                      type="text"
                      value={cardDetails.cvc}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value.replace(/\D/g, '') })}
                      placeholder="123"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      maxLength={4}
                    />
                    {errors.cvc && (
                      <p className="mt-1 text-sm text-red-600">{errors.cvc}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                    placeholder="John Doe"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2">Save card for future payments</span>
                  </label>
                </div>
              </>
            )}
          </div>
        )}

        {/* UPI Payment Fields */}
        {paymentMethod === 'upi' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">UPI ID</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="username@upi"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.upi && (
              <p className="mt-1 text-sm text-red-600">{errors.upi}</p>
            )}
          </div>
        )}

        {/* Net Banking Fields */}
        {paymentMethod === 'netbanking' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Bank</label>
            <select
              value={bankCode}
              onChange={(e) => setBankCode(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a bank</option>
              <option value="HDFC">HDFC Bank</option>
              <option value="ICICI">ICICI Bank</option>
              <option value="SBI">State Bank of India</option>
              <option value="AXIS">Axis Bank</option>
            </select>
          </div>
        )}

        {/* Billing Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Billing Address</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Street Address</label>
            <input
              type="text"
              value={billingAddress.street}
              onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.street && (
              <p className="mt-1 text-sm text-red-600">{errors.street}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                value={billingAddress.city}
                onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                value={billingAddress.state}
                onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                value={billingAddress.postalCode}
                onChange={(e) => setBillingAddress({ ...billingAddress, postalCode: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.postalCode && (
                <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                value={billingAddress.country}
                onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <FiRefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FiLock className="w-5 h-5 mr-2" />
              Pay {currency} {amount.toFixed(2)}
            </>
          )}
        </button>
      </form>

      {/* Security Info */}
      <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center">
          <FiLock className="w-4 h-4 mr-1" />
          <span>Secure Payment</span>
        </div>
        <div className="flex items-center">
          <FiShield className="w-4 h-4 mr-1" />
          <span>256-bit encryption</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>Last updated: {currentDateTime}</p>
        <p>Session user: {currentUser}</p>
      </div>
    </div>
  );
};

export default PaymentForm;n
