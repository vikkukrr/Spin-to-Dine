import { useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const StripePayment = ({ amount, onSuccess, onError }) => {
  const [processing, setProcessing] = useState(false);
  const { addToast } = useToast();

  const handlePayment = async () => {
    setProcessing(true);
    try {
      if (!process.env.REACT_APP_STRIPE_KEY) {
        addToast('Stripe not configured. Order placed with pending payment.', 'info');
        if (onSuccess) onSuccess();
        return;
      }

      const res = await api.post('/payments/create-payment-intent', { amount });
      const { clientSecret } = res.data;

      if (!clientSecret) {
        addToast('Stripe not configured on server.', 'info');
        if (onSuccess) onSuccess();
        return;
      }

      const { loadStripe } = await import('@stripe/stripe-js');
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_KEY);

      const { error } = await stripe.confirmCardPayment(clientSecret);
      if (error) {
        addToast(error.message, 'error');
        if (onError) onError(error);
      } else {
        addToast('Payment successful!', 'success');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      addToast('Payment processing failed', 'error');
      if (onError) onError(err);
    } finally {
      setProcessing(false);
    }
  };

  return { handlePayment, processing };
};

export default StripePayment;
