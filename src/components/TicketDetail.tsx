import { Ticket } from '../types';
import { formatDate, isDueThisWeek, isOverdue } from '../utils/dateUtils';
import AssigneeSelector from './AssigneeSelector';
import { TERMINOLOGY } from '../constants';
import Badge from './Badge';

interface TicketDetailProps {
  ticket: Ticket | null | undefined;
  getUserName: (userId: string | undefined) => string;
}

const TicketDetail = ({ ticket, getUserName }: TicketDetailProps) => {
  if (!ticket) {
    return (
      <div className="ticket-detail-empty">
        Select a {TERMINOLOGY.item} to view details
      </div>
    );
  }

  return (
    <div className="ticket-detail">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h2>{ticket.title}</h2>
        <div onClick={(e) => e.stopPropagation()}>
          <AssigneeSelector
            ticketId={ticket.id}
            currentAssigneeId={ticket.assigneeId}
          />
        </div>
      </div>

      <div className="ticket-meta">
        <div className="ticket-meta-item">
          <span className="ticket-meta-label">ID</span>
          <span>#{ticket.id}</span>
        </div>
        <div className="ticket-meta-item">
          <span className="ticket-meta-label">Status</span>
          <span className={`status-badge badge-${ticket.status}`}>
            {ticket.status}
          </span>
        </div>
        <div className="ticket-meta-item">
          <span className="ticket-meta-label">Priority</span>
          <span className={`priority-badge priority-${ticket.priority}`}>
            {ticket.priority}
          </span>
        </div>
        <div className="ticket-meta-item">
          <span className="ticket-meta-label">Reporter</span>
          <span>{getUserName(ticket.reporterId)}</span>
        </div>
        <div className="ticket-meta-item">
          <span className="ticket-meta-label">Assignee</span>
          <AssigneeSelector
            ticketId={ticket.id}
            currentAssigneeId={ticket.assigneeId}
          />
        </div>
        <div className="ticket-meta-item">
          <span className="ticket-meta-label">Created</span>
          <span>{formatDate(ticket.createdAt)}</span>
        </div>
        {ticket.dueDate && (
          <div className="ticket-meta-item">
            <span className="ticket-meta-label">Due Date</span>
            <span>
              {formatDate(ticket.dueDate)}
              {isDueThisWeek(ticket.dueDate) && !isOverdue(ticket.dueDate) && (
                <Badge type="due" value="Due this week" />
              )}
              {isOverdue(ticket.dueDate) && (
                <Badge type="due" value="Overdue" />
              )}
            </span>
          </div>
        )}
      </div>
      <div className="ticket-description">
        <h3>Description</h3>
        <p>{ticket.description || 'No description provided.'}</p>
      </div>
    </div>
  );
};

export default TicketDetail;
