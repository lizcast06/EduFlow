import api from './api';

export const commentService = {
  getByActivity: async (activityId) => {
    const response = await api.get(`/actividades/${activityId}/comentarios`);
    return response.data.data || [];
  },
  create: async (activityId, data) => {
    const response = await api.post(`/actividades/${activityId}/comentarios`, data);
    return response.data;
  }
};
