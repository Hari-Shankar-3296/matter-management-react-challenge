import { Ticket } from '@/types';
import { isDueThisWeek, isOverdue, formatDate } from '@/utils/dateUtils/dateUtils';
import AssigneeSelector from '@/components/AssigneeSelector/AssigneeSelector';
import Badge from '@/components/Badge/Badge';

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

    // Get assignee initials


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
                        aria-label="Edit matter"
                    >
                        ✏️
                    </button>
                    <button
                        className="card-action-btn delete"
                        onClick={() => onDelete(ticket.id)}
                        aria-label="Delete matter"
                    >
                        🗑️
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <h4 className="kanban-card-title" style={{
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: dueThisWeek ? '140px' : '100%'
                }} title={ticket.title}>
                    {ticket.title}
                </h4>

                {/* Due this week badge next to title */}
                {dueThisWeek && !overdue && (
                    <Badge type="due" value="Due this week" style={{ fontSize: '0.65rem' }} />
                )}
            </div>

            {overdue && (
                <div style={{ marginBottom: '8px' }}>
                    <Badge type="due" value="Overdue" />
                </div>
            )}

            {ticket.description && (
                <p className="kanban-card-description">{ticket.description}</p>
            )}

            <div className="kanban-card-meta">
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Badge type="priority" value={ticket.priority} />
                    {ticket.dueDate && (
                        <span className="kanban-card-date">{formatDate(ticket.dueDate)}</span>
                    )}
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                    <AssigneeSelector
                        ticketId={ticket.id}
                        currentAssigneeId={ticket.assigneeId}
                        onUpdate={() => { }} // Optional: trigger a refresh if needed, but react-query should handle it
                    />
                </div>
            </div>
        </div>
    );
};

export default KanbanCard;
