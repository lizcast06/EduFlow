import api from './api';

export const evidenceService = {
  getByActivity: async (activityId) => {
    const response = await api.get(`/actividades/${activityId}/evidencias`);
    return response.data.data || [];
  },
  add: async (activityId, data) => {
    const response = await api.post(`/actividades/${activityId}/evidencias`, data);
    return response.data;
  }
};
