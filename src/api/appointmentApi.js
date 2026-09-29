import { api } from '@/lib/axios';

export const appointmentApi = {
  list: async (params) => (await api.get('/admin/appointments', { params })).data,
  updateStatus: async (id, payload) => (await api.patch(`/admin/appointments/${id}/status`, payload)).data.data.appointment,
};
