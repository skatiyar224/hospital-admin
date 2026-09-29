import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { departmentApi } from '@/api/departmentApi';
import { toast } from '@/components/ui/Toast';
import { getErrorMessage } from '@/lib/axios';

const KEY = ['admin', 'departments'];

export function useAdminDepartments() {
  return useQuery({ queryKey: KEY, queryFn: departmentApi.list });
}

function useDepartmentMutation(fn, successMessage) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
      toast.success(successMessage);
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

export const useCreateDepartment = () => useDepartmentMutation(departmentApi.create, 'Department created');
export const useUpdateDepartment = () => useDepartmentMutation(({ id, formData }) => departmentApi.update(id, formData), 'Department updated');
export const useSetDepartmentActive = () => useDepartmentMutation(({ id, isActive }) => departmentApi.setActive(id, isActive), 'Department updated');
export const useDeleteDepartment = () => useDepartmentMutation(departmentApi.remove, 'Department deleted');
