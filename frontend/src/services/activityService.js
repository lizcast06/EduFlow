import api from './api';

export const activityService = {
  getAll: async () => {
    const response = await api.get('/actividades');
    return response.data.data || [];
  },
  getById: async (id) => {
    const response = await api.get(`/actividades/${id}`);
    return response.data.data;
  },
  create: async (data) => {
    const response = await api.post('/actividades', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/actividades/${id}`, data);
    return response.data;
  },
  updateStatus: async (id, estado_nombre) => {
    const response = await api.put(`/actividades/${id}/estado`, { estado: estado_nombre });
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/actividades/${id}`);
  },
  getHistorial: async (id) => {
    const response = await api.get(`/actividades/${id}/historial`);
    return response.data.data || [];
  }
};
