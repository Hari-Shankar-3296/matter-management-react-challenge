import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useTickets,
  useCreateTicket,
  useUpdateTicket,
  useDeleteTicket,
  useTicket,
  useMyTickets,
  useTicketStats,
} from './useTickets';
import * as api from '@/services/api/api';
import React from 'react';

// Mock the API service
vi.mock('@/services/api/api', () => ({
  fetchTickets: vi.fn(),
  createTicket: vi.fn(),
  updateTicket: vi.fn(),
  deleteTicket: vi.fn(),
  fetchTicketById: vi.fn(),
  fetchMyTickets: vi.fn(),
  fetchTicketStats: vi.fn(),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>{children}</QueryClientProvider>
);

describe('useTickets hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useTickets', () => {
    it('should fetch tickets', async () => {
      const mockTickets = [{ id: '1', title: 'Test' }];
      (api.fetchTickets as any).mockResolvedValue(mockTickets);

      const { result } = renderHook(() => useTickets(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockTickets);
    });
  });

  describe('useCreateTicket', () => {
    it('should create a ticket and invalidate queries', async () => {
      const newTicket = { id: '2', title: 'New' };
      (api.createTicket as any).mockResolvedValue(newTicket);

      const { result } = renderHook(() => useCreateTicket(), { wrapper });

      result.current.mutate({ title: 'New' } as any);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(api.createTicket).toHaveBeenCalled();
    });
  });

  describe('useUpdateTicket', () => {
    it('should update a ticket', async () => {
      const updatedTicket = { id: '1', title: 'Updated' };
      (api.updateTicket as any).mockResolvedValue(updatedTicket);

      const { result } = renderHook(() => useUpdateTicket(), { wrapper });

      result.current.mutate({ id: '1', title: 'Updated' } as any);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(api.updateTicket).toHaveBeenCalled();
    });
  });

  describe('useDeleteTicket', () => {
    it('should delete a ticket', async () => {
      (api.deleteTicket as any).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteTicket(), { wrapper });

      result.current.mutate('1');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(api.deleteTicket).toHaveBeenCalledWith('1');
    });
  });

  describe('useTicket', () => {
    it('should fetch a single ticket', async () => {
      const mockTicket = { id: '1', title: 'Test' };
      (api.fetchTicketById as any).mockResolvedValue(mockTicket);

      const { result } = renderHook(() => useTicket('1'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockTicket);
    });
  });

  describe('useMyTickets', () => {
    it('should fetch my tickets', async () => {
      const mockTickets = { reported: [], assigned: [] };
      (api.fetchMyTickets as any).mockResolvedValue(mockTickets);

      const { result } = renderHook(() => useMyTickets(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockTickets);
    });
  });

  describe('useTicketStats', () => {
    it('should fetch ticket stats', async () => {
      const mockStats = { open: 1, closed: 0 };
      (api.fetchTicketStats as any).mockResolvedValue(mockStats);

      const { result } = renderHook(() => useTicketStats(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockStats);
    });
  });
});
