import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { patientApi } from '@/api/patientApi';
import { toast } from '@/components/ui/Toast';
import { getErrorMessage } from '@/lib/axios';

export function useAdminPatients(params) {
  return useQuery({ queryKey: ['admin', 'patients', params], queryFn: () => patientApi.list(params), placeholderData: (p) => p });
}

export function usePatient(id) {
  return useQuery({ queryKey: ['admin', 'patient', id], queryFn: () => patientApi.getOne(id), enabled: Boolean(id) });
}

export function useSetPatientActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }) => patientApi.setActive(id, isActive),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'patients'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'patient', id] });
      toast.success('Patient updated');
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}
