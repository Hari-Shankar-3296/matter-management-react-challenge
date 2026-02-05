
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { useTheme } from '@/contexts/ThemeContext/ThemeContext';
import { useAuth } from '@/contexts/AuthContext/AuthContext';

// Mock hooks
vi.mock('@/contexts/ThemeContext/ThemeContext', () => ({
    useTheme: vi.fn(),
}));

vi.mock('@/contexts/AuthContext/AuthContext', () => ({
    useAuth: vi.fn(),
}));

// Mock SVG import
vi.mock('@/assets/images/CheckBoxLogo.svg', () => ({
    default: 'mock-logo-url',
}));

describe('Header Component', () => {
    const mockToggleTheme = vi.fn();
    const mockLogout = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useTheme as any).mockReturnValue({
            theme: 'light',
            toggleTheme: mockToggleTheme,
        });
        (useAuth as any).mockReturnValue({
            user: { firstName: 'Harishankar', lastName: 'Devaraj', email: 'harishankar@example.com' },
            logout: mockLogout,
            isAuthenticated: true,
        });
    });

    const renderHeader = () => {
        return render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );
    };

    it('renders the app logo and name', () => {
        const { asFragment } = renderHeader();
        expect(screen.getByAltText('Logo')).toBeDefined();
        expect(screen.getByText(/Matter Management/i)).toBeDefined();
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders navigation links when authenticated', () => {
        renderHeader();
        expect(screen.getByText('Dashboard')).toBeDefined();
        expect(screen.getByText('Matters')).toBeDefined();
        expect(screen.getByText('Kanban Board')).toBeDefined();
        expect(screen.getByText('My Matters')).toBeDefined();
    });

    it('calls toggleTheme when theme switch is clicked', () => {
        const { container } = renderHeader();
        const themeSwitch = container.querySelector('.theme-switch');
        if (themeSwitch) fireEvent.click(themeSwitch);
        expect(mockToggleTheme).toHaveBeenCalled();
    });

    it('shows user initials and opens dropdown', () => {
        renderHeader();
        const avatarBtn = screen.getByText('HD');
        expect(avatarBtn).toBeDefined();

        fireEvent.click(avatarBtn);
        expect(screen.getByText('Harishankar Devaraj')).toBeDefined();
        expect(screen.getByText('harishankar@example.com')).toBeDefined();
    });

    it('calls logout when logout button is clicked', () => {
        renderHeader();
        fireEvent.click(screen.getByText('HD'));
        fireEvent.click(screen.getByText('Logout'));
        expect(mockLogout).toHaveBeenCalled();
    });
});
