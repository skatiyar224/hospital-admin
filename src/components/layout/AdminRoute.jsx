/**
 * AdminRoute.jsx - blocks the whole panel unless an admin session exists.
 * Waits for the silent-refresh bootstrap so a valid session isn't bounced.
 */
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Spinner } from '@/components/ui/Card';

export function AdminRoute() {
  const isReady = useAuthStore((s) => s.isBootstrapped);
  const isAdmin = useAuthStore((s) => s.user?.role === 'admin');
  const location = useLocation();

  if (!isReady) return <div className="flex min-h-screen items-center justify-center"><Spinner className="h-6 w-6" /></div>;
  if (!isAdmin) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
}

export function GuestRoute() {
  const isReady = useAuthStore((s) => s.isBootstrapped);
  const isAdmin = useAuthStore((s) => s.user?.role === 'admin');
  if (!isReady) return null;
  if (isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}
