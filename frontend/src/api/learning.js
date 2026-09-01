import client from './client';

export const lessonsApi = {
  list: (params) => client.get('/lessons', { params }),
  get: (id) => client.get(`/lessons/${id}`),
  create: (data) => client.post('/lessons', data),
  publish: (id) => client.patch(`/lessons/${id}/publish`),
  saveProgress: (id, progressPercent) => client.put(`/lessons/${id}/progress`, { progressPercent }),
  myProgress: () => client.get('/lessons/progress/me'),
};

export const certificatesApi = {
  mine: () => client.get('/certificates/me'),
  issue: (data) => client.post('/certificates', data),
  verify: (code) => client.get(`/certificates/verify/${code}`),
  revoke: (id) => client.patch(`/certificates/${id}/revoke`),
};
