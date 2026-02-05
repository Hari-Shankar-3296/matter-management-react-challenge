
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MyTicketsPage from './MyTicketsPage';
import { useMyTickets, useUpdateTicket, useDeleteTicket } from '@/hooks/useTickets/useTickets';
import { useAuth } from '@/contexts/AuthContext/AuthContext';

// Mock hooks
vi.mock('@/hooks/useTickets/useTickets', () => ({
    useMyTickets: vi.fn(),
    useUpdateTicket: vi.fn(),
    useDeleteTicket: vi.fn(),
}));

vi.mock('@/contexts/AuthContext/AuthContext', () => ({
    useAuth: vi.fn(),
}));

// Mock components
vi.mock('@/components/TicketTable/TicketTable', () => ({
    default: ({ tickets, onEdit }: any) => (
        <div data-testid="ticket-table">
            {tickets?.map((t: any) => (
                <div key={t.id}>
                    {t.title}
                    <button onClick={() => onEdit(t)}>Edit</button>
                </div>
            ))}
        </div>
    )
}));

vi.mock('@/components/Modal/Modal', () => ({
    default: ({ isOpen, children }: any) => isOpen ? <div data-testid="modal">{children}</div> : null
}));

vi.mock('@/components/TicketForm/TicketForm', () => ({
    default: () => <div data-testid="ticket-form">Form</div>
}));

vi.mock('@/components/ConfirmationModal/ConfirmationModal', () => ({
    default: ({ isOpen }: any) => isOpen ? <div data-testid="confirm-modal">Confirm</div> : null
}));

describe('MyTicketsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({});
        (useMyTickets as any).mockReturnValue({
            data: {
                assigned: [{ id: '1', title: 'Assigned 1' }],
                reported: [{ id: '2', title: 'Reported 1' }],
            },
            isLoading: false,
        });
        (useUpdateTicket as any).mockReturnValue({
            mutate: vi.fn((_, options) => {
                if (options && options.onSuccess) options.onSuccess({ id: '1', title: 'Assigned 1' });
            })
        });
        (useDeleteTicket as any).mockReturnValue({
            mutate: vi.fn((_, options) => {
                if (options && options.onSuccess) options.onSuccess();
            })
        });
        // createTicket is not used in MyTicketsPage currently, but if it was, we would add it here.
    });

    it('renders tabs and assigned tickets by default', () => {
        const { asFragment } = render(<MyTicketsPage />);
        expect(screen.getByText(/Assigned to Me/i)).toBeDefined();
        expect(screen.getByText('Assigned 1')).toBeDefined();
        expect(asFragment()).toMatchSnapshot();
    });

    it('switches to reported tickets tab', () => {
        render(<MyTicketsPage />);
        fireEvent.click(screen.getByText(/Reported by Me/i));
        expect(screen.getByText('Reported 1')).toBeDefined();
    });

    it('opens modal when edit is clicked', () => {
        render(<MyTicketsPage />);
        fireEvent.click(screen.getByText('Edit'));
        expect(screen.getByTestId('modal')).toBeDefined();
    });

    it('shows loading state', () => {
        (useMyTickets as any).mockReturnValue({ data: null, isLoading: true });
        render(<MyTicketsPage />);
        expect(screen.getByText(/Loading/i)).toBeDefined();
    });

    it('shows error state', () => {
        (useMyTickets as any).mockReturnValue({ data: null, isLoading: false, error: new Error() });
        render(<MyTicketsPage />);
        expect(screen.getByText(/Error/i)).toBeDefined();
    });
});
