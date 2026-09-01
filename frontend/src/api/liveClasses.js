import client from './client';

export const liveClassesApi = {
  list: (params) => client.get('/live-classes', { params }),
  get: (id) => client.get(`/live-classes/${id}`),
  create: (data) => client.post('/live-classes', data),
  start: (id) => client.post(`/live-classes/${id}/start`),
  end: (id) => client.post(`/live-classes/${id}/end`),
  join: (id) => client.post(`/live-classes/${id}/join`),
  leave: (id) => client.post(`/live-classes/${id}/leave`),
  listQuestions: (liveClassId) => client.get(`/live-classes/${liveClassId}/questions`),
  requestQuestion: (liveClassId, question) =>
    client.post(`/live-classes/${liveClassId}/questions`, { question }),
};

export const questionsApi = {
  approve: (id) => client.patch(`/questions/${id}/approve`),
  reject: (id) => client.patch(`/questions/${id}/reject`),
  answer: (id, answer) => client.patch(`/questions/${id}/answer`, { answer }),
};
