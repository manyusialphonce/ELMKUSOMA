import client from './client';

export const advertisementsApi = {
  list: (params) => client.get('/advertisements', { params }),
  mine: () => client.get('/advertisements/mine'),
  create: (data) => client.post('/advertisements', data),
  pending: () => client.get('/advertisements/pending'),
  approve: (id) => client.patch(`/advertisements/${id}/approve`),
  reject: (id, reason) => client.patch(`/advertisements/${id}/reject`, { reason }),
};

export const academicApi = {
  departments: (facultyId) => client.get('/academic/departments', { params: { facultyId } }),
  programmes: (departmentId) => client.get('/academic/programmes', { params: { departmentId } }),
  courses: (params) => client.get('/academic/courses', { params }),
  years: () => client.get('/academic/years'),
};

export const searchApi = {
  search: (q) => client.get('/search', { params: { q } }),
};
