import { useState } from 'react';
import { Ticket, TicketStatus } from '@/types';
import KanbanCard from '@/components/KanbanCard/KanbanCard';

interface KanbanColumnProps {
  status: TicketStatus;
  title: string;
  tickets: Ticket[];
  onDrop: (ticketId: string, newStatus: TicketStatus) => void;
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
}

const KanbanColumn = ({ status, title, tickets, onDrop, onEdit, onDelete }: KanbanColumnProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const ticketId = e.dataTransfer.getData('ticketId');
    if (ticketId) {
      onDrop(ticketId, status);
    }
  };

  const statusColors: Record<TicketStatus, string> = {
    open: '#3b82f6',
    'in-progress': '#f59e0b',
    closed: '#10b981',
  };

  return (
    <div
      className={`kanban-column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="kanban-column-header" style={{ borderTopColor: statusColors[status] }}>
        <h3 className="kanban-column-title">{title}</h3>
        <span className="kanban-column-count">{tickets.length}</span>
      </div>
      <div className="kanban-column-body">
        {tickets.map((ticket) => (
          <KanbanCard key={ticket.id} ticket={ticket} onEdit={onEdit} onDelete={onDelete} />
        ))}
        {tickets.length === 0 && <div className="kanban-empty">No matters</div>}
      </div>
    </div>
  );
};

export default KanbanColumn;
