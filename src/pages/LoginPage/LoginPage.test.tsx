import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import { useAuth } from '@/contexts/AuthContext/AuthContext';

// Mock hooks
vi.mock('@/contexts/AuthContext/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LoginPage', () => {
  const mockLogin = vi.fn();
  const mockUsers = [{ id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' }];

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      login: mockLogin,
      users: mockUsers,
      isLoading: false,
    });
  });

  const renderLoginPage = () => {
    return render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  };

  it('renders login form correctly', () => {
    const { asFragment } = renderLoginPage();
    expect(screen.getByText('Matter Management')).toBeDefined();
    expect(screen.getByLabelText('Select User')).toBeDefined();
    expect(screen.getByText(/John Doe/i)).toBeDefined();
    expect(asFragment()).toMatchSnapshot();
  });

  it('shows error when submitting without selecting a user', async () => {
    renderLoginPage();
    fireEvent.click(screen.getByText('Sign In'));
    expect(screen.getByText('Please select a user to continue.')).toBeDefined();
  });

  it('calls login and navigates on successful submission', async () => {
    mockLogin.mockResolvedValue(true);
    renderLoginPage();

    fireEvent.change(screen.getByLabelText('Select User'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('john@example.com');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows error on failed login', async () => {
    mockLogin.mockResolvedValue(false);
    renderLoginPage();

    fireEvent.change(screen.getByLabelText('Select User'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(screen.getByText('Login failed. Please try again.')).toBeDefined();
    });
  });
});
