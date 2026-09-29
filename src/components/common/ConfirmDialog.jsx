import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

/** Confirmation modal for consequential actions. */
export function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = 'Confirm', isLoading, danger }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-ink-soft">{description}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} isLoading={isLoading}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
