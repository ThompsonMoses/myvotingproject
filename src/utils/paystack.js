// Paystack Payment Integration for Monetized Voting App
// This file handles Paystack payment processing for vote purchases

// 💳 Paystack Configuration
// Replace with your actual Paystack public key
// Get this from your Paystack Dashboard: https://dashboard.paystack.com/
const PAYSTACK_PUBLIC_KEY = 'pk_test_d823d36b84745482535c1ecdb7ddfe4bf55bf14b';

// 💰 Pricing Configuration
export const PRICE_PER_VOTE = 10000; // Price in kobo (₦100.00)
export const CURRENCY = 'NGN';

/**
 * Initialize Paystack payment
 * @param {Object} paymentData - Payment information
 * @param {string} paymentData.email - Customer email
 * @param {number} paymentData.amount - Amount in kobo
 * @param {string} paymentData.reference - Unique transaction reference
 * @param {string} paymentData.callback_url - Callback URL after payment
 * @param {Function} onSuccess - Success callback function
 * @param {Function} onClose - Close callback function
 */
export const initializePaystackPayment = (paymentData, onSuccess, onClose) => {
  // Check if Paystack script is loaded
  if (typeof window.PaystackPop === 'undefined') {
    console.error('Paystack script not loaded');
    return;
  }

  const handler = window.PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: paymentData.email,
    amount: paymentData.amount,
    currency: CURRENCY,
    ref: paymentData.reference,
    callback: function(response) {
      // Payment successful
      console.log('Payment successful:', response);
      onSuccess(response);
    },
    onClose: function() {
      // Payment modal closed
      console.log('Payment modal closed');
      onClose();
    }
  });

  handler.openIframe();
};

/**
 * Calculate total price for votes
 * @param {number} voteCount - Number of votes
 * @returns {number} Total price in kobo
 */
export const calculateTotalPrice = (voteCount) => {
  return voteCount * PRICE_PER_VOTE;
};

/**
 * Format price for display
 * @param {number} amountInKobo - Amount in kobo
 * @returns {string} Formatted price string
 */
export const formatPrice = (amountInKobo) => {
  const amountInNaira = amountInKobo / 100;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amountInNaira);
};

/**
 * Generate unique transaction reference
 * @returns {string} Unique reference string
 */
export const generateTransactionReference = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `VOTE_${timestamp}_${random}`.toUpperCase();
};

/**
 * Load Paystack script dynamically
 * @returns {Promise} Promise that resolves when script is loaded
 */
export const loadPaystackScript = () => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (window.PaystackPop) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    
    script.onload = () => {
      console.log('Paystack script loaded successfully');
      resolve();
    };
    
    script.onerror = () => {
      console.error('Failed to load Paystack script');
      reject(new Error('Failed to load Paystack script'));
    };

    document.head.appendChild(script);
  });
};

/**
 * Validate payment data before processing
 * @param {Object} paymentData - Payment data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validatePaymentData = (paymentData) => {
  const errors = [];

  if (!paymentData.email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentData.email)) {
    errors.push('Invalid email format');
  }

  if (!paymentData.amount || paymentData.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }

  if (!paymentData.reference) {
    errors.push('Transaction reference is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  initializePaystackPayment,
  calculateTotalPrice,
  formatPrice,
  generateTransactionReference,
  loadPaystackScript,
  validatePaymentData
}; 