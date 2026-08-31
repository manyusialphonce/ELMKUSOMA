import client from './client';

export const quizzesApi = {
  list: (params) => client.get('/quizzes', { params }),
  get: (id) => client.get(`/quizzes/${id}`),
  create: (data) => client.post('/quizzes', data),
  submitAttempt: (id, answers) => client.post(`/quizzes/${id}/attempts`, { answers }),
  results: (id) => client.get(`/quizzes/${id}/results`),
};

export const assignmentsApi = {
  list: (params) => client.get('/assignments', { params }),
  get: (id) => client.get(`/assignments/${id}`),
  create: (data) => client.post('/assignments', data),
  submit: (id, data) => client.post(`/assignments/${id}/submissions`, data),
  listSubmissions: (id) => client.get(`/assignments/${id}/submissions`),
  grade: (submissionId, data) => client.patch(`/submissions/${submissionId}/grade`, data),
};
