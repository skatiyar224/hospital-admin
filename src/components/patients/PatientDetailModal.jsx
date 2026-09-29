/** PatientDetailModal.jsx - profile summary + recent appointment history. */
import { Modal } from '@/components/ui/Modal';
import { Avatar, Skeleton } from '@/components/ui/Card';
import { AppointmentStatusBadge } from '@/components/common/StatusBadge';
import { usePatient } from '@/hooks/usePatients';
import { resolveImage } from '@/lib/axios';
import { formatDateShort } from '@/lib/dates';

export function PatientDetailModal({ patientId, onClose }) {
  const { data, isLoading } = usePatient(patientId);

  return (
    <Modal open={Boolean(patientId)} onClose={onClose} title="Patient profile" className="max-h-[85vh] max-w-lg overflow-y-auto">
      {isLoading || !data ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Avatar name={data.patient.name} src={resolveImage(data.patient.avatar)} className="h-12 w-12" />
            <div>
              <p className="font-medium text-ink">{data.patient.name}</p>
              <p className="text-sm text-ink-soft">{data.patient.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Field label="Phone" value={data.patient.phone || '—'} />
            <Field label="Gender" value={data.patient.gender || '—'} />
            <Field label="Date of birth" value={data.patient.dateOfBirth || '—'} />
            <Field label="Blood group" value={data.patient.bloodGroup || '—'} />
            <Field label="Total appointments" value={data.appointmentCount} />
            <Field label="Member since" value={formatDateShort(data.patient.createdAt)} />
          </div>

          {data.patient.address && <Field label="Address" value={data.patient.address} />}

          <div>
            <p className="mb-2 text-sm font-medium text-ink">Recent appointments</p>
            {data.appointments.length === 0 ? (
              <p className="text-sm text-ink-soft">No appointments yet.</p>
            ) : (
              <div className="divide-y divide-line rounded-lg border border-line">
                {data.appointments.map((a) => (
                  <div key={a._id} className="flex items-center justify-between px-3 py-2.5 text-sm">
                    <div>
                      <p className="text-ink">{a.doctor?.name}</p>
                      <p className="text-xs text-ink-soft">{formatDateShort(a.appointmentDate)} · {a.department?.name}</p>
                    </div>
                    <AppointmentStatusBadge status={a.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-ink-soft">{label}</p>
      <p className="font-medium capitalize text-ink">{value}</p>
    </div>
  );
}
