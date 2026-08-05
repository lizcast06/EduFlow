import api from './api';

export const grupoService = {
  getAll: async () => {
    const response = await api.get('/grupos');
    return response.data.data;
  },

  create: async (data) => {
    const response = await api.post('/grupos', data);
    return response.data.data;
  },

  join: async (codigo_acceso) => {
    const response = await api.post('/grupos/unirse', { codigo_acceso });
    return response.data.data;
  }
};
