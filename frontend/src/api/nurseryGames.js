import client from './client';

export const nurseryGamesApi = {
  list: (params) => client.get('/nursery-games', { params }),
  get: (id) => client.get(`/nursery-games/${id}`),
  saveProgress: (id, data) => client.put(`/nursery-games/${id}/progress`, data),
};

export const liveChatApi = {
  list: (liveClassId) => client.get(`/live-classes/${liveClassId}/chat`),
  post: (liveClassId, message) => client.post(`/live-classes/${liveClassId}/chat`, { message }),
};
