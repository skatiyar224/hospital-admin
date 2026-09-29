/**
 * axios.js (admin)
 * Same refresh-on-401 strategy as the patient site. Concurrent 401s share
 * one in-flight refresh call.
 */
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
export const ASSET_URL = import.meta.env.VITE_ASSET_URL || 'http://localhost:5000';

export const api = axios.create({ baseURL, withCredentials: true });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise = null;

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    const isAuthRoute = original?.url?.includes('/auth/');
    if (error.response?.status === 401 && !original._retry && !isAuthRoute) {
      original._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = api.post('/auth/refresh').finally(() => { refreshPromise = null; });
        }
        const { data } = await refreshPromise;
        useAuthStore.getState().setAccessToken(data.data.accessToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch (e) {
        useAuthStore.getState().clearSession();
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error) {
  const details = error?.response?.data?.errors;
  if (details?.length) return details.map((d) => d.message).join(', ');
  return error?.response?.data?.message || error?.message || 'Something went wrong. Please try again.';
}

export const resolveImage = (src) => (src ? (src.startsWith('http') ? src : `${ASSET_URL}${src}`) : null);
