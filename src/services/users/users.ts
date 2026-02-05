// Mock Users API

import { User } from '@/types';

// In-memory mock users
export const mockUsers: User[] = [
    {
        id: 'user-1',
        firstName: 'Harishankar',
        lastName: 'Devaraj',
        email: 'harishankar3293@gmail.com',
        avatar: undefined,
    },
    {
        id: 'user-2',
        firstName: 'Max',
        lastName: 'Nash',
        email: 'max.nash@checkbox.com',
        avatar: undefined,
    },
    {
        id: 'user-3',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@checkbox.com',
        avatar: undefined,
    },
    {
        id: 'user-4',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@checkbox.com',
        avatar: undefined,
    },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchUsers = async (): Promise<User[]> => {
    await delay(200);
    return mockUsers;
};

export const fetchUserById = async (id: string): Promise<User | null> => {
    await delay(100);
    return mockUsers.find(u => u.id === id) || null;
};

export const loginUser = async (email: string): Promise<User | null> => {
    await delay(300);
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
};
