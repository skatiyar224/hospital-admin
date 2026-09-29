/** Doctors.jsx - list all doctors, search, filter by department, create/edit, deactivate. */
import { useState } from 'react';
import { Plus, Pencil, EyeOff, Eye, Search } from 'lucide-react';
import { useAdminDoctors, useSetDoctorActive, useDeactivateDoctor } from '@/hooks/useDoctors';
import { useAdminDepartments } from '@/hooks/useDepartments';
import { useDebounced } from '@/hooks/useDebounced';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { ActiveBadge } from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { DoctorFormSheet } from '@/components/doctors/DoctorFormSheet';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';
import { resolveImage } from '@/lib/axios';
import { formatCurrency } from '@/lib/utils';

export default function Doctors() {
  const [page, setPage] = useState(1);
  const [department, setDepartment] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounced(search);
  const [sheet, setSheet] = useState({ open: false, doctor: null });
  const [toDeactivate, setToDeactivate] = useState(null);

  const { data: departments } = useAdminDepartments();
  const { data, isLoading } = useAdminDoctors({ page, limit: 10, department: department || undefined, q: debouncedSearch || undefined });
  const setActive = useSetDoctorActive();
  const deactivate = useDeactivateDoctor();

  const columns = [
    {
      header: 'Doctor',
      cell: (d) => {
        const photo = resolveImage(d.image);
        return (
          <div className="flex items-center gap-3">
            {photo ? <img src={photo} alt="" className="h-10 w-10 rounded-full border border-line object-cover" /> : <div className="h-10 w-10 rounded-full bg-brand-soft" />}
            <div className="min-w-0">
              <p className="max-w-[220px] truncate font-medium text-ink">{d.name}</p>
              <p className="text-xs text-ink-soft">{d.specialization || d.designation}</p>
            </div>
          </div>
        );
      },
    },
    { header: 'Department', cell: (d) => d.department?.name || '—' },
    { header: 'Fee', cell: (d) => formatCurrency(d.consultationFee) },
    { header: 'Experience', cell: (d) => `${d.experienceYears} yrs` },
    { header: 'Status', cell: (d) => <ActiveBadge active={d.isActive} /> },
    {
      header: '',
      className: 'text-right',
      cell: (d) => (
        <div className="flex justify-end gap-1">
          <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setSheet({ open: true, doctor: d })}><Pencil className="h-4 w-4" /></Button>
          {d.isActive ? (
            <Button size="icon" variant="ghost" aria-label="Deactivate" onClick={() => setToDeactivate(d)}><EyeOff className="h-4 w-4" /></Button>
          ) : (
            <Button size="icon" variant="ghost" aria-label="Activate" onClick={() => setActive.mutate({ id: d._id, isActive: true })}><Eye className="h-4 w-4" /></Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Doctors"
        description={`${data?.meta?.totalResults ?? '—'} doctors`}
        actions={<Button variant="primary" onClick={() => setSheet({ open: true, doctor: null })}><Plus className="h-4 w-4" /> New doctor</Button>}
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or specialization…"
            className="h-10 w-full rounded-md border border-line bg-surface pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
          />
        </div>
        <Select value={department} onChange={(e) => { setDepartment(e.target.value); setPage(1); }} aria-label="Filter by department">
          <option value="">All departments</option>
          {departments?.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
        </Select>
      </div>

      <DataTable columns={columns} rows={data?.data?.doctors} isLoading={isLoading} empty="No doctors found." />
      <Pagination page={data?.meta?.page || 1} totalPages={data?.meta?.totalPages || 1} onPageChange={setPage} />

      <DoctorFormSheet open={sheet.open} doctor={sheet.doctor} onClose={() => setSheet({ open: false, doctor: null })} />

      <ConfirmDialog
        open={Boolean(toDeactivate)}
        onClose={() => setToDeactivate(null)}
        title="Deactivate this doctor?"
        description={`"${toDeactivate?.name}" will disappear from the website and can no longer be booked. Blocked if they have upcoming appointments.`}
        confirmLabel="Deactivate"
        danger
        isLoading={deactivate.isPending}
        onConfirm={() => deactivate.mutate(toDeactivate._id, { onSuccess: () => setToDeactivate(null), onError: () => setToDeactivate(null) })}
      />
    </div>
  );
}
