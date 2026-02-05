import { Ticket } from '../types';
import { isDueThisWeek, isOverdue, formatDate } from '../utils/dateUtils';

interface KanbanCardProps {
    ticket: Ticket;
    onEdit: (ticket: Ticket) => void;
    onDelete: (id: string) => void;
}

const KanbanCard = ({ ticket, onEdit, onDelete }: KanbanCardProps) => {
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('ticketId', ticket.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const dueThisWeek = isDueThisWeek(ticket.dueDate);
    const overdue = isOverdue(ticket.dueDate);

    return (
        <div
            className={`kanban-card ${dueThisWeek && !overdue ? 'due-this-week' : ''} ${overdue ? 'overdue' : ''}`}
            draggable
            onDragStart={handleDragStart}
        >
            <div className="kanban-card-header">
                <span className="kanban-card-id">#{ticket.id}</span>
                <div className="kanban-card-actions">
                    <button
                        className="card-action-btn edit"
                        onClick={() => onEdit(ticket)}
                        aria-label="Edit ticket"
                    >
                        ✏️
                    </button>
                    <button
                        className="card-action-btn delete"
                        onClick={() => onDelete(ticket.id)}
                        aria-label="Delete ticket"
                    >
                        🗑️
                    </button>
                </div>
            </div>

            <h4 className="kanban-card-title">{ticket.title}</h4>

            {/* Due this week badge inside card */}
            {dueThisWeek && !overdue && (
                <div className="due-badge due-this-week">Due this week</div>
            )}
            {overdue && (
                <div className="due-badge overdue">Overdue</div>
            )}

            {ticket.description && (
                <p className="kanban-card-description">{ticket.description}</p>
            )}

            <div className="kanban-card-meta">
                <span className={`priority-badge priority-${ticket.priority}`}>
                    {ticket.priority}
                </span>
                {ticket.dueDate && (
                    <span className="kanban-card-date">{formatDate(ticket.dueDate)}</span>
                )}
            </div>
        </div>
    );
};

export default KanbanCard;
