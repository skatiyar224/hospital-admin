/**
 * AppointmentDetailModal.jsx
 * ------------------------------------------------------------------
 * Read-only breakdown + status action buttons. Buttons shown depend on
 * current status, mirroring the backend's TRANSITIONS map exactly
 * (pending -> confirmed|cancelled; confirmed -> completed|cancelled|no_show).
 * Completed/no_show require adminNotes to stay optional but cancel asks
 * for a reason.
 * ------------------------------------------------------------------
 */
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Textarea, Label } from '@/components/ui/Input';
import { Separator } from '@/components/ui/Card';
import { AppointmentStatusBadge } from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useUpdateAppointmentStatus } from '@/hooks/useAppointments';
import { resolveImage } from '@/lib/axios';
import { formatCurrency } from '@/lib/utils';
import { formatDateLong, formatTime } from '@/lib/dates';

const TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled', 'no_show'],
  completed: [],
  cancelled: [],
  no_show: [],
};

const ACTION_LABEL = { confirmed: 'Confirm', completed: 'Mark completed', cancelled: 'Cancel', no_show: 'Mark no-show' };

export function AppointmentDetailModal({ appointment, onClose }) {
  const [pendingStatus, setPendingStatus] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const updateStatus = useUpdateAppointmentStatus();

  if (!appointment) return null;
  const allowed = TRANSITIONS[appointment.status] || [];
  const doctor = appointment.doctor || {};
  const photo = resolveImage(doctor.image);

  const confirm = () => {
    updateStatus.mutate(
      { id: appointment._id, status: pendingStatus, ...(pendingStatus === 'cancelled' ? { cancelReason } : {}) },
      { onSettled: () => { setPendingStatus(null); setCancelReason(''); onClose(); } }
    );
  };

  return (
    <>
      <Modal open={Boolean(appointment) && !pendingStatus} onClose={onClose} title={`Appointment ${appointment.code}`} className="max-h-[90vh] max-w-xl overflow-y-auto">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-ink-soft">{formatDateLong(appointment.appointmentDate)} at {formatTime(appointment.timeSlot)}</p>
            <AppointmentStatusBadge status={appointment.status} />
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-line p-3">
            {photo && <img src={photo} alt="" className="h-11 w-11 rounded-full border border-line object-cover" />}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{doctor.name}</p>
              <p className="truncate text-xs text-ink-soft">{appointment.department?.name}</p>
            </div>
          </div>

          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <Field label="Patient" value={appointment.patientName} />
            <Field label="Phone" value={appointment.patientPhone} />
            {appointment.patient?.email && <Field label="Account email" value={appointment.patient.email} />}
            {appointment.patientAge != null && <Field label="Age" value={appointment.patientAge} />}
            <Field label="Fee" value={`${formatCurrency(appointment.consultationFee)} (pay at hospital)`} />
          </div>

          {appointment.reason && (
            <div>
              <p className="mb-1 text-xs text-ink-soft">Reason for visit</p>
              <p className="text-sm text-ink">{appointment.reason}</p>
            </div>
          )}

          {appointment.cancelReason && <p className="text-sm text-danger">Cancelled: {appointment.cancelReason}</p>}

          {allowed.length > 0 && (
            <>
              <Separator />
              <div className="flex flex-wrap gap-2">
                {allowed.map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={status === 'cancelled' ? 'outline' : 'primary'}
                    onClick={() => setPendingStatus(status)}
                  >
                    {ACTION_LABEL[status]}
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingStatus) && pendingStatus !== 'cancelled'}
        onClose={() => setPendingStatus(null)}
        title={`${ACTION_LABEL[pendingStatus]} this appointment?`}
        description={`This will mark ${appointment.patientName}'s appointment as ${pendingStatus?.replace('_', ' ')}.`}
        confirmLabel={ACTION_LABEL[pendingStatus]}
        isLoading={updateStatus.isPending}
        onConfirm={confirm}
      />

      <Modal open={pendingStatus === 'cancelled'} onClose={() => setPendingStatus(null)} title="Cancel this appointment?">
        <Label htmlFor="cancelReason">Reason (shown to the patient)</Label>
        <Textarea id="cancelReason" rows={3} value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="e.g. Doctor unavailable — please rebook" />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setPendingStatus(null)}>Back</Button>
          <Button variant="danger" onClick={confirm} isLoading={updateStatus.isPending}>Cancel appointment</Button>
        </div>
      </Modal>
    </>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-ink-soft">{label}</p>
      <p className="font-medium text-ink">{value}</p>
    </div>
  );
}
