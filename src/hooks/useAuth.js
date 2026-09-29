/**
 * useAuth.js (admin)
 * Every session path enforces role === 'admin'. A non-admin who logs in
 * (or whose refresh cookie belongs to a patient) is rejected here.
 */
import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/store/authStore';

export function useBootstrapAuth() {
  const isBootstrapped = useAuthStore((s) => s.isBootstrapped);

  useEffect(() => {
    if (isBootstrapped) return;
    const { setSession, clearSession, setBootstrapped, setAccessToken } = useAuthStore.getState();
    (async () => {
      try {
        const { accessToken } = await authApi.refresh();
        setAccessToken(accessToken);
        const user = await authApi.getMe();
        if (user.role === 'admin') setSession(user, accessToken);
        else clearSession();
      } catch {
        clearSession();
      } finally {
        setBootstrapped();
      }
    })();
  }, [isBootstrapped]);
}

export function useAdminLogin() {
  return useMutation({
    mutationFn: async (payload) => {
      const data = await authApi.login(payload);
      if (data.user.role !== 'admin') {
        await authApi.logout().catch(() => {});
        throw new Error('This account does not have admin access.');
      }
      return data;
    },
    onSuccess: (data) => useAuthStore.getState().setSession(data.user, data.accessToken),
  });
}

export function useAdminLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      useAuthStore.getState().clearSession();
      queryClient.clear();
    },
  });
}
