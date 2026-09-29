/** Messages.jsx - contact-form inbox: filter by status, mark in-progress/resolved, delete. */
import { useState } from 'react';
import { Trash2, Mail } from 'lucide-react';
import { useAdminMessages, useUpdateMessageStatus, useDeleteMessage } from '@/hooks/useMessages';
import { PageHeader } from '@/components/common/PageHeader';
import { MessageStatusBadge } from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/Feedback';
import { Pagination } from '@/components/ui/Pagination';
import { formatDateShort } from '@/lib/dates';

const STATUSES = ['new', 'in_progress', 'resolved'];

export default function Messages() {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);
  const { data, isLoading } = useAdminMessages({ page, limit: 10, status: status || undefined });
  const updateStatus = useUpdateMessageStatus();
  const deleteMessage = useDeleteMessage();
  const messages = data?.data?.messages;

  return (
    <div>
      <PageHeader
        title="Messages"
        description={`${data?.meta?.totalResults ?? '—'} messages`}
        actions={
          <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter by status">
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s === 'new' ? 'New' : s === 'in_progress' ? 'In progress' : 'Resolved'}</option>)}
          </Select>
        }
      />

      {isLoading ? (
        <div className="space-y-3"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
      ) : !messages || messages.length === 0 ? (
        <EmptyState icon={Mail} title="No messages" description="Contact-form submissions will show up here." />
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m._id} className="rounded-lg border border-line bg-surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-ink">{m.subject}</p>
                  <p className="text-xs text-ink-soft">{m.name} · {m.email}{m.phone ? ` · ${m.phone}` : ''} · {formatDateShort(m.createdAt)}</p>
                </div>
                <MessageStatusBadge status={m.status} />
              </div>
              <p className="mt-3 text-sm text-ink-soft">{m.message}</p>
              <div className="mt-3 flex items-center gap-2">
                <Select value={m.status} onChange={(e) => updateStatus.mutate({ id: m._id, status: e.target.value })} className="h-8 text-[13px]" aria-label="Update status">
                  {STATUSES.map((s) => <option key={s} value={s}>{s === 'new' ? 'New' : s === 'in_progress' ? 'In progress' : 'Resolved'}</option>)}
                </Select>
                <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => setToDelete(m)}><Trash2 className="h-4 w-4 text-danger" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={data?.meta?.page || 1} totalPages={data?.meta?.totalPages || 1} onPageChange={setPage} />

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title="Delete this message?"
        description="This cannot be undone."
        confirmLabel="Delete"
        danger
        isLoading={deleteMessage.isPending}
        onConfirm={() => deleteMessage.mutate(toDelete._id, { onSuccess: () => setToDelete(null) })}
      />
    </div>
  );
}
