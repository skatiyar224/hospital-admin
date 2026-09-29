/** Appointments.jsx - filter by status/date/doctor/search, open detail modal for actions. */
import { useState } from 'react';
import { Eye, Search } from 'lucide-react';
import { useAdminAppointments } from '@/hooks/useAppointments';
import { useAdminDoctors } from '@/hooks/useDoctors';
import { useDebounced } from '@/hooks/useDebounced';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { AppointmentStatusBadge } from '@/components/common/StatusBadge';
import { AppointmentDetailModal } from '@/components/appointments/AppointmentDetailModal';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { formatDateShort, formatTime } from '@/lib/dates';

const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'];

export default function Appointments() {
  const [status, setStatus] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounced(search);
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);

  const { data: doctorsData } = useAdminDoctors({ limit: 100 });
  const { data, isLoading } = useAdminAppointments({
    page, limit: 10,
    status: status || undefined, doctor: doctor || undefined, date: date || undefined, q: debouncedSearch || undefined,
  });

  const columns = [
    { header: 'Code', cell: (a) => <span className="font-medium">{a.code}</span> },
    {
      header: 'Patient',
      cell: (a) => (
        <div>
          <p className="text-ink">{a.patientName}</p>
          <p className="text-xs text-ink-soft">{a.patientPhone}</p>
        </div>
      ),
    },
    { header: 'Doctor', cell: (a) => a.doctor?.name || '—' },
    { header: 'Date', cell: (a) => formatDateShort(a.appointmentDate) },
    { header: 'Time', cell: (a) => formatTime(a.timeSlot) },
    { header: 'Status', cell: (a) => <AppointmentStatusBadge status={a.status} /> },
    {
      header: '',
      className: 'text-right',
      cell: (a) => <Button size="icon" variant="ghost" aria-label="View" onClick={() => setViewing(a)}><Eye className="h-4 w-4" /></Button>,
    },
  ];

  return (
    <div>
      <PageHeader title="Appointments" description={`${data?.meta?.totalResults ?? '—'} appointments`} />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Code, patient name or phone…"
            className="h-10 w-full rounded-md border border-line bg-surface pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
          />
        </div>
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter by status">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1).replace('_', ' ')}</option>)}
        </Select>
        <Select value={doctor} onChange={(e) => { setDoctor(e.target.value); setPage(1); }} aria-label="Filter by doctor">
          <option value="">All doctors</option>
          {doctorsData?.data?.doctors?.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
        </Select>
        <input
          type="date"
          value={date}
          onChange={(e) => { setDate(e.target.value); setPage(1); }}
          className="h-10 rounded-md border border-line bg-surface px-3 text-sm"
          aria-label="Filter by date"
        />
      </div>

      <DataTable columns={columns} rows={data?.data?.appointments} isLoading={isLoading} empty="No appointments match this filter." />
      <Pagination page={data?.meta?.page || 1} totalPages={data?.meta?.totalPages || 1} onPageChange={setPage} />

      <AppointmentDetailModal appointment={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}
