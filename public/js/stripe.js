/* eslint-disable */
import axios from 'axios';

import { showAlert } from './alerts';

if (!window.Stripe) return;
const stripe = Stripe(
  'pk_test_51MUpsDIgjR6iJF4FPUkZHsOJIxY0wTP8wAD3rPyBmXuLBJKuoVAnCmObWVqudYaHGBZ0uYxtqfFxiEuRngebEN7000U6WwO3RX'
);

export const bookTour = async (tourId) => {
  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
