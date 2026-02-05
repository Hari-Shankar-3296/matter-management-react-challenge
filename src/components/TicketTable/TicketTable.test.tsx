import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TicketTable from './TicketTable';
import { Ticket } from '@/types';

vi.mock('@/components/TicketTableRow/TicketTableRow', () => ({
  default: ({ ticket }: { ticket: Ticket }) => (
    <tr data-testid="ticket-row">
      <td>{ticket.title}</td>
    </tr>
  ),
}));

describe('TicketTable', () => {
  const mockTickets: Ticket[] = [
    {
      id: '1',
      title: 'Ticket 1',
      status: 'open',
      priority: 'high',
      createdAt: '2023-10-25T10:00:00Z',
      reporterId: 'u1',
      description: 'desc',
    },
    {
      id: '2',
      title: 'Ticket 2',
      status: 'closed',
      priority: 'low',
      createdAt: '2023-10-25T10:00:00Z',
      reporterId: 'u1',
      description: 'desc',
    },
  ];

  it('renders empty state when no tickets', () => {
    const { asFragment } = render(
      <TicketTable tickets={[]} activeTab="assigned" onEdit={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByText(/No matters found/i)).toBeDefined();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders table with rows when tickets are provided', () => {
    const { asFragment } = render(
      <TicketTable tickets={mockTickets} activeTab="assigned" onEdit={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getAllByTestId('ticket-row')).toHaveLength(2);
    expect(screen.getByText('Ticket 1')).toBeDefined();
    expect(asFragment()).toMatchSnapshot();
  });
});
