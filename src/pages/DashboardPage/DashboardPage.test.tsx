
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardPage from './DashboardPage';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { useTicketStats, useMyTickets } from '@/hooks/useTickets/useTickets';

// Mock hooks
vi.mock('@/contexts/AuthContext/AuthContext', () => ({
    useAuth: vi.fn(),
}));

vi.mock('@/hooks/useTickets/useTickets', () => ({
    useTicketStats: vi.fn(),
    useMyTickets: vi.fn(),
}));

// Mock sub-components
vi.mock('@/components/DashboardChart/DashboardChart', () => ({
    default: ({ title }: { title: string }) => <div data-testid="dashboard-chart">{title}</div>
}));

vi.mock('@/components/TicketListMini/TicketListMini', () => ({
    default: ({ title }: { title: string }) => <div data-testid="ticket-list-mini">{title}</div>
}));

describe('DashboardPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({
            user: { firstName: 'Harishankar', lastName: 'Devaraj' },
        });
        (useTicketStats as any).mockReturnValue({
            data: {
                total: 10,
                open: 5,
                closed: 3,
                inProgress: 2,
                byPriority: { critical: 1, high: 2, medium: 3, low: 4 }
            },
            isLoading: false,
        });
        (useMyTickets as any).mockReturnValue({
            data: { assigned: [], reported: [] },
            isLoading: false,
        });
    });

    it('renders welcome message and stat cards', () => {
        const { asFragment } = render(<DashboardPage />);
        expect(screen.getByText(/Welcome back, Harishankar!/i)).toBeDefined();
        expect(screen.getByText(/Total Matters/i)).toBeDefined();
        expect(screen.getByText('10')).toBeDefined();
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders charts and recent tickets', () => {
        render(<DashboardPage />);
        expect(screen.getByText(/Matters by Status/i)).toBeDefined();
        expect(screen.getByText(/Matters by Priority/i)).toBeDefined();
        expect(screen.getByText(/My Assigned Matters/i)).toBeDefined();
    });

    it('shows loading state', () => {
        (useTicketStats as any).mockReturnValue({ isLoading: true });
        render(<DashboardPage />);
        expect(screen.getByText(/Loading dashboard.../i)).toBeDefined();
    });
});
