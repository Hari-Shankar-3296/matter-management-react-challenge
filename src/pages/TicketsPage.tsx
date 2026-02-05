import { useState } from 'react';
import { useTickets, useUpdateTicket, useDeleteTicket, useCreateTicket } from '../hooks/useTickets';
import { useUsers } from '../hooks/useUsers';
import { Ticket, TicketStatus, TicketFilters, TicketPriority } from '../types';
import TicketFiltersComponent from '../components/TicketFiltersComponent';
import Modal from '../components/Modal';
import TicketForm from '../components/TicketForm';
import { formatDate, isDueThisWeek, isOverdue } from '../utils/dateUtils';
import { TERMINOLOGY } from '../constants';

const TicketsPage = () => {
    const [filters, setFilters] = useState<TicketFilters>({});
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

    const { data: tickets, isLoading } = useTickets(filters);
    const { data: users } = useUsers();
    const updateTicket = useUpdateTicket();
    const deleteTicket = useDeleteTicket();
    const createTicket = useCreateTicket();

    const selectedTicket = tickets?.find((t) => t.id === selectedTicketId);

    const getUserName = (userId: string | undefined) => {
        if (!userId) return 'Unassigned';
        const user = users?.find((u) => u.id === userId);
        return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
    };

    const getUserInitials = (userId: string | undefined) => {
        if (!userId) return null;
        const user = users?.find((u) => u.id === userId);
        return user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : null;
    };

    const handleFilterChange = (newFilters: TicketFilters) => {
        setFilters(newFilters);
    };

    const handleAddNew = () => {
        setEditingTicket(null);
        setIsModalOpen(true);
    };

    const handleEdit = (ticket: Ticket) => {
        setEditingTicket(ticket);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm(`Are you sure you want to delete this ${TERMINOLOGY.item}?`)) {
            deleteTicket.mutate(id);
            if (selectedTicketId === id) {
                setSelectedTicketId(null);
            }
        }
    };

    const handleFormSubmit = (data: {
        title: string;
        description: string;
        status: TicketStatus;
        priority?: TicketPriority;
        assigneeId?: string;
        dueDate?: string;
    }) => {
        if (editingTicket) {
            updateTicket.mutate(
                { id: editingTicket.id, ...data },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        setEditingTicket(null);
                    },
                }
            );
        } else {
            createTicket.mutate(data, {
                onSuccess: () => {
                    setIsModalOpen(false);
                },
            });
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTicket(null);
    };

    if (isLoading) {
        return <div className="loading">Loading {TERMINOLOGY.items}...</div>;
    }

    return (
        <div className="tickets-page">
            <div className="ticket-list-section">
                <div className="page-header">
                    <h1>{TERMINOLOGY.ITEMS}</h1>
                    <button className="btn btn-primary" onClick={handleAddNew}>
                        + Add {TERMINOLOGY.ITEM}
                    </button>
                </div>

                <TicketFiltersComponent
                    onFilterChange={handleFilterChange}
                    initialFilters={filters}
                />

                <div className="ticket-list" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                    {tickets?.map((ticket) => {
                        const assigneeInitials = getUserInitials(ticket.assigneeId);
                        const dueThisWeek = isDueThisWeek(ticket.dueDate);
                        const overdue = isOverdue(ticket.dueDate);

                        return (
                            <div
                                key={ticket.id}
                                className={`ticket-card ${selectedTicketId === ticket.id ? 'selected' : ''}`}
                                onClick={() => setSelectedTicketId(ticket.id)}
                            >
                                <div className="ticket-card-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                                        <span className="ticket-card-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {ticket.title}
                                        </span>
                                        {dueThisWeek && !overdue && (
                                            <span className="due-badge due-this-week" style={{ flexShrink: 0 }}>Due this week</span>
                                        )}
                                        {overdue && (
                                            <span className="due-badge overdue" style={{ flexShrink: 0 }}>Overdue</span>
                                        )}
                                    </div>
                                    <div className="ticket-card-actions">
                                        <button
                                            className="action-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(ticket);
                                            }}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="action-btn delete"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(ticket.id);
                                            }}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                                <div className="ticket-card-meta">
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', position: 'relative' }}>
                                        <span className={`status-badge badge-${ticket.status}`}>
                                            {ticket.status}
                                        </span>
                                        <span className={`priority-badge priority-${ticket.priority}`}>
                                            {ticket.priority}
                                        </span>
                                        <span className="ticket-card-date">
                                            {formatDate(ticket.createdAt)}
                                        </span>
                                        {assigneeInitials && (
                                            <div style={{ position: 'absolute', right: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <p className='ticket-card-date'>Assigned to </p>
                                                <div title={`Assigned to ${getUserName(ticket.assigneeId)}`} style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '50%',
                                                    background: 'var(--primary-500)',
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {assigneeInitials}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {(!tickets || tickets.length === 0) && (
                        <div className="empty-state">No {TERMINOLOGY.items} found</div>
                    )}
                </div>
            </div>

            <div className="ticket-detail-section">
                {selectedTicket ? (
                    <div className="ticket-detail">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h2>{selectedTicket.title}</h2>
                            {getUserInitials(selectedTicket.assigneeId) && (
                                <div className="user-avatar-btn" style={{ width: '48px', height: '48px', fontSize: '1.2rem', cursor: 'default' }} title={`Assigned to ${getUserName(selectedTicket.assigneeId)}`}>
                                    {getUserInitials(selectedTicket.assigneeId)}
                                </div>
                            )}
                        </div>

                        <div className="ticket-meta">
                            <div className="ticket-meta-item">
                                <span className="ticket-meta-label">ID</span>
                                <span>#{selectedTicket.id}</span>
                            </div>
                            <div className="ticket-meta-item">
                                <span className="ticket-meta-label">Status</span>
                                <span className={`status-badge badge-${selectedTicket.status}`}>
                                    {selectedTicket.status}
                                </span>
                            </div>
                            <div className="ticket-meta-item">
                                <span className="ticket-meta-label">Priority</span>
                                <span className={`priority-badge priority-${selectedTicket.priority}`}>
                                    {selectedTicket.priority}
                                </span>
                            </div>
                            <div className="ticket-meta-item">
                                <span className="ticket-meta-label">Reporter</span>
                                <span>{getUserName(selectedTicket.reporterId)}</span>
                            </div>
                            <div className="ticket-meta-item">
                                <span className="ticket-meta-label">Assignee</span>
                                <span>{getUserName(selectedTicket.assigneeId)}</span>
                            </div>
                            <div className="ticket-meta-item">
                                <span className="ticket-meta-label">Created</span>
                                <span>{formatDate(selectedTicket.createdAt)}</span>
                            </div>
                            {selectedTicket.dueDate && (
                                <div className="ticket-meta-item">
                                    <span className="ticket-meta-label">Due Date</span>
                                    <span>
                                        {formatDate(selectedTicket.dueDate)}
                                        {isDueThisWeek(selectedTicket.dueDate) && !isOverdue(selectedTicket.dueDate) && (
                                            <span className="due-badge due-this-week">Due this week</span>
                                        )}
                                        {isOverdue(selectedTicket.dueDate) && (
                                            <span className="due-badge overdue">Overdue</span>
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="ticket-description">
                            <h3>Description</h3>
                            <p>{selectedTicket.description || 'No description provided.'}</p>
                        </div>
                    </div>
                ) : (
                    <div className="ticket-detail-empty">
                        Select a {TERMINOLOGY.item} to view details
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingTicket ? `Edit ${TERMINOLOGY.ITEM}` : `Create ${TERMINOLOGY.ITEM}`}
            >
                <TicketForm
                    ticket={editingTicket}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                    isLoading={updateTicket.isPending || createTicket.isPending}
                />
            </Modal>
        </div>
    );
};

export default TicketsPage;
