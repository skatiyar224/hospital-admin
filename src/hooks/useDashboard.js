import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboardApi';

export function useDashboardStats() {
  return useQuery({ queryKey: ['admin', 'dashboard'], queryFn: dashboardApi.getStats, staleTime: 30 * 1000 });
}
