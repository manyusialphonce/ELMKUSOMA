import client from './client';

export const parentsApi = {
  listChildren: () => client.get('/parents/children'),
  linkChild: (data) => client.post('/parents/children', data),
  unlinkChild: (studentId) => client.delete(`/parents/children/${studentId}`),
  childProgress: (studentId) => client.get(`/parents/children/${studentId}/progress`),
  childCertificates: (studentId) => client.get(`/parents/children/${studentId}/certificates`),
};
