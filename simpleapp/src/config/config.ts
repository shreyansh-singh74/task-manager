export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
};

export const APP_CONFIG = {
  name: 'Collaborative Task Manager',
  description: 'Manage your tasks efficiently with real-time collaboration',
  version: '1.0.0',
};
