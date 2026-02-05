
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TicketList from './TicketList';
import { Ticket } from '@/types';

vi.mock('@/components/TicketCard/TicketCard', () => ({
    default: ({ ticket }: { ticket: Ticket }) => <div data-testid="ticket-card">{ticket.title}</div>
}));

describe('TicketList', () => {
    const mockTickets: Ticket[] = [
        { id: '1', title: 'Ticket 1', status: 'open', priority: 'high', createdAt: '2023-10-25T10:00:00Z', reporterId: 'u1', description: 'desc' },
        { id: '2', title: 'Ticket 2', status: 'closed', priority: 'low', createdAt: '2023-10-25T10:00:00Z', reporterId: 'u1', description: 'desc' },
    ];

    it('renders empty state when no tickets', () => {
        const { asFragment } = render(
            <TicketList
                tickets={[]}
                selectedId={null}
                onSelect={vi.fn()}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );
        expect(screen.getByText(/No matters found/i)).toBeDefined();
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders list of tickets', () => {
        const { asFragment } = render(
            <TicketList
                tickets={mockTickets}
                selectedId="1"
                onSelect={vi.fn()}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        );
        expect(screen.getAllByTestId('ticket-card')).toHaveLength(2);
        expect(asFragment()).toMatchSnapshot();
    });
});
