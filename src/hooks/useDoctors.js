import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { doctorApi } from '@/api/doctorApi';
import { toast } from '@/components/ui/Toast';
import { getErrorMessage } from '@/lib/axios';

const KEY = ['admin', 'doctors'];

export function useAdminDoctors(params) {
  return useQuery({ queryKey: [...KEY, params], queryFn: () => doctorApi.list(params), placeholderData: (p) => p });
}

function useDoctorMutation(fn, successMessage) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      toast.success(successMessage);
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

export const useCreateDoctor = () => useDoctorMutation(doctorApi.create, 'Doctor created');
export const useUpdateDoctor = () => useDoctorMutation(({ id, formData }) => doctorApi.update(id, formData), 'Doctor updated');
export const useSetDoctorActive = () => useDoctorMutation(({ id, isActive }) => doctorApi.setActive(id, isActive), 'Doctor updated');
export const useDeactivateDoctor = () => useDoctorMutation(doctorApi.remove, 'Doctor deactivated');
