import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { messageApi } from '@/api/messageApi';
import { toast } from '@/components/ui/Toast';
import { getErrorMessage } from '@/lib/axios';

const KEY = ['admin', 'messages'];

export function useAdminMessages(params) {
  return useQuery({ queryKey: [...KEY, params], queryFn: () => messageApi.list(params), placeholderData: (p) => p });
}

export function useUpdateMessageStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => messageApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messageApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
      toast.success('Message deleted');
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}
