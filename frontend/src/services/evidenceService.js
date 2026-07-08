import api from './api';

export const evidenceService = {
  getByActivity: async (activityId) => {
    // return (await api.get(`/activities/${activityId}/evidence`)).data;
    return [];
  },
  add: async (activityId, data) => {
    // return (await api.post(`/activities/${activityId}/evidence`, data)).data;
    return null;
  }
};
