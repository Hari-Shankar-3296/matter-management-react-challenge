// Mock Users API

import { User } from '../types';

// In-memory mock users
export const mockUsers: User[] = [
    {
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        avatar: undefined,
    },
    {
        id: 'user-2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        avatar: undefined,
    },
    {
        id: 'user-3',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@example.com',
        avatar: undefined,
    },
    {
        id: 'user-4',
        firstName: 'Alice',
        lastName: 'Williams',
        email: 'alice.williams@example.com',
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
