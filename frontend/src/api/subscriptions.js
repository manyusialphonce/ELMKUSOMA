import client from './client';

export const subscriptionsApi = {
  // Get available subscription plans
  plans: () => client.get('/subscriptions/plans'),

  // Get current user's subscriptions
  mine: () => client.get('/subscriptions/me'),

  // Start a new subscription/payment
  subscribe: (data) => client.post('/subscriptions', data),

  // DEVELOPMENT ONLY:
  // Confirm a pending payment manually for testing
  confirmDevelopmentPayment: (paymentId) =>
    client.post(`/subscriptions/payments/${paymentId}/confirm`),
};