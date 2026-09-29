/**
 * AdminLayout.jsx
 * Dark fixed sidebar on desktop; slide-in drawer on mobile.
 */
import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, Layers, CalendarDays, Users, MessageSquare, LogOut, Menu, X, ExternalLink, Cross } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useAdminLogout } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/doctors', label: 'Doctors', icon: Stethoscope },
  { to: '/departments', label: 'Departments', icon: Layers },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
];

const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL || 'http://localhost:5173';

function SidebarContent({ onNavigate }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAdminLogout();

  return (
    <div className="flex h-full flex-col bg-sidebar text-white">
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white"><Cross className="h-4.5 w-4.5" strokeWidth={2.5} /></span>
        <span className="font-semibold tracking-tight">Sunvale</span>
        <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[11px] font-medium text-white/70">Admin</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn('flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-brand text-white' : 'text-white/70 hover:bg-sidebar-soft hover:text-white')
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}

        <a href={WEBSITE_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-sidebar-soft hover:text-white">
          <ExternalLink className="h-4 w-4" /> View website
        </a>
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar name={user?.name} className="bg-white/10 text-white" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-white/50">{user?.email}</p>
          </div>
        </div>
        <button onClick={() => logout.mutate()} className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-sidebar-soft hover:text-white">
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const current = NAV.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)));

  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 lg:block"><SidebarContent /></aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64"><SidebarContent onNavigate={() => setOpen(false)} /></div>
        </div>
      )}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-surface px-4 lg:px-8">
          <button className="lg:hidden text-ink" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <h1 className="text-base font-semibold text-ink">{current?.label || 'Admin'}</h1>
        </header>

        <main className="p-4 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
