/**
 * Dashboard.jsx - overview counts, today's schedule, and the next 7 days'
 * booking load (plain CSS bars, no chart library).
 */
import { Link } from 'react-router-dom';
import { Users, Stethoscope, Layers, CalendarDays, MessageSquare } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboard';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { AppointmentStatusBadge } from '@/components/common/StatusBadge';
import { Card, Skeleton } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/Feedback';
import { formatDateLong, formatTime, weekdayShort, dayNumber } from '@/lib/dates';

export default function Dashboard() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isError) return <ErrorState title="Couldn't load the dashboard" description="Check that the backend is running and try again." />;

  const maxWeekCount = Math.max(1, ...(data?.nextSevenDays?.map((d) => d.count) || [1]));

  return (
    <div>
      <PageHeader title="Overview" description={data ? formatDateLong(data.today) : 'Loading…'} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28" />)
        ) : (
          <>
            <StatCard label="Today's visits" value={data.todaysAppointments.length} icon={CalendarDays} />
            <StatCard label="Pending" value={data.pendingAppointments} icon={CalendarDays} hint="Awaiting confirmation" />
            <StatCard label="Doctors" value={data.doctors} icon={Stethoscope} />
            <StatCard label="Departments" value={data.departments} icon={Layers} />
            <StatCard label="New messages" value={data.newMessages} icon={MessageSquare} />
          </>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <h3 className="text-sm font-semibold text-ink">Next 7 days</h3>
          <div className="mt-4 space-y-3">
            {isLoading
              ? Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-6" />)
              : data.nextSevenDays.map((d) => (
                  <div key={d.date} className="flex items-center gap-3">
                    <span className="w-10 shrink-0 text-xs text-ink-soft">{weekdayShort(d.date)} {dayNumber(d.date)}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-paper">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${(d.count / maxWeekCount) * 100}%` }} />
                    </div>
                    <span className="w-5 shrink-0 text-right text-xs font-medium text-ink">{d.count}</span>
                  </div>
                ))}
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Today's schedule</h3>
            <Link to="/appointments" className="text-xs font-medium text-brand-dark hover:underline">View all</Link>
          </div>
          <div className="mt-3 divide-y divide-line">
            {isLoading ? (
              <Skeleton className="h-32" />
            ) : data.todaysAppointments.length === 0 ? (
              <p className="py-8 text-center text-sm text-ink-soft">No appointments scheduled for today.</p>
            ) : (
              data.todaysAppointments.map((a) => (
                <div key={a._id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{formatTime(a.timeSlot)} · {a.patient?.name || a.patientName}</p>
                    <p className="truncate text-xs text-ink-soft">{a.doctor?.name} · {a.department?.name}</p>
                  </div>
                  <AppointmentStatusBadge status={a.status} />
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
