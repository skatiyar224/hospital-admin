/** Patients.jsx - search patient accounts, view profile + history, activate/deactivate. */
import { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { useAdminPatients, useSetPatientActive } from '@/hooks/usePatients';
import { useDebounced } from '@/hooks/useDebounced';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { ActiveBadge } from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { PatientDetailModal } from '@/components/patients/PatientDetailModal';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Card';
import { Pagination } from '@/components/ui/Pagination';
import { formatDateShort } from '@/lib/dates';
import { resolveImage } from '@/lib/axios';

export default function Patients() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounced(search);
  const [viewingId, setViewingId] = useState(null);
  const [pending, setPending] = useState(null);

  const { data, isLoading } = useAdminPatients({ page, limit: 10, q: debouncedSearch || undefined });
  const setActive = useSetPatientActive();

  const columns = [
    {
      header: 'Patient',
      cell: (p) => (
        <div className="flex items-center gap-3">
          <Avatar name={p.name} src={resolveImage(p.avatar)} />
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">{p.name}</p>
            <p className="truncate text-xs text-ink-soft">{p.email}</p>
          </div>
        </div>
      ),
    },
    { header: 'Phone', cell: (p) => p.phone || '—' },
    { header: 'Joined', cell: (p) => formatDateShort(p.createdAt) },
    { header: 'Status', cell: (p) => <ActiveBadge active={p.isActive} /> },
    {
      header: '',
      className: 'text-right',
      cell: (p) => (
        <div className="flex justify-end gap-2">
          <Button size="icon" variant="ghost" aria-label="View" onClick={() => setViewingId(p._id)}><Eye className="h-4 w-4" /></Button>
          <Button size="sm" variant="outline" onClick={() => setPending({ patient: p, value: !p.isActive })}>
            {p.isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Patients" description={`${data?.meta?.totalResults ?? '—'} accounts`} />

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name, email or phone…"
          className="h-10 w-full rounded-md border border-line bg-surface pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
        />
      </div>

      <DataTable columns={columns} rows={data?.data?.patients} isLoading={isLoading} empty="No patients found." />
      <Pagination page={data?.meta?.page || 1} totalPages={data?.meta?.totalPages || 1} onPageChange={setPage} />

      <PatientDetailModal patientId={viewingId} onClose={() => setViewingId(null)} />

      <ConfirmDialog
        open={Boolean(pending)}
        onClose={() => setPending(null)}
        title={pending?.value ? 'Activate account?' : 'Deactivate account?'}
        description={pending?.value ? `${pending?.patient?.name} will be able to sign in again.` : `${pending?.patient?.name} will be blocked from signing in.`}
        confirmLabel="Confirm"
        danger={!pending?.value}
        isLoading={setActive.isPending}
        onConfirm={() => setActive.mutate({ id: pending.patient._id, isActive: pending.value }, { onSettled: () => setPending(null) })}
      />
    </div>
  );
}
