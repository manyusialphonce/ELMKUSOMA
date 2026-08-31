import client from './client';

export const setupDraftsApi = {
  getActive: (type) => client.get('/setup-drafts', { params: { type } }),
  start: (type) => client.post('/setup-drafts', { type }),
  update: (id, data) => client.put(`/setup-drafts/${id}`, data),
  complete: (id) => client.post(`/setup-drafts/${id}/complete`),
};
