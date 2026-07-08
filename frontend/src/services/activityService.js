import api from './api';

export const activityService = {
  getAll: async () => {
    // return (await api.get('/activities')).data;
    return [];
  },
  getById: async (id) => {
    // return (await api.get(`/activities/${id}`)).data;
    return null;
  },
  create: async (data) => {
    // return (await api.post('/activities', data)).data;
    return null;
  },
  update: async (id, data) => {
    // return (await api.put(`/activities/${id}`, data)).data;
    return null;
  },
  delete: async (id) => {
    // await api.delete(`/activities/${id}`);
  }
};
