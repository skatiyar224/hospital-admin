/**
 * authStore.js (admin)
 * Access token lives in memory only. Only users with role === 'admin'
 * are ever stored here; anyone else is rejected at login/bootstrap.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isBootstrapped: false,
      setAccessToken: (token) => set({ accessToken: token }),
      setSession: (user, accessToken) => set({ user, accessToken }),
      setBootstrapped: () => set({ isBootstrapped: true }),
      clearSession: () => set({ user: null, accessToken: null }),
    }),
    { name: 'hospital-admin-auth', partialize: (s) => ({ user: s.user }) }
  )
);
