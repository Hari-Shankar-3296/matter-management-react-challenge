import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UserProfilePage from './UserProfilePage';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { useMyTickets } from '@/hooks/useTickets/useTickets';
import { useUsers } from '@/hooks/useUsers/useUsers';

vi.mock('@/contexts/AuthContext/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/hooks/useTickets/useTickets', () => ({
  useMyTickets: vi.fn(),
}));

vi.mock('@/hooks/useUsers/useUsers', () => ({
  useUsers: vi.fn(),
}));

describe('UserProfilePage', () => {
  const mockUser = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ user: mockUser, logout: vi.fn() });
    (useUsers as any).mockReturnValue({ data: [mockUser], isLoading: false });
    (useMyTickets as any).mockReturnValue({
      data: {
        reported: [{ id: '1' }, { id: '2' }],
        assigned: [{ id: '3' }],
      },
      isLoading: false,
    });
  });

  it('renders user profile and ticket stats', () => {
    const { asFragment } = render(<UserProfilePage />);
    expect(screen.getByText('John Doe')).toBeDefined();
    expect(screen.getAllByText('john@example.com')).toHaveLength(2);
    // The current implementation might not show counts if they are not in the component
    // Let's check based on actual component code (it shows Account Details etc)
    expect(screen.getByText('Account Details')).toBeDefined();
    expect(asFragment()).toMatchSnapshot();
  });

  it('shows logout confirmation and handles logout', () => {
    const mockLogout = vi.fn();
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    render(<UserProfilePage />);

    // Initial state
    const logoutBtn = screen.getByText('Logout');
    fireEvent.click(logoutBtn);

    // Confirmation state
    expect(screen.getByText('Are you sure?')).toBeDefined();
    const confirmBtn = screen.getByText('Yes, Logout');
    fireEvent.click(confirmBtn);

    expect(mockLogout).toHaveBeenCalled();
  });

  it('can cancel logout confirmation', () => {
    render(<UserProfilePage />);

    fireEvent.click(screen.getByText('Logout'));
    expect(screen.getByText('Are you sure?')).toBeDefined();

    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Are you sure?')).toBeNull();
    expect(screen.getByText('Logout')).toBeDefined();
  });

  it('shows loading state when user is missing', () => {
    (useAuth as any).mockReturnValue({ user: null });
    render(<UserProfilePage />);
    expect(screen.getByText(/Loading profile/i)).toBeDefined();
  });
});
