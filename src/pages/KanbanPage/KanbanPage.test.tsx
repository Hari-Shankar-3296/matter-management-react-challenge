
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import KanbanPage from './KanbanPage';
import { useTickets, useUpdateTicket, useDeleteTicket, useCreateTicket } from '@/hooks/useTickets/useTickets';

// Mock hooks
vi.mock('@/hooks/useTickets/useTickets', () => ({
    useTickets: vi.fn(),
    useUpdateTicket: vi.fn(),
    useDeleteTicket: vi.fn(),
    useCreateTicket: vi.fn(),
}));

// Mock components
vi.mock('@/components/KanbanColumn/KanbanColumn', () => ({
    default: ({ title, tickets, onEdit, onDelete }: any) => (
        <div data-testid="kanban-column">
            <h3>{title}</h3>
            {tickets.map((t: any) => (
                <div key={t.id}>
                    {t.title}
                    <button onClick={() => onEdit(t)}>Edit</button>
                    <button onClick={() => onDelete(t.id)}>Delete</button>
                </div>
            ))}
        </div>
    )
}));

vi.mock('@/components/Modal/Modal', () => ({
    default: ({ isOpen, children }: any) => isOpen ? <div data-testid="modal">{children}</div> : null
}));

vi.mock('@/components/TicketForm/TicketForm', () => ({
    default: ({ onSubmit }: any) => (
        <div data-testid="ticket-form">
            <button onClick={() => onSubmit({ title: 'Updated' })}>Submit</button>
        </div>
    )
}));

vi.mock('@/components/ConfirmationModal/ConfirmationModal', () => ({
    default: ({ isOpen, onConfirm }: any) => isOpen ? (
        <div data-testid="confirm-modal">
            <button onClick={onConfirm}>Confirm</button>
        </div>
    ) : null
}));

describe('KanbanPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useTickets as any).mockReturnValue({
            data: [
                { id: '1', title: 'Ticket 1', status: 'open' },
                { id: '2', title: 'Ticket 2', status: 'in-progress' },
            ],
            isLoading: false,
        });
        (useUpdateTicket as any).mockReturnValue({
            mutate: vi.fn((_, options) => {
                if (options && options.onSuccess) options.onSuccess({ id: '1', title: 'Ticket 1', status: 'open' });
            })
        });
        (useDeleteTicket as any).mockReturnValue({
            mutate: vi.fn((_, options) => {
                if (options && options.onSuccess) options.onSuccess();
            })
        });
        (useCreateTicket as any).mockReturnValue({
            mutate: vi.fn((_, options) => {
                if (options && options.onSuccess) options.onSuccess({ id: '3', title: 'New Ticket', status: 'open' });
            })
        });
    });

    it('renders kanban board with columns', () => {
        const { asFragment } = render(<KanbanPage />);
        expect(screen.getByText('Kanban Board')).toBeDefined();
        expect(screen.getAllByTestId('kanban-column')).toHaveLength(3);
        expect(asFragment()).toMatchSnapshot();
    });

    it('opens modal when edit is clicked', () => {
        render(<KanbanPage />);
        const editBtns = screen.getAllByText('Edit');
        fireEvent.click(editBtns[0]);
        expect(screen.getByTestId('modal')).toBeDefined();
    });

    it('shows loading state', () => {
        (useTickets as any).mockReturnValue({ data: null, isLoading: true });
        render(<KanbanPage />);
        expect(screen.getByText(/Loading/i)).toBeDefined();
    });

    it('shows error state', () => {
        (useTickets as any).mockReturnValue({ data: null, isLoading: false, error: new Error() });
        render(<KanbanPage />);
        expect(screen.getByText(/Error/i)).toBeDefined();
    });

    it('opens modal when add ticket is clicked', () => {
        render(<KanbanPage />);
        fireEvent.click(screen.getByText(/Add Matter/i));
        expect(screen.getByTestId('modal')).toBeDefined();
        expect(screen.getByTestId('ticket-form')).toBeDefined();
    });

    it('handles delete flow', () => {
        const mockDelete = vi.fn((_id, options) => {
            if (options && options.onSuccess) options.onSuccess();
        });
        (useDeleteTicket as any).mockReturnValue({ mutate: mockDelete });

        render(<KanbanPage />);

        fireEvent.click(screen.getAllByText('Delete')[0]);
        expect(screen.getByTestId('confirm-modal')).toBeDefined();

        fireEvent.click(screen.getByText('Confirm'));
        expect(mockDelete).toHaveBeenCalled();
    });
});
