import { api } from '@/lib/axios';

export const authApi = {
  login: async (payload) => (await api.post('/auth/login', payload)).data.data,
  logout: async () => (await api.post('/auth/logout')).data,
  refresh: async () => (await api.post('/auth/refresh')).data.data,
  getMe: async () => (await api.get('/auth/me')).data.data.user,
};
