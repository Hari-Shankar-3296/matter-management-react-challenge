
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUsers, useUser } from './useUsers';
import * as userService from '@/services/users/users';
import React from 'react';

// Mock the user service
vi.mock('@/services/users/users', () => ({
    fetchUsers: vi.fn(),
    fetchUserById: vi.fn(),
    loginUser: vi.fn(),
    mockUsers: [{ id: '1', firstName: 'John' }],
}));

const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={createTestQueryClient()}>
        {children}
    </QueryClientProvider>
);

describe('useUsers hooks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('useUsers', () => {
        it('should fetch all users', async () => {
            const mockUsers = [{ id: '1', firstName: 'John' }];
            (userService.fetchUsers as any).mockResolvedValue(mockUsers);

            const { result } = renderHook(() => useUsers(), { wrapper });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));
            expect(result.current.data).toEqual(mockUsers);
        });
    });

    describe('useUser', () => {
        it('should fetch a user by ID', async () => {
            const mockUser = { id: '1', firstName: 'John' };
            (userService.fetchUserById as any).mockResolvedValue(mockUser);

            const { result } = renderHook(() => useUser('1'), { wrapper });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));
            expect(result.current.data).toEqual(mockUser);
        });
    });
});
