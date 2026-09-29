import { api } from '@/lib/axios';

export const messageApi = {
  list: async (params) => (await api.get('/admin/messages', { params })).data,
  updateStatus: async (id, status) => (await api.patch(`/admin/messages/${id}`, { status })).data.data.message,
  remove: async (id) => (await api.delete(`/admin/messages/${id}`)).data,
};
