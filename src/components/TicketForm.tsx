import { useState, useEffect } from 'react';
import { Ticket, TicketStatus, TicketPriority } from '../types';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../contexts/AuthContext';
import { formatDateForInput } from '../utils/dateUtils';

interface TicketFormProps {
    ticket?: Ticket | null;
    onSubmit: (data: {
        title: string;
        description: string;
        status: TicketStatus;
        priority?: TicketPriority;
        assigneeId?: string;
        dueDate?: string;
    }) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const TicketForm = ({ ticket, onSubmit, onCancel, isLoading }: TicketFormProps) => {
    const { user } = useAuth();
    const { data: users } = useUsers();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TicketStatus>('open');
    const [priority, setPriority] = useState<TicketPriority>('medium');
    const [assigneeId, setAssigneeId] = useState('');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        if (ticket) {
            setTitle(ticket.title);
            setDescription(ticket.description || '');
            setStatus(ticket.status);
            setPriority(ticket.priority);
            setAssigneeId(ticket.assigneeId || '');
            setDueDate(formatDateForInput(ticket.dueDate));
        } else {
            setTitle('');
            setDescription('');
            setStatus('open');
            setPriority('medium');
            setAssigneeId('');
            setDueDate('');
        }
    }, [ticket]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit({
            title: title.trim(),
            description: description.trim(),
            status,
            priority,
            assigneeId: assigneeId || undefined,
            dueDate: dueDate || undefined,
        });
    };

    const getReporterName = () => {
        if (ticket) {
            const reporter = users?.find((u) => u.id === ticket.reporterId);
            return reporter ? `${reporter.firstName} ${reporter.lastName}` : 'Unknown';
        }
        return user ? `${user.firstName} ${user.lastName}` : 'You';
    };

    return (
        <form className="ticket-form" onSubmit={handleSubmit}>
            {/* Read-only fields */}
            {ticket && (
                <div className="form-row">
                    <div className="form-group">
                        <label>Ticket ID</label>
                        <input type="text" value={`#${ticket.id}`} disabled />
                    </div>
                    <div className="form-group">
                        <label>Reporter</label>
                        <input type="text" value={getReporterName()} disabled />
                    </div>
                </div>
            )}

            {ticket && (
                <div className="form-group">
                    <label>Created Date</label>
                    <input
                        type="text"
                        value={new Date(ticket.createdAt).toLocaleString()}
                        disabled
                    />
                </div>
            )}

            <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter ticket title"
                    required
                    autoFocus
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter ticket description"
                    rows={4}
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as TicketStatus)}
                    >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as TicketPriority)}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="assignee">Assignee</label>
                    <select
                        id="assignee"
                        value={assigneeId}
                        onChange={(e) => setAssigneeId(e.target.value)}
                    >
                        <option value="">-- Unassigned --</option>
                        {users?.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.firstName} {u.lastName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="dueDate">Due Date</label>
                    <input
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading || !title.trim()}
                >
                    {isLoading ? 'Saving...' : ticket ? 'Update Ticket' : 'Create Ticket'}
                </button>
            </div>
        </form>
    );
};

export default TicketForm;
