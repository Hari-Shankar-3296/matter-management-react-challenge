import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import KanbanColumn from './KanbanColumn';
import { Ticket } from '@/types';

vi.mock('@/components/KanbanCard/KanbanCard', () => ({
  default: ({ ticket }: { ticket: Ticket }) => <div data-testid="kanban-card">{ticket.title}</div>,
}));

describe('KanbanColumn', () => {
  const mockTickets: Ticket[] = [
    {
      id: '1',
      title: 'Ticket 1',
      status: 'open',
      priority: 'high',
      createdAt: '2023-10-25T10:00:00Z',
      reporterId: 'u1',
      description: 'desc',
    },
  ];
  const mockOnDrop = vi.fn();

  it('renders column title and ticket count', () => {
    const { asFragment } = render(
      <KanbanColumn
        status="open"
        title="Open Matters"
        tickets={mockTickets}
        onDrop={mockOnDrop}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText('Open Matters')).toBeDefined();
    expect(screen.getByText('1')).toBeDefined();
    expect(screen.getByTestId('kanban-card')).toBeDefined();
    expect(asFragment()).toMatchSnapshot();
  });

  it('handles drop event', () => {
    const { container } = render(
      <KanbanColumn
        status="open"
        title="Open Matters"
        tickets={[]}
        onDrop={mockOnDrop}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    const column = container.firstChild as HTMLElement;
    const mockDataTransfer = {
      getData: vi.fn(() => 'test-id'),
    };
    fireEvent.drop(column, { dataTransfer: mockDataTransfer });
    expect(mockOnDrop).toHaveBeenCalledWith('test-id', 'open');
  });
});
