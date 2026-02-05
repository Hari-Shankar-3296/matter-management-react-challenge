// Hooks for ticket operations using react-query

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketKeys } from '../utils/queryKeys';
import {
    fetchTickets,
    fetchTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
    fetchMyTickets,
    fetchTicketStats,
} from '../services/api';
import { CreateTicketInput, UpdateTicketInput, TicketFilters } from '../types';

export const useTickets = (filters?: TicketFilters) => {
    return useQuery({
        queryKey: ticketKeys.list(filters),
        queryFn: () => fetchTickets(filters),
        staleTime: 30000, // 30 seconds
    });
};

export const useTicket = (id: string) => {
    return useQuery({
        queryKey: ticketKeys.detail(id),
        queryFn: () => fetchTicketById(id),
        enabled: !!id,
    });
};

export const useMyTickets = () => {
    return useQuery({
        queryKey: ['tickets', 'my'],
        queryFn: fetchMyTickets,
        staleTime: 30000,
    });
};

export const useTicketStats = () => {
    return useQuery({
        queryKey: ['tickets', 'stats'],
        queryFn: fetchTicketStats,
        staleTime: 60000, // 1 minute
    });
};

export const useCreateTicket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateTicketInput) => createTicket(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ['tickets', 'my'] });
            queryClient.invalidateQueries({ queryKey: ['tickets', 'stats'] });
        },
    });
};

export const useUpdateTicket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: UpdateTicketInput) => updateTicket(input),
        onSuccess: (updatedTicket) => {
            queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
            queryClient.setQueryData(ticketKeys.detail(updatedTicket.id), updatedTicket);
            queryClient.invalidateQueries({ queryKey: ['tickets', 'my'] });
            queryClient.invalidateQueries({ queryKey: ['tickets', 'stats'] });
        },
    });
};

export const useDeleteTicket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteTicket(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ['tickets', 'my'] });
            queryClient.invalidateQueries({ queryKey: ['tickets', 'stats'] });
        },
    });
};
