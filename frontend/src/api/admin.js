import client from './client';

export const notificationsApi = {
  list: (params) => client.get('/notifications', { params }),
  markRead: (id) => client.patch(`/notifications/${id}/read`),
  markAllRead: () => client.patch('/notifications/read-all'),
};

export const adminApi = {
  listVerifications: (status) => client.get('/admin/verifications', { params: { status } }),
  approveVerification: (userId) => client.patch(`/admin/verifications/${userId}/approve`),
  rejectVerification: (userId, reason) =>
    client.patch(`/admin/verifications/${userId}/reject`, { reason }),
  listUsers: (params) => client.get('/admin/users', { params }),
  suspendUser: (id) => client.patch(`/admin/users/${id}/suspend`),
  reactivateUser: (id) => client.patch(`/admin/users/${id}/reactivate`),
  listSettings: () => client.get('/admin/settings'),
  updateSetting: (key, value) => client.put(`/admin/settings/${key}`, { value }),
};
