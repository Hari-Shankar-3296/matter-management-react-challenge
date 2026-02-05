
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import * as userService from '@/services/users/users';

vi.mock('@/services/users/users', () => ({
    loginUser: vi.fn(),
    mockUsers: [{ id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' }],
}));

const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
    };
})();

vi.stubGlobal('localStorage', localStorageMock);

const TestComponent = () => {
    const { user, isAuthenticated, login, logout } = useAuth();
    return (
        <div>
            <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
            <div data-testid="user-name">{user?.firstName}</div>
            <button onClick={() => login('john@example.com')}>Login</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('provides initial unauthenticated state', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        expect(screen.getByTestId('auth-status').textContent).toBe('Not Authenticated');
    });

    it('logs in a user successfully', async () => {
        const mockUser = { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
        (userService.loginUser as any).mockResolvedValue(mockUser);

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await act(async () => {
            screen.getByText('Login').click();
        });

        expect(screen.getByTestId('auth-status').textContent).toBe('Authenticated');
        expect(screen.getByTestId('user-name').textContent).toBe('John');
        expect(localStorage.setItem).toHaveBeenCalledWith('matter-management-user', JSON.stringify(mockUser));
    });

    it('logs out a user', async () => {
        const mockUser = { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
        (localStorage.getItem as any).mockReturnValue(JSON.stringify(mockUser));

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId('auth-status').textContent).toBe('Authenticated');

        act(() => {
            screen.getByText('Logout').click();
        });

        expect(screen.getByTestId('auth-status').textContent).toBe('Not Authenticated');
        expect(localStorage.removeItem).toHaveBeenCalledWith('matter-management-user');
    });

    it('throws error if useAuth is used outside provider', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        expect(() => render(<TestComponent />)).toThrow('useAuth must be used within an AuthProvider');
        consoleSpy.mockRestore();
    });
});
