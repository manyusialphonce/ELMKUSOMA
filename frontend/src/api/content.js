import client from './client';

export const recordingsApi = {
  list: (params) => client.get('/recordings', { params }),
  get: (id) => client.get(`/recordings/${id}`),
  create: (data) => client.post('/recordings', data),
  publish: (id) => client.patch(`/recordings/${id}/publish`),
};

export const resourcesApi = {
  list: (params) => client.get('/resources', { params }),
  get: (id) => client.get(`/resources/${id}`),
  create: (data) => client.post('/resources', data),
  publish: (id) => client.patch(`/resources/${id}/publish`),
};
