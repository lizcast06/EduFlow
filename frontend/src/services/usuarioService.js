import api from './api';

export const usuarioService = {
  getEstudiantes: async () => {
    try {
      const response = await api.get('/usuarios/estudiantes');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching estudiantes:', error);
      throw error;
    }
  },

  getAll: async () => {
    const response = await api.get('/usuarios');
    return response.data.data;
  },

  create: async (userData) => {
    const response = await api.post('/usuarios', userData);
    return response.data.data;
  },

  update: async (id, userData) => {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data.data;
  },

  toggleStatus: async (id) => {
    const response = await api.patch(`/usuarios/${id}/estado`);
    return response.data.data;
  }
};
