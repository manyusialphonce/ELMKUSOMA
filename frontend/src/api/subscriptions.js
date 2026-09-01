import client from './client';

export const subscriptionsApi = {
  plans: () => client.get('/subscriptions/plans'),
  mine: () => client.get('/subscriptions/me'),
  subscribe: (data) => client.post('/subscriptions', data),
};
