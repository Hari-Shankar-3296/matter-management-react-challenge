import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTickets, useUpdateTicket, useDeleteTicket, useCreateTicket } from '../hooks/useTickets';
import { useUsers } from '../hooks/useUsers';
import { Ticket, TicketStatus, TicketFilters, TicketPriority } from '../types';
import TicketFiltersComponent from '../components/TicketFiltersComponent';
import Modal from '../components/Modal';
import ConfirmationModal from '../components/ConfirmationModal';
import TicketForm from '../components/TicketForm';
import { formatDate, isDueThisWeek, isOverdue } from '../utils/dateUtils';
import { TERMINOLOGY } from '../constants';
import AssigneeSelector from '../components/AssigneeSelector';

const TicketsPage = () => {
    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState<TicketFilters>({
        search: searchParams.get('search') || undefined,
        status: (searchParams.get('status') as TicketStatus) || undefined,
        priority: (searchParams.get('priority') as TicketPriority) || undefined,
        sortBy: (searchParams.get('sortBy') as any) || 'date',
    });
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
    const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false);
    const [pendingUpdateData, setPendingUpdateData] = useState<any>(null);

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

    const confirmDelete = (id: string) => {
        setTicketToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (ticketToDelete) {
            deleteTicket.mutate(ticketToDelete);
            if (selectedTicketId === ticketToDelete) {
                setSelectedTicketId(null);
            }
            setTicketToDelete(null);
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
            setPendingUpdateData(data);
            setIsUpdateConfirmOpen(true);
        } else {
            createTicket.mutate(data, {
                onSuccess: () => {
                    setIsModalOpen(false);
                },
            });
        }
    };

    const handleConfirmUpdate = () => {
        if (editingTicket && pendingUpdateData) {
            updateTicket.mutate(
                { id: editingTicket.id, ...pendingUpdateData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        setEditingTicket(null);
                        setIsUpdateConfirmOpen(false);
                        setPendingUpdateData(null);
                    },
                }
            );
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
                                                confirmDelete(ticket.id);
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
                            <div onClick={(e) => e.stopPropagation()}>
                                <AssigneeSelector
                                    ticketId={selectedTicket.id}
                                    currentAssigneeId={selectedTicket.assigneeId}
                                />
                            </div>
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
                                <AssigneeSelector
                                    ticketId={selectedTicket.id}
                                    currentAssigneeId={selectedTicket.assigneeId}
                                />
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

            <ConfirmationModal
                isOpen={isUpdateConfirmOpen}
                onClose={() => setIsUpdateConfirmOpen(false)}
                onConfirm={handleConfirmUpdate}
                title={`Update ${TERMINOLOGY.ITEM}`}
                message={`Are you sure you want to update this ${TERMINOLOGY.item}?`}
                confirmLabel="Update"
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title={`Delete ${TERMINOLOGY.ITEM}`}
                message={`Are you sure you want to delete this ${TERMINOLOGY.item}?\nThis action cannot be undone.`}
                confirmLabel="Delete"
                isDanger
            />
        </div>
    );
};

export default TicketsPage;
