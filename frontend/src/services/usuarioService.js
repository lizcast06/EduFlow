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
  }
};
