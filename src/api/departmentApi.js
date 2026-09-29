import { api } from '@/lib/axios';

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };

export const departmentApi = {
  list: async () => (await api.get('/admin/departments')).data.data.departments,
  create: async (formData) => (await api.post('/admin/departments', formData, multipart)).data.data.department,
  update: async (id, formData) => (await api.put(`/admin/departments/${id}`, formData, multipart)).data.data.department,
  setActive: async (id, isActive) => (await api.put(`/admin/departments/${id}`, { isActive })).data.data.department,
  remove: async (id) => (await api.delete(`/admin/departments/${id}`)).data,
};
