import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// Interceptor for JWT
api.interceptors.request.use((config) => {
  // Logic to attach token will be handled dynamically 
  // or we can pass token down from context.
  // Actually, since token is in memory (AuthContext), 
  // we might need to inject it or configure it from the context provider.
  return config;
});

export default api;
