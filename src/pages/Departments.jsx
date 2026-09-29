/** Departments.jsx - list, create/edit modal, toggle active, delete. */
import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useAdminDepartments, useSetDepartmentActive, useDeleteDepartment } from '@/hooks/useDepartments';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { ActiveBadge } from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { DepartmentFormModal } from '@/components/departments/DepartmentFormModal';
import { Button } from '@/components/ui/Button';
import { resolveImage } from '@/lib/axios';

export default function Departments() {
  const { data: departments, isLoading } = useAdminDepartments();
  const [modal, setModal] = useState({ open: false, department: null });
  const [toDelete, setToDelete] = useState(null);
  const setActive = useSetDepartmentActive();
  const deleteDepartment = useDeleteDepartment();

  const columns = [
    {
      header: 'Department',
      cell: (d) => {
        const photo = resolveImage(d.image);
        return (
          <div className="flex items-center gap-3">
            {photo ? <img src={photo} alt="" className="h-10 w-10 rounded-md border border-line object-cover" /> : <div className="h-10 w-10 rounded-md bg-brand-soft" />}
            <div>
              <p className="font-medium text-ink">{d.name}</p>
              <p className="text-xs text-ink-soft">/{d.slug}</p>
            </div>
          </div>
        );
      },
    },
    { header: 'Services', cell: (d) => d.services?.length || 0 },
    {
      header: 'Status',
      cell: (d) => (
        <button onClick={() => setActive.mutate({ id: d._id, isActive: !d.isActive })} title="Click to toggle">
          <ActiveBadge active={d.isActive} />
        </button>
      ),
    },
    {
      header: '',
      className: 'text-right',
      cell: (d) => (
        <div className="flex justify-end gap-1">
          <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setModal({ open: true, department: d })}><Pencil className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => setToDelete(d)}><Trash2 className="h-4 w-4" /></Button>
        </div>
      ),
    },
  ];

  const close = () => setModal({ open: false, department: null });

  return (
    <div>
      <PageHeader
        title="Departments"
        description={`${departments?.length ?? '—'} departments`}
        actions={<Button variant="primary" onClick={() => setModal({ open: true, department: null })}><Plus className="h-4 w-4" /> New department</Button>}
      />

      <DataTable columns={columns} rows={departments} isLoading={isLoading} empty="No departments yet." />

      <DepartmentFormModal open={modal.open} department={modal.department} onClose={close} />

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title="Delete department?"
        description={`"${toDelete?.name}" will be permanently deleted. This is blocked if active doctors still belong to it.`}
        confirmLabel="Delete"
        danger
        isLoading={deleteDepartment.isPending}
        onConfirm={() => deleteDepartment.mutate(toDelete._id, { onSuccess: () => setToDelete(null), onError: () => setToDelete(null) })}
      />
    </div>
  );
}
