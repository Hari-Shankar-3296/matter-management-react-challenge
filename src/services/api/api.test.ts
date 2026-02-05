
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    fetchTickets,
    fetchTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
    fetchTicketStats,
    fetchMyTickets
} from './api';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn(key => store[key] || null),
        setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
        clear: vi.fn(() => { store = {}; }),
        removeItem: vi.fn(key => { delete store[key]; })
    };
})();
vi.stubGlobal('localStorage', localStorageMock);

describe('api service', () => {
    beforeEach(() => {
        localStorageMock.clear();
        localStorageMock.setItem('matter-management-user', JSON.stringify({ id: 'user-1' }));
    });

    describe('fetchTickets', () => {
        it('should fetch all tickets when no filters provided', async () => {
            const tickets = await fetchTickets();
            expect(tickets.length).toBeGreaterThan(0);
        });

        it('should filter by search term', async () => {
            const tickets = await fetchTickets({ search: 'login' });
            expect(tickets.every(t => t.title.toLowerCase().includes('login') || t.description?.toLowerCase().includes('login'))).toBe(true);
        });

        it('should filter by status', async () => {
            const tickets = await fetchTickets({ status: 'open' });
            expect(tickets.every(t => t.status === 'open')).toBe(true);
        });

        it('should filter by priority', async () => {
            const tickets = await fetchTickets({ priority: 'critical' });
            expect(tickets.every(t => t.priority === 'critical')).toBe(true);
        });

        it('should sort by priority', async () => {
            const tickets = await fetchTickets({ sortBy: 'priority' });
            const priorities = tickets.map(t => t.priority);
            // Critical should be first, then high, etc.
            // ticket-4 is critical, ticket-1 is high
            expect(priorities[0]).toBe('critical');
            expect(priorities[1]).toBe('high');
        });

        it('should sort by dueDate', async () => {
            const tickets = await fetchTickets({ sortBy: 'dueDate' });
            const dates = tickets.map(t => t.dueDate).filter(Boolean).map(d => new Date(d!).getTime());
            for (let i = 0; i < dates.length - 1; i++) {
                expect(dates[i]).toBeLessThanOrEqual(dates[i + 1]);
            }
        });
    });
    describe('fetchTicketById', () => {
        it('should fetch a ticket by ID', async () => {
            const ticket = await fetchTicketById('ticket-1');
            expect(ticket.id).toBe('ticket-1');
        });

        it('should throw error for invalid ID', async () => {
            await expect(fetchTicketById('invalid')).rejects.toThrow('Ticket not found');
        });
    });

    describe('createTicket', () => {
        it('should create a new ticket', async () => {
            const input = {
                title: 'New Test Ticket',
                description: 'Test description',
                status: 'open' as const,
                priority: 'medium' as const
            };
            const newTicket = await createTicket(input);
            expect(newTicket.title).toBe(input.title);
            expect(newTicket.id).toBeDefined();

            const fetched = await fetchTicketById(newTicket.id);
            expect(fetched).toEqual(newTicket);
        });
    });

    describe('updateTicket', () => {
        it('should update an existing ticket', async () => {
            const update = { id: 'ticket-1', title: 'Updated Title' };
            const updated = await updateTicket(update);
            expect(updated.title).toBe('Updated Title');

            const fetched = await fetchTicketById('ticket-1');
            expect(fetched.title).toBe('Updated Title');
        });

        it('should throw error for invalid ID', async () => {
            await expect(updateTicket({ id: 'invalid', title: 'Title' })).rejects.toThrow('Ticket not found');
        });
    });

    describe('deleteTicket', () => {
        it('should delete a ticket', async () => {
            await deleteTicket('ticket-5');
            await expect(fetchTicketById('ticket-5')).rejects.toThrow('Ticket not found');
        });

        it('should throw error for invalid ID', async () => {
            await expect(deleteTicket('invalid')).rejects.toThrow('Ticket not found');
        });
    });

    describe('fetchTicketStats', () => {
        it('should return correct statistics', async () => {
            const stats = await fetchTicketStats();
            expect(stats).toHaveProperty('total');
            expect(stats).toHaveProperty('open');
            expect(stats).toHaveProperty('byPriority');
        });
    });

    describe('fetchMyTickets', () => {
        it('should return tickets assigned to or reported by the current user', async () => {
            const myTickets = await fetchMyTickets();
            expect(myTickets).toHaveProperty('assigned');
            expect(myTickets).toHaveProperty('reported');
        });
    });
});
