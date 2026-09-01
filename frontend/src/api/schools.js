import client from './client';

export const schoolsApi = {
  list: (params) => client.get('/schools', { params }),

  getBySlug: (slug) =>
    client.get(`/schools/${slug}`),

  create: (data) =>
    client.post('/schools', data),
};