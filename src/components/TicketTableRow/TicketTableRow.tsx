import { Ticket } from '@/types';
import { formatDate, isDueThisWeek, isOverdue } from '@/utils/dateUtils/dateUtils';
import AssigneeSelector from '@/components/AssigneeSelector/AssigneeSelector';
import Badge from '@/components/Badge/Badge';

interface TicketTableRowProps {
  ticket: Ticket;
  activeTab: 'assigned' | 'reported';
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
}

const TicketTableRow = ({ ticket, activeTab, onEdit, onDelete }: TicketTableRowProps) => {
  return (
    <tr>
      <td className="ticket-id-cell">#{ticket.id}</td>
      <td className="ticket-title-cell">
        {ticket.title}
        {isDueThisWeek(ticket.dueDate) && !isOverdue(ticket.dueDate) && (
          <Badge type="due" value="Due this week" />
        )}
        {isOverdue(ticket.dueDate) && <Badge type="due" value="Overdue" />}
      </td>
      <td>
        <Badge type="status" value={ticket.status} />
      </td>
      <td>
        <Badge type="priority" value={ticket.priority} />
      </td>
      <td>
        <div onClick={(e) => e.stopPropagation()}>
          <AssigneeSelector
            ticketId={ticket.id}
            currentAssigneeId={activeTab === 'assigned' ? ticket.reporterId : ticket.assigneeId}
            readonly={activeTab === 'assigned'}
          />
        </div>
      </td>
      <td>{ticket.dueDate ? formatDate(ticket.dueDate) : '-'}</td>
      <td>
        <div className="table-actions">
          <button className="action-btn" onClick={() => onEdit(ticket)}>
            ✏️
          </button>
          <button className="action-btn delete" onClick={() => onDelete(ticket.id)}>
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TicketTableRow;
