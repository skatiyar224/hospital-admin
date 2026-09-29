import { api } from '@/lib/axios';

export const dashboardApi = {
  getStats: async () => (await api.get('/admin/dashboard')).data.data,
};
