
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';
import { useAuth } from '@/contexts/AuthContext/AuthContext';

vi.mock('@/contexts/AuthContext/AuthContext', () => ({
    useAuth: vi.fn(),
}));

// Mock HeroSection and FeatureCard to avoid deep prop requirements if any
vi.mock('@/components/HeroSection/HeroSection', () => ({
    default: ({ user, isAuthenticated }: any) => (
        <div data-testid="hero">
            Hero: {isAuthenticated ? `Welcome ${user?.firstName}` : 'Welcome Guest'}
        </div>
    )
}));

vi.mock('@/components/FeatureCard/FeatureCard', () => ({
    default: ({ title }: any) => <div data-testid="feature">{title}</div>
}));

describe('HomePage', () => {
    it('renders correctly for unauthenticated user', () => {
        (useAuth as any).mockReturnValue({ user: null, isAuthenticated: false });
        const { asFragment } = render(
            <BrowserRouter>
                <HomePage />
            </BrowserRouter>
        );
        expect(screen.getByText(/Hero: Welcome Guest/i)).toBeDefined();
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly for authenticated user', () => {
        (useAuth as any).mockReturnValue({
            user: { firstName: 'John', lastName: 'Doe' },
            isAuthenticated: true
        });
        const { asFragment } = render(
            <BrowserRouter>
                <HomePage />
            </BrowserRouter>
        );
        expect(screen.getByText(/Hero: Welcome John/i)).toBeDefined();
        expect(asFragment()).toMatchSnapshot();
    });
});
