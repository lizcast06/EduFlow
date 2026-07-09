import api from './api';

export const commentService = {
  getByActivity: async (activityId) => {
    // return (await api.get(`/activities/${activityId}/comments`)).data;
    return [];
  },
  create: async (activityId, data) => {
    // return (await api.post(`/activities/${activityId}/comments`, data)).data;
    return null;
  }
};
