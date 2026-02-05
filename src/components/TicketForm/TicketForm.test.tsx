import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TicketForm from './TicketForm';
import { useUsers } from '@/hooks/useUsers/useUsers';
import { useAuth } from '@/contexts/AuthContext/AuthContext';

// Mock hooks
vi.mock('@/hooks/useUsers/useUsers', () => ({
  useUsers: vi.fn(),
}));

vi.mock('@/contexts/AuthContext/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('TicketForm Component', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();
  const mockUsers = [
    { id: 'user-1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useUsers as any).mockReturnValue({ data: mockUsers });
    (useAuth as any).mockReturnValue({ user: mockUsers[0] });
  });

  it('renders form fields correctly for creation', () => {
    const { asFragment } = render(<TicketForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    expect(screen.getByLabelText(/Title/i)).toBeDefined();
    expect(screen.getByLabelText(/Description/i)).toBeDefined();
    expect(screen.getByText('Create Matter')).toBeDefined();
    expect(asFragment()).toMatchSnapshot();
  });

  it('shows validation error for empty title', async () => {
    render(<TicketForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    fireEvent.click(screen.getByText('Create Matter'));
    expect(screen.getByText('Title is required')).toBeDefined();
  });

  it('calls onSubmit with form data when valid', async () => {
    render(<TicketForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'New Ticket' } });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'Test description' },
    });

    fireEvent.click(screen.getByText('Create Matter'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Ticket',
          description: 'Test description',
        })
      );
    });
  });

  it('renders in edit mode with ticket data', () => {
    const mockTicket = {
      id: '1',
      title: 'Edit Me',
      description: 'Original content',
      status: 'in-progress' as const,
      priority: 'medium' as const,
      reporterId: 'user-1',
      createdAt: '2023-10-25T10:00:00Z',
    };

    render(<TicketForm ticket={mockTicket} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    expect(screen.getByDisplayValue('Edit Me')).toBeDefined();
    expect(screen.getByText('Update Matter')).toBeDefined();
  });
});
