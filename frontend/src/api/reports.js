import client from './client';

export const reportsApi = {
  studentReport: () => client.get('/reports/student/me'),
  teacherReport: () => client.get('/reports/teacher/me'),
  teacherStudents: () => client.get('/reports/teacher/students'),
  adminOverview: () => client.get('/reports/admin/overview'),
  adminGeography: () => client.get('/reports/admin/geography'),
};
