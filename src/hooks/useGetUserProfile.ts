import { useQuery } from '@tanstack/react-query';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      } as User;
    },
  });
};
