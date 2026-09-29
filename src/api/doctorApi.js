import { api } from '@/lib/axios';

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };

export const doctorApi = {
  list: async (params) => (await api.get('/admin/doctors', { params })).data,
  create: async (formData) => (await api.post('/admin/doctors', formData, multipart)).data.data.doctor,
  update: async (id, formData) => (await api.put(`/admin/doctors/${id}`, formData, multipart)).data.data.doctor,
  setActive: async (id, isActive) => (await api.put(`/admin/doctors/${id}`, { isActive })).data.data.doctor,
  remove: async (id) => (await api.delete(`/admin/doctors/${id}`)).data,
};
