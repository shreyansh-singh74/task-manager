import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-store')
    ? JSON.parse(localStorage.getItem('auth-store') || '{}').state?.token
    : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signUp: (name: string, email: string, password: string) =>
    api.post('/auth/sign-up', { name, email, password }),

  signIn: (email: string, password: string) =>
    api.post('/auth/sign-in', { email, password }),
};

export const taskAPI = {
  getAllTasks: (page = 1, limit = 10) =>
    api.get('/tasks', { params: { page, limit } }),

  getAssignedTasks: (page = 1, limit = 10) =>
    api.get('/tasks/assigned/me', { params: { page, limit } }),

  getCreatedTasks: (page = 1, limit = 10) =>
    api.get('/tasks/created/me', { params: { page, limit } }),

  getTaskById: (id: string) => api.get(`/tasks/${id}`),

  createTask: (taskData: {
    title: string;
    description?: string;
    priority?: string;
    assigned_to?: string;
    due_date?: string;
  }) => api.post('/tasks', taskData),

  updateTask: (id: string, taskData: Partial<any>) =>
    api.put(`/tasks/${id}`, taskData),

  deleteTask: (id: string) => api.delete(`/tasks/${id}`),

  getActivityLogs: (taskId: string) => api.get(`/tasks/${taskId}/logs`),
};

export default api;
