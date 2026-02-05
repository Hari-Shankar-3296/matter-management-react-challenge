import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import KanbanCard from './KanbanCard';
import { Ticket } from '@/types';

vi.mock('@/components/AssigneeSelector/AssigneeSelector', () => ({
  default: () => <div data-testid="assignee-selector">AssigneeSelector</div>,
}));

vi.mock('@/components/Badge/Badge', () => ({
  default: ({ value }: { value: string }) => <div data-testid="badge">{value}</div>,
}));

vi.mock('@/utils/dateUtils/dateUtils', () => ({
  formatDate: vi.fn(() => 'Oct 25, 2023'),
  isDueThisWeek: vi.fn(() => false),
  isOverdue: vi.fn(() => false),
}));

describe('KanbanCard', () => {
  const mockTicket: Ticket = {
    id: '1',
    title: 'Test Ticket',
    status: 'open',
    priority: 'high',
    createdAt: '2023-10-25T10:00:00Z',
    reporterId: 'u1',
    description: 'desc',
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  it('renders ticket information correctly', () => {
    const { asFragment } = render(
      <KanbanCard ticket={mockTicket} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );
    expect(screen.getByText('#1')).toBeDefined();
    expect(screen.getByText('Test Ticket')).toBeDefined();
    expect(asFragment()).toMatchSnapshot();
  });

  it('is draggable', () => {
    const { container } = render(
      <KanbanCard ticket={mockTicket} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );
    const card = container.firstChild as HTMLElement;
    expect(card.draggable).toBe(true);
  });

  it('sets dataTransfer on drag start', () => {
    const { container } = render(
      <KanbanCard ticket={mockTicket} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );
    const card = container.firstChild as HTMLElement;
    const mockDataTransfer = {
      setData: vi.fn(),
      effectAllowed: '',
    };
    fireEvent.dragStart(card, { dataTransfer: mockDataTransfer });
    expect(mockDataTransfer.setData).toHaveBeenCalledWith('ticketId', '1');
    expect(mockDataTransfer.effectAllowed).toBe('move');
  });
});
