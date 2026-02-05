import { useState, useEffect } from 'react';
import { Ticket, TicketStatus, TicketPriority } from '@/types';
import { useUsers } from '@/hooks/useUsers/useUsers';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { formatDateForInput } from '@/utils/dateUtils/dateUtils';
import { TERMINOLOGY } from '@/constants';

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setErrors({}); // Clear errors when ticket changes
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

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = `Title must be at least 3 characters`;
    }

    if (description.length > 500) {
      newErrors.description = `Description must be less than 500 characters (${description.length}/500)`;
    }

    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(dueDate);
      // Only validate past dates for new tickets, as existing ones might historically keep their date
      // or we might want to allow editing past tickets without forcing a date change.
      // But for testing demo app I have added this validation
      // Plan: "cannot be earlier than 'today' for *new* tickets"
      if (!ticket && selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past for new items';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

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
            <label>{TERMINOLOGY.ITEM} ID</label>
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
          <input type="text" value={new Date(ticket.createdAt).toLocaleString()} disabled />
        </div>
      )}

      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors({ ...errors, title: '' });
          }}
          placeholder={`Enter ${TERMINOLOGY.item} title`}
          autoFocus
          className={errors.title ? 'input-error' : ''}
          style={errors.title ? { borderColor: 'var(--danger)' } : {}}
        />
        {errors.title && (
          <span
            className="error-message"
            style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '4px' }}
          >
            {errors.title}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors({ ...errors, description: '' });
          }}
          placeholder={`Enter ${TERMINOLOGY.item} description`}
          rows={4}
          style={errors.description ? { borderColor: 'var(--danger)' } : {}}
        />
        {errors.description && (
          <span
            className="error-message"
            style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '4px' }}
          >
            {errors.description}
          </span>
        )}
        <div
          style={{
            textAlign: 'right',
            fontSize: '0.75rem',
            color: description.length > 500 ? 'var(--danger)' : 'var(--text-muted)',
          }}
        >
          {description.length}/500
        </div>
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
          <select id="assignee" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
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
            onChange={(e) => {
              setDueDate(e.target.value);
              if (errors.dueDate) setErrors({ ...errors, dueDate: '' });
            }}
            style={errors.dueDate ? { borderColor: 'var(--danger)' } : {}}
          />
          {errors.dueDate && (
            <span
              className="error-message"
              style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '4px' }}
            >
              {errors.dueDate}
            </span>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading
            ? 'Saving...'
            : ticket
              ? `Update ${TERMINOLOGY.ITEM}`
              : `Create ${TERMINOLOGY.ITEM}`}
        </button>
      </div>
    </form>
  );
};

export default TicketForm;
