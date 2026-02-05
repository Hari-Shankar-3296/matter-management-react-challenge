
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TicketCard from './TicketCard';
import { Ticket } from '@/types';

// Mock components and utils
vi.mock('@/components/AssigneeSelector/AssigneeSelector', () => ({
    default: () => <div data-testid="assignee-selector">AssigneeSelector</div>
}));

vi.mock('@/components/Badge/Badge', () => ({
    default: ({ value }: { value: string }) => <div data-testid="badge">{value}</div>
}));

vi.mock('@/utils/dateUtils/dateUtils', () => ({
    formatDate: vi.fn(() => 'Oct 25, 2023'),
    isDueThisWeek: vi.fn(),
    isOverdue: vi.fn(),
}));

describe('TicketCard Component', () => {
    const mockTicket: Ticket = {
        id: '1',
        title: 'Test Ticket',
        status: 'open',
        priority: 'high',
        createdAt: '2023-10-25T10:00:00Z',
        description: 'Test Description',
        reporterId: 'user-1',
        assigneeId: 'user-2',
    };

    const mockOnSelect = vi.fn();
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    it('renders ticket information correctly', () => {
        const { asFragment } = render(
            <TicketCard
                ticket={mockTicket}
                isSelected={false}
                onSelect={mockOnSelect}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );
        expect(screen.getByText('Test Ticket')).toBeDefined();
        expect(screen.getByText('Oct 25, 2023')).toBeDefined();
        expect(screen.getByText('open')).toBeDefined();
        expect(screen.getByText('high')).toBeDefined();
        expect(asFragment()).toMatchSnapshot();
    });

    it('calls onSelect when clicked', () => {
        render(
            <TicketCard
                ticket={mockTicket}
                isSelected={false}
                onSelect={mockOnSelect}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );
        fireEvent.click(screen.getByText('Test Ticket'));
        expect(mockOnSelect).toHaveBeenCalledWith(mockTicket);
    });

    it('calls onEdit when edit button is clicked', () => {
        render(
            <TicketCard
                ticket={mockTicket}
                isSelected={false}
                onSelect={mockOnSelect}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );
        fireEvent.click(screen.getByText('✏️'));
        expect(mockOnEdit).toHaveBeenCalledWith(mockTicket);
    });

    it('calls onDelete when delete button is clicked', () => {
        render(
            <TicketCard
                ticket={mockTicket}
                isSelected={false}
                onSelect={mockOnSelect}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );
        fireEvent.click(screen.getByText('🗑️'));
        expect(mockOnDelete).toHaveBeenCalledWith(mockTicket.id);
    });
});
