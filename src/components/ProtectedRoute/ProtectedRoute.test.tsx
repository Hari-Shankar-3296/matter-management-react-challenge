
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext/AuthContext';

vi.mock('@/contexts/AuthContext/AuthContext', () => ({
    useAuth: vi.fn(),
}));

// Mock Navigate to avoid full routing logic
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        Navigate: ({ to }: { to: string }) => <div data-testid="navigate">Navigating to {to}</div>
    };
});

describe('ProtectedRoute', () => {
    it('renders children when authenticated', () => {
        (useAuth as any).mockReturnValue({ isAuthenticated: true, isLoading: false });
        render(
            <BrowserRouter>
                <ProtectedRoute>
                    <div data-testid="child">Protected Content</div>
                </ProtectedRoute>
            </BrowserRouter>
        );
        expect(screen.getByTestId('child')).toBeDefined();
    });

    it('navigates to login when not authenticated', () => {
        (useAuth as any).mockReturnValue({ isAuthenticated: false, isLoading: false });
        render(
            <BrowserRouter>
                <ProtectedRoute>
                    <div>Protected Content</div>
                </ProtectedRoute>
            </BrowserRouter>
        );
        expect(screen.getByTestId('navigate')).toBeDefined();
        expect(screen.getByText(/Navigating to \/login/i)).toBeDefined();
    });

    it('renders loading state when isLoading is true', () => {
        (useAuth as any).mockReturnValue({ isAuthenticated: false, isLoading: true });
        render(
            <BrowserRouter>
                <ProtectedRoute>
                    <div>Protected Content</div>
                </ProtectedRoute>
            </BrowserRouter>
        );
        expect(screen.getByText(/Loading/i)).toBeDefined();
    });
});
