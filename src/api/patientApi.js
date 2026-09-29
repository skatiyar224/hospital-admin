import { api } from '@/lib/axios';

export const patientApi = {
  list: async (params) => (await api.get('/admin/patients', { params })).data,
  getOne: async (id) => (await api.get(`/admin/patients/${id}`)).data.data,
  setActive: async (id, isActive) => (await api.patch(`/admin/patients/${id}/status`, { isActive })).data.data.patient,
};
