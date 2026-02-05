import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AssigneeSelector from './AssigneeSelector';
import { useUsers } from '@/hooks/useUsers/useUsers';
import { useUpdateTicket } from '@/hooks/useTickets/useTickets';

vi.mock('@/hooks/useUsers/useUsers', () => ({
  useUsers: vi.fn(),
}));

vi.mock('@/hooks/useTickets/useTickets', () => ({
  useUpdateTicket: vi.fn(),
}));

describe('AssigneeSelector', () => {
  const mockUsers = [
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
  ];
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useUsers as any).mockReturnValue({ data: mockUsers });
    (useUpdateTicket as any).mockReturnValue({ mutate: mockMutate });
  });

  it('renders "Unassigned" when no assignee', () => {
    const { asFragment } = render(<AssigneeSelector ticketId="t1" />);
    expect(screen.getByText('+ Assign')).toBeDefined();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders assignee name when currentAssigneeId is provided', () => {
    const { asFragment } = render(<AssigneeSelector ticketId="t1" currentAssigneeId="1" />);
    expect(screen.getByText('John Doe')).toBeDefined();
    expect(asFragment()).toMatchSnapshot();
  });

  it('calls mutate when a user is selected', () => {
    render(<AssigneeSelector ticketId="t1" />);
    fireEvent.click(screen.getByText('+ Assign'));

    // Since it's using createPortal, we check by display value or initials
    const janeOption = screen.getByText('Jane Smith');
    fireEvent.click(janeOption);

    expect(mockMutate).toHaveBeenCalledWith({ id: 't1', assigneeId: '2' }, expect.any(Object));
  });
});
