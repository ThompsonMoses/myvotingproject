// Vote Page Component for Monetized Voting App
// This page handles the voting process with Paystack payment integration

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, CreditCard, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  calculateTotalPrice, 
  formatPrice, 
  generateTransactionReference,
  initializePaystackPayment,
  loadPaystackScript,
  validatePaymentData
} from '../utils/paystack';
import { updateContestantVotes, recordVoteTransaction } from '../config/firebase';

const Vote = () => {
  const { contestantId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get contestant data from navigation state or fetch it
  const contestant = location.state?.contestant;
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    voteCount: 1
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Load Paystack script on component mount
  useEffect(() => {
    const loadPaystack = async () => {
      try {
        await loadPaystackScript();
        setPaystackLoaded(true);
      } catch (error) {
        console.error('Failed to load Paystack:', error);
        toast.error('Payment system unavailable. Please try again later.');
      }
    };

    loadPaystack();
  }, []);

  // Redirect if no contestant data
  useEffect(() => {
    if (!contestant) {
      navigate('/');
    }
  }, [contestant, navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'voteCount' ? Math.max(1, parseInt(value) || 1) : value
    }));
  };

  // Calculate total price
  const totalPrice = calculateTotalPrice(formData.voteCount);

  // Handle vote submission
  const handleVoteSubmit = async (e) => {
    e.preventDefault();
    
    if (!paystackLoaded) {
      toast.error('Payment system is loading. Please wait...');
      return;
    }

    // Validate form data
    const validation = validatePaymentData({
      email: formData.email,
      amount: totalPrice,
      reference: generateTransactionReference()
    });

    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    setPaymentProcessing(true);

    try {
      // Prepare payment data
      const paymentData = {
        email: formData.email,
        amount: totalPrice,
        reference: generateTransactionReference(),
        callback_url: window.location.origin + '/vote/success'
      };

      // Initialize Paystack payment
      initializePaystackPayment(
        paymentData,
        // Success callback
        async (response) => {
          try {
            // Update contestant vote count in Firebase
            await updateContestantVotes(contestant.id, formData.voteCount);
            
            // Record vote transaction
            await recordVoteTransaction({
              contestantId: contestant.id,
              contestantName: contestant.name,
              voteCount: formData.voteCount,
              amount: totalPrice,
              email: formData.email,
              reference: paymentData.reference,
              paystackReference: response.reference
            });

            // Show success message
            toast.success(`Successfully voted for ${contestant.name}! 🎉`);
            
            // Redirect to home page after a short delay
            setTimeout(() => {
              navigate('/');
            }, 2000);

          } catch (error) {
            console.error('Error updating vote count:', error);
            toast.error('Vote recorded but there was an issue updating the count. Please contact support.');
          } finally {
            setPaymentProcessing(false);
          }
        },
        // Close callback
        () => {
          setPaymentProcessing(false);
          toast.error('Payment cancelled');
        }
      );

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      setPaymentProcessing(false);
    }
  };

  // Loading state
  if (!contestant) {
    return <LoadingSpinner size="xl" text="Loading contestant..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Contestants
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Contestant Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="card">
              <div className="text-center">
                <img
                  src={contestant.imageUrl}
                  alt={contestant.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-primary-100"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face';
                  }}
                />
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {contestant.name}
                </h1>
                
                <p className="text-gray-600 mb-4">
                  {contestant.bio}
                </p>
                
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <span>{contestant.age} years old</span>
                  <span>•</span>
                  <span>{contestant.location}</span>
                </div>
              </div>
            </div>

            {/* Current Vote Count */}
            <div className="card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Heart className="w-6 h-6 text-primary-600 fill-current" />
                  <span className="text-2xl font-bold text-primary-700">
                    {contestant.voteCount?.toLocaleString() || 0}
                  </span>
                </div>
                <p className="text-primary-600 font-medium">Current Votes</p>
              </div>
            </div>
          </motion.div>

          {/* Voting Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="card">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Vote for {contestant.name}
                </h2>
                <p className="text-gray-600">
                  Each vote costs ₦1.00. Choose how many votes you want to purchase.
                </p>
              </div>

              <form onSubmit={handleVoteSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Vote Count Input */}
                <div>
                  <label htmlFor="voteCount" className="block text-sm font-medium text-gray-700 mb-2">
                    <Heart className="w-4 h-4 inline mr-2" />
                    Number of Votes
                  </label>
                  <input
                    type="number"
                    id="voteCount"
                    name="voteCount"
                    value={formData.voteCount}
                    onChange={handleInputChange}
                    min="1"
                    max="1000"
                    required
                    className="input-field"
                    placeholder="Enter number of votes"
                  />
                </div>

                {/* Price Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Votes:</span>
                    <span className="font-medium">{formData.voteCount} × ₦1.00</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold text-gray-900 border-t pt-2">
                    <span>Total:</span>
                    <span className="text-primary-600">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  type="submit"
                  disabled={paymentProcessing || !paystackLoaded}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paymentProcessing ? (
                    <>
                      <LoadingSpinner size="sm" text="" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Pay with Paystack
                    </>
                  )}
                </button>

                {/* Payment Status */}
                {!paystackLoaded && (
                  <div className="flex items-center gap-2 text-yellow-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Loading payment system...
                  </div>
                )}

                {/* Security Notice */}
                <div className="text-center text-xs text-gray-500">
                  <p>🔒 Your payment is secured by Paystack</p>
                  <p>You will be redirected to a secure payment page</p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Vote; 