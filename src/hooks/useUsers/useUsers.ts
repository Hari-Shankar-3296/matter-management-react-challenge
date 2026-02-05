import { useQuery } from '@tanstack/react-query';
import { userKeys } from '@/utils/queryKeys/queryKeys';
import { fetchUsers, fetchUserById } from '@/services/users/users';

export const useUsers = () => {
    return useQuery({
        queryKey: userKeys.list(),
        queryFn: fetchUsers,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useUser = (id: string) => {
    return useQuery({
        queryKey: userKeys.detail(id),
        queryFn: () => fetchUserById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};
