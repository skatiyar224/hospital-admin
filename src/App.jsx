/**
 * App.jsx (admin)
 * /login is public; everything else sits behind AdminRoute (admin role
 * required). To add a section: create pages/Foo.jsx, add it to NAV in
 * components/layout/AdminLayout.jsx and add a <Route> here.
 */
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminRoute, GuestRoute } from '@/components/layout/AdminRoute';
import { Toaster } from '@/components/ui/Toast';
import { Spinner } from '@/components/ui/Card';
import { useBootstrapAuth } from '@/hooks/useAuth';

const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Doctors = lazy(() => import('@/pages/Doctors'));
const Departments = lazy(() => import('@/pages/Departments'));
const Appointments = lazy(() => import('@/pages/Appointments'));
const Patients = lazy(() => import('@/pages/Patients'));
const Messages = lazy(() => import('@/pages/Messages'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const Loader = () => <div className="flex min-h-[40vh] items-center justify-center"><Spinner className="h-6 w-6" /></div>;

export default function App() {
  useBootstrapAuth();

  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}
