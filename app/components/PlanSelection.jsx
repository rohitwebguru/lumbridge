import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe.js with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const PlanSelection = ({ plans }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (priceId) => {
    setLoading(true);
    try {
      const stripe = await stripePromise;

      // Call API route to create a checkout session
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe checkout error:', error);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="plan-selection">
      {plans.map((plan) => (
        <div key={plan.id} className="plan">
          <h2>{plan.name}</h2>
          <p>{plan.description}</p>
          <p>${plan.price}</p>
          <button
            disabled={loading}
            onClick={() => handleCheckout(plan.priceId)}
          >
            {loading ? 'Loading...' : 'Choose Plan'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default PlanSelection;
