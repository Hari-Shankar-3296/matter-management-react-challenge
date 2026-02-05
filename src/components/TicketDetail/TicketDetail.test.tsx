import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TicketDetail from './TicketDetail';
import { Ticket } from '@/types';

// Mock components and utils
vi.mock('@/components/AssigneeSelector/AssigneeSelector', () => ({
  default: () => <div data-testid="assignee-selector">AssigneeSelector</div>,
}));

vi.mock('@/components/Badge/Badge', () => ({
  default: ({ value }: { value: string }) => <div data-testid="badge">{value}</div>,
}));

vi.mock('@/utils/dateUtils/dateUtils', () => ({
  formatDate: vi.fn(() => 'Oct 25, 2023'),
  isDueThisWeek: vi.fn(),
  isOverdue: vi.fn(),
}));

describe('TicketDetail Component', () => {
  const mockTicket: Ticket = {
    id: '1',
    title: 'Test Ticket',
    status: 'open',
    priority: 'high',
    createdAt: '2023-10-25T10:00:00Z',
    description: 'Detailed Description',
    reporterId: 'user-1',
    assigneeId: 'user-2',
  };

  const mockGetUserName = vi.fn((id) => (id === 'user-1' ? 'John Doe' : 'Jane Smith'));

  it('renders "Select a item" when ticket is null', () => {
    render(<TicketDetail ticket={null} getUserName={mockGetUserName} />);
    expect(screen.getByText(/Select a/i)).toBeDefined();
  });

  it('renders ticket details correctly', () => {
    const { asFragment } = render(
      <TicketDetail ticket={mockTicket} getUserName={mockGetUserName} />
    );
    expect(screen.getByText('Test Ticket')).toBeDefined();
    expect(screen.getByText('Detailed Description')).toBeDefined();
    expect(screen.getByText('#1')).toBeDefined();
    expect(screen.getByText('John Doe')).toBeDefined(); // Reporter
    expect(asFragment()).toMatchSnapshot();
  });
});
