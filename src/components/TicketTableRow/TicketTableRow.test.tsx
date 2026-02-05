
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TicketTableRow from './TicketTableRow';
import { Ticket } from '@/types';

vi.mock('@/components/AssigneeSelector/AssigneeSelector', () => ({
    default: () => <div data-testid="assignee-selector">AssigneeSelector</div>
}));

vi.mock('@/components/Badge/Badge', () => ({
    default: ({ value }: { value: string }) => <div data-testid="badge">{value}</div>
}));

vi.mock('@/utils/dateUtils/dateUtils', () => ({
    formatDate: vi.fn(() => 'Oct 25, 2023'),
    isDueThisWeek: vi.fn(() => false),
    isOverdue: vi.fn(() => false),
}));

describe('TicketTableRow', () => {
    const mockTicket: Ticket = {
        id: '1',
        title: 'Test Ticket',
        status: 'open',
        priority: 'high',
        createdAt: '2023-10-25T10:00:00Z',
        dueDate: '2023-10-30T10:00:00Z',
        reporterId: 'u1',
        description: 'desc'
    };

    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    const renderRow = (activeTab: 'assigned' | 'reported' = 'assigned') => {
        return render(
            <table>
                <tbody>
                    <TicketTableRow
                        ticket={mockTicket}
                        activeTab={activeTab}
                        onEdit={mockOnEdit}
                        onDelete={mockOnDelete}
                    />
                </tbody>
            </table>
        );
    };

    it('renders ticket data correctly', () => {
        const { asFragment } = renderRow();
        expect(screen.getByText('#1')).toBeDefined();
        expect(screen.getByText('Test Ticket')).toBeDefined();
        expect(screen.getByText('Oct 25, 2023')).toBeDefined();
        expect(asFragment()).toMatchSnapshot();
    });

    it('calls onEdit when edit button is clicked', () => {
        renderRow();
        fireEvent.click(screen.getByText('✏️'));
        expect(mockOnEdit).toHaveBeenCalledWith(mockTicket);
    });

    it('calls onDelete when delete button is clicked', () => {
        renderRow();
        fireEvent.click(screen.getByText('🗑️'));
        expect(mockOnDelete).toHaveBeenCalledWith(mockTicket.id);
    });
});
