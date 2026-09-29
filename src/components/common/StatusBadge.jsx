import { Badge } from '@/components/ui/Card';

const APPOINTMENT = {
  pending: ['warm', 'Pending'],
  confirmed: ['brand', 'Confirmed'],
  completed: ['default', 'Completed'],
  cancelled: ['danger', 'Cancelled'],
  no_show: ['danger', 'No-show'],
};

const MESSAGE = {
  new: ['warm', 'New'],
  in_progress: ['brand', 'In progress'],
  resolved: ['default', 'Resolved'],
};

export function AppointmentStatusBadge({ status }) {
  const [variant, label] = APPOINTMENT[status] || ['default', status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function MessageStatusBadge({ status }) {
  const [variant, label] = MESSAGE[status] || ['default', status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function ActiveBadge({ active, activeLabel = 'Active', inactiveLabel = 'Inactive' }) {
  return active ? <Badge variant="brand">{activeLabel}</Badge> : <Badge variant="outline">{inactiveLabel}</Badge>;
}
