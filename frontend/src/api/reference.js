import client from './client';

export const geographyApi = {
  countries: () => client.get('/geography/countries'),
  regions: (countryId) => client.get('/geography/regions', { params: { countryId } }),
  createRegion: (data) => client.post('/geography/regions', data),
  districts: (regionId) => client.get('/geography/districts', { params: { regionId } }),
  createDistrict: (data) => client.post('/geography/districts', data),
};

export const educationApi = {
  levels: () => client.get('/education/levels'),
  createLevel: (data) => client.post('/education/levels', data),
  classesForLevel: (levelId) => client.get(`/education/levels/${levelId}/classes`),
  createClass: (data) => client.post('/education/classes', data),
  subjects: (educationLevelId) => client.get('/education/subjects', { params: { educationLevelId } }),
  createSubject: (data) => client.post('/education/subjects', data),
  universities: () => client.get('/education/universities'),
};
