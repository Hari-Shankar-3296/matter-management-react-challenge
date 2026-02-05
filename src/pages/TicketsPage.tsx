import { useState } from 'react';
import { useTickets, useUpdateTicket, useDeleteTicket, useCreateTicket } from '../hooks/useTickets';
import { useUsers } from '../hooks/useUsers';
import { Ticket, TicketStatus, TicketFilters, TicketPriority } from '../types';
import TicketFiltersComponent from '../components/TicketFiltersComponent';
import Modal from '../components/Modal';
import TicketForm from '../components/TicketForm';
import { formatDate, isDueThisWeek, isOverdue } from '../utils/dateUtils';

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
        if (window.confirm('Are you sure you want to delete this ticket?')) {
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
        return <div className="loading">Loading tickets...</div>;
    }

    return (
        <div className="tickets-page">
            <div className="ticket-list-section">
                <div className="page-header">
                    <h1>Tickets</h1>
                    <button className="btn btn-primary" onClick={handleAddNew}>
                        + Add Ticket
                    </button>
                </div>

                <TicketFiltersComponent
                    onFilterChange={handleFilterChange}
                    initialFilters={filters}
                />

                <div className="ticket-list">
                    {tickets?.map((ticket) => (
                        <div
                            key={ticket.id}
                            className={`ticket-card ${selectedTicketId === ticket.id ? 'selected' : ''}`}
                            onClick={() => setSelectedTicketId(ticket.id)}
                        >
                            <div className="ticket-card-header">
                                <span className="ticket-card-title">
                                    {ticket.title}
                                    {isDueThisWeek(ticket.dueDate) && !isOverdue(ticket.dueDate) && (
                                        <span className="due-badge due-this-week">Due this week</span>
                                    )}
                                    {isOverdue(ticket.dueDate) && (
                                        <span className="due-badge overdue">Overdue</span>
                                    )}
                                </span>
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
                                <span className={`status-badge badge-${ticket.status}`}>
                                    {ticket.status}
                                </span>
                                <span className={`priority-badge priority-${ticket.priority}`}>
                                    {ticket.priority}
                                </span>
                                <span className="ticket-card-date">
                                    {formatDate(ticket.createdAt)}
                                </span>
                            </div>
                        </div>
                    ))}
                    {(!tickets || tickets.length === 0) && (
                        <div className="empty-state">No tickets found</div>
                    )}
                </div>
            </div>

            <div className="ticket-detail-section">
                {selectedTicket ? (
                    <div className="ticket-detail">
                        <h2>{selectedTicket.title}</h2>
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
                        Select a ticket to view details
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingTicket ? 'Edit Ticket' : 'Create Ticket'}
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
