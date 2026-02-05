import { Ticket } from '@/types';
import { formatDate, isDueThisWeek, isOverdue } from '@/utils/dateUtils/dateUtils';
import AssigneeSelector from '@/components/AssigneeSelector/AssigneeSelector';
import Badge from '@/components/Badge/Badge';

interface TicketCardProps {
  ticket: Ticket;
  isSelected: boolean;
  onSelect: (ticket: Ticket) => void;
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
}

const TicketCard = ({ ticket, isSelected, onSelect, onEdit, onDelete }: TicketCardProps) => {
  const dueThisWeek = isDueThisWeek(ticket.dueDate);
  const overdue = isOverdue(ticket.dueDate);

  return (
    <div
      className={`ticket-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(ticket)}
    >
      <div className="ticket-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
          <span className="ticket-card-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {ticket.title}
          </span>
          {dueThisWeek && !overdue && (
            <Badge type="due" value="Due this week" />
          )}
          {overdue && (
            <Badge type="due" value="Overdue" />
          )}
        </div>
        <div className="ticket-card-actions">
          <button
            className="action-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(ticket);
            }}
          >
            ✏️
          </button>
          <button
            className="action-btn delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(ticket.id);
            }}
          >
            🗑️
          </button>
        </div>
      </div>
      <div className="ticket-card-meta">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', position: 'relative' }}>
          <Badge type="status" value={ticket.status} />
          <Badge type="priority" value={ticket.priority} />
          <span className="ticket-card-date">
            {formatDate(ticket.createdAt)}
          </span>
          <div style={{ position: 'absolute', right: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <p className='ticket-card-date'>Assigned to </p>
            <div onClick={(e) => e.stopPropagation()}>
              <AssigneeSelector
                ticketId={ticket.id}
                currentAssigneeId={ticket.assigneeId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
