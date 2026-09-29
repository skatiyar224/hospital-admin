import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appointmentApi } from '@/api/appointmentApi';
import { toast } from '@/components/ui/Toast';
import { getErrorMessage } from '@/lib/axios';

export function useAdminAppointments(params) {
  return useQuery({ queryKey: ['admin', 'appointments', params], queryFn: () => appointmentApi.list(params), placeholderData: (p) => p });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => appointmentApi.updateStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'appointments'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      toast.success('Appointment updated');
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}
