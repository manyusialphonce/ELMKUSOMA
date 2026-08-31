import client from './client';

export const geographyApi = {
  regions: (countryId) => client.get('/geography/regions', { params: { countryId } }),
  districts: (regionId) => client.get('/geography/districts', { params: { regionId } }),
};

export const educationApi = {
  levels: () => client.get('/education/levels'),
  classesForLevel: (levelId) => client.get(`/education/levels/${levelId}/classes`),
  subjects: (educationLevelId) => client.get('/education/subjects', { params: { educationLevelId } }),
  universities: () => client.get('/education/universities'),
};
