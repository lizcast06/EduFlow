import api from './api';

export const authService = {
  login: async (credentials) => {
    // const response = await api.post('/auth/login', credentials);
    // return response.data;
    
    // Mock for now
    return new Promise(resolve => setTimeout(() => resolve({ token: 'mock-jwt-token', user: { id: 1, name: 'Test User', role: 'admin' } }), 500));
  },
  logout: async () => {
    // await api.post('/auth/logout');
    return new Promise(resolve => setTimeout(resolve, 300));
  }
};
