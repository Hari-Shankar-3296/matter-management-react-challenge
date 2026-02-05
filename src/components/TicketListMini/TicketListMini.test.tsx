import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import TicketListMini from './TicketListMini';
import { Ticket } from '@/types';

describe('TicketListMini', () => {
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
  ];

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<HashRouter>{ui}</HashRouter>);
  };

  it('renders title and tickets', () => {
    const { asFragment } = renderWithRouter(
      <TicketListMini title="Recent Matters" tickets={mockTickets} />
    );
    expect(screen.getByText('Recent Matters')).toBeDefined();
    expect(screen.getByText('Ticket 1')).toBeDefined();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders empty state', () => {
    const { asFragment } = renderWithRouter(<TicketListMini title="Recent Matters" tickets={[]} />);
    expect(screen.getByText(/No matters found/i)).toBeDefined();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders view all link if provided', () => {
    renderWithRouter(<TicketListMini title="Recent" tickets={[]} viewAllLink="/matters" />);
    expect(screen.getByText(/View All/i)).toBeDefined();
  });
});
