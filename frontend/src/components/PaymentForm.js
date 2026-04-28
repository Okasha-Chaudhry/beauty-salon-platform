import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { confirmPayment } from '../services/api';

const PaymentForm = ({ clientSecret, bookingId, amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError('');

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        await confirmPayment({ bookingId });
        onSuccess();
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      background: 'white', borderRadius: '20px',
      padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      maxWidth: '480px', width: '100%'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <p style={{ fontSize: '48px' }}>💳</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#1f2937', marginTop: '8px' }}>
          Complete Payment
        </h2>
        <p style={{ color: '#6b7280', marginTop: '4px' }}>Secure payment powered by Stripe</p>
      </div>

      {/* Amount */}
      <div style={{
        background: '#fdf2f8', borderRadius: '12px',
        padding: '16px', marginBottom: '24px', textAlign: 'center'
      }}>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Amount to Pay</p>
        <p style={{ fontSize: '36px', fontWeight: '700', color: '#db2777', fontFamily: "'Playfair Display', serif" }}>
          Rs. {amount}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Card Input */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: '#374151', fontSize: '14px' }}>
            Card Details
          </label>
          <div style={{
            padding: '14px 16px',
            border: '2px solid #fce7f3',
            borderRadius: '12px',
            background: 'white'
          }}>
            <CardElement options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1f2937',
                  fontFamily: "'Inter', sans-serif",
                  '::placeholder': { color: '#9ca3af' }
                },
                invalid: { color: '#dc2626' }
              }
            }} />
          </div>
          <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '6px' }}>
            🔒 Test card: 4242 4242 4242 4242 | Any future date | Any CVC
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fca5a5',
            color: '#dc2626', padding: '12px', borderRadius: '12px',
            marginBottom: '16px', fontWeight: '600', textAlign: 'center'
          }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={loading || !stripe}
          style={{
            width: '100%', padding: '14px',
            background: loading ? '#f9a8d4' : 'linear-gradient(135deg, #db2777, #9d174d)',
            color: 'white', border: 'none',
            borderRadius: '12px', fontSize: '16px',
            fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 15px rgba(219,39,119,0.4)',
            marginBottom: '12px'
          }}
        >
          {loading ? '⏳ Processing...' : `Pay Rs. ${amount} 💳`}
        </button>

        <button
          type="button"
          onClick={onCancel}
          style={{
            width: '100%', padding: '14px',
            background: 'transparent',
            color: '#6b7280', border: '2px solid #e5e7eb',
            borderRadius: '12px', fontSize: '16px',
            fontWeight: '700', cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <p style={{ color: '#9ca3af', fontSize: '12px' }}>
          🔒 Secured by Stripe — Your card info is never stored
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;