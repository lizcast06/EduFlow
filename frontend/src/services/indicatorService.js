import api from './api';

export const indicatorService = {
  getDashboardStats: async () => {
    const response = await api.get('/dashboard/avance');
    return response.data.data;
  }
};
