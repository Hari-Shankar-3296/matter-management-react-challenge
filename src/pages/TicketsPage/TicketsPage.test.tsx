
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TicketsPage from './TicketsPage';
import { useTickets, useUpdateTicket, useDeleteTicket, useCreateTicket } from '@/hooks/useTickets/useTickets';
import { useUsers } from '@/hooks/useUsers/useUsers';
import { BrowserRouter } from 'react-router-dom';

// Mock hooks
vi.mock('@/hooks/useTickets/useTickets', () => ({
    useTickets: vi.fn(),
    useUpdateTicket: vi.fn(),
    useDeleteTicket: vi.fn(),
    useCreateTicket: vi.fn(),
}));

vi.mock('@/hooks/useUsers/useUsers', () => ({
    useUsers: vi.fn(),
}));

// Mock components
vi.mock('@/components/TicketFiltersComponent/TicketFiltersComponent', () => ({
    default: () => <div data-testid="filters">Filters</div>
}));

vi.mock('@/components/TicketList/TicketList', () => ({
    default: ({ onSelect }: any) => (
        <div data-testid="ticket-list">
            <button onClick={() => onSelect({ id: '1' })}>Select Ticket 1</button>
        </div>
    )
}));

vi.mock('@/components/TicketDetail/TicketDetail', () => ({
    default: ({ ticket }: any) => <div data-testid="ticket-detail">{ticket?.title || 'No Selection'}</div>
}));

vi.mock('@/components/Modal/Modal', () => ({
    default: ({ isOpen, children, title }: any) => isOpen ? (
        <div data-testid="modal">
            <h2>{title}</h2>
            {children}
        </div>
    ) : null
}));

vi.mock('@/components/TicketForm/TicketForm', () => ({
    default: () => <div data-testid="ticket-form">Ticket Form</div>
}));

vi.mock('@/components/ConfirmationModal/ConfirmationModal', () => ({
    default: ({ isOpen }: any) => isOpen ? <div data-testid="confirm-modal">Confirm</div> : null
}));

describe('TicketsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useTickets as any).mockReturnValue({
            data: [{ id: '1', title: 'Ticket 1' }],
            isLoading: false,
        });
        (useUsers as any).mockReturnValue({ data: [] });
        (useUpdateTicket as any).mockReturnValue({
            mutate: vi.fn((_, options) => {
                if (options && options.onSuccess) options.onSuccess({ id: '1', title: 'Ticket 1' });
            }),
            isPending: false
        });
        (useDeleteTicket as any).mockReturnValue({
            mutate: vi.fn((_, options) => {
                if (options && options.onSuccess) options.onSuccess();
            }),
            isPending: false
        });
        (useCreateTicket as any).mockReturnValue({
            mutate: vi.fn((_, options) => {
                if (options && options.onSuccess) options.onSuccess({ id: '2', title: 'New Ticket' });
            }),
            isPending: false
        });
    });

    const renderPage = () => {
        return render(
            <BrowserRouter>
                <TicketsPage />
            </BrowserRouter>
        );
    };

    it('renders page header and add button', () => {
        const { asFragment } = renderPage();
        expect(screen.getByText('Matters')).toBeDefined();
        expect(screen.getByText(/Add Matter/i)).toBeDefined();
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders filters and ticket list', () => {
        renderPage();
        expect(screen.getByTestId('filters')).toBeDefined();
        expect(screen.getByTestId('ticket-list')).toBeDefined();
    });

    it('shows ticket detail when a ticket is selected', async () => {
        renderPage();
        const selectBtn = screen.getByText('Select Ticket 1');
        fireEvent.click(selectBtn);
        expect(screen.getByText('Ticket 1')).toBeDefined();
    });

    it('opens modal when add button is clicked', () => {
        renderPage();
        fireEvent.click(screen.getByText(/Add Matter/i));
        expect(screen.getByTestId('modal')).toBeDefined();
        expect(screen.getByText('Create Matter')).toBeDefined();
    });

    it('shows loading state', () => {
        (useTickets as any).mockReturnValue({ data: null, isLoading: true });
        renderPage();
        expect(screen.getByText(/Loading/i)).toBeDefined();
    });

    it('shows error state', () => {
        (useTickets as any).mockReturnValue({ data: null, isLoading: false, error: new Error() });
        renderPage();
        expect(screen.getByText(/Error/i)).toBeDefined();
    });
});
