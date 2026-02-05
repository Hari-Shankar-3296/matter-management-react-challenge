import { useQuery } from '@tanstack/react-query';
import { getTicketKeys } from '../utils/queryKeys';
import { TicketStatus } from '../types';

interface TicketListParams {
  status?: string;
}

interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
  read?: boolean;
}

/**
 * TASK 2: Fixed - Removed problematic useEffect patterns.
 * 
 * This hook uses React Query properly:
 * - Query key includes filters for automatic refetch on change
 * - No manual refetch needed when filters change
 */
export const useTicketList = (params: TicketListParams = {}) => {
  return useQuery({
    queryKey: getTicketKeys.list(params.status),
    queryFn: async () => {
      // Mock API call - in real app, this would be an API fetch
      await new Promise((resolve) => setTimeout(resolve, 300));
      const tickets: Ticket[] = [
        { id: '1', title: 'Fix login bug', status: 'open', read: false },
        { id: '2', title: 'Update dashboard', status: 'in-progress', read: true },
        { id: '3', title: 'Add dark mode', status: 'closed', read: true },
      ];

      if (params.status && params.status !== 'all') {
        return tickets.filter((t) => t.status === params.status);
      }

      return tickets;
    },
    staleTime: 30000,
  });
};
