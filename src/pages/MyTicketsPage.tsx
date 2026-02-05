import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMyTickets, useUpdateTicket, useDeleteTicket } from '../hooks/useTickets';
import { useUsers } from '../hooks/useUsers';
import { Ticket, TicketStatus, TicketPriority } from '../types';
import Modal from '../components/Modal';
import TicketForm from '../components/TicketForm';
import { formatDate, isDueThisWeek, isOverdue } from '../utils/dateUtils';
import { TERMINOLOGY } from '../constants';

const MyTicketsPage = () => {
    useAuth(); // Used for auth check
    const { data: myTickets, isLoading } = useMyTickets();
    const { data: users } = useUsers();
    const updateTicket = useUpdateTicket();
    const deleteTicket = useDeleteTicket();

    const [activeTab, setActiveTab] = useState<'assigned' | 'reported'>('assigned');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

    const getUserName = (userId: string | undefined) => {
        if (!userId) return 'Unassigned';
        const u = users?.find((u) => u.id === userId);
        return u ? `${u.firstName} ${u.lastName}` : 'Unknown';
    };

    const handleEdit = (ticket: Ticket) => {
        setEditingTicket(ticket);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm(`Are you sure you want to delete this ${TERMINOLOGY.item}?`)) {
            deleteTicket.mutate(id);
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
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTicket(null);
    };

    if (isLoading) {
        return <div className="loading">Loading your {TERMINOLOGY.items}...</div>;
    }

    const tickets = activeTab === 'assigned' ? myTickets?.assigned : myTickets?.reported;

    return (
        <div className="my-tickets-page">
            <div className="page-header">
                <h1>My {TERMINOLOGY.ITEMS}</h1>
            </div>

            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'assigned' ? 'active' : ''}`}
                    onClick={() => setActiveTab('assigned')}
                >
                    Assigned to Me ({myTickets?.assigned.length || 0})
                </button>
                <button
                    className={`tab ${activeTab === 'reported' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reported')}
                >
                    Reported by Me ({myTickets?.reported.length || 0})
                </button>
            </div>

            <div className="tickets-table-container">
                {tickets && tickets.length > 0 ? (
                    <table className="tickets-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>{activeTab === 'assigned' ? 'Reporter' : 'Assignee'}</th>
                                <th>Due Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td className="ticket-id-cell">#{ticket.id}</td>
                                    <td className="ticket-title-cell">
                                        {ticket.title}
                                        {isDueThisWeek(ticket.dueDate) && !isOverdue(ticket.dueDate) && (
                                            <span className="due-badge due-this-week">Due this week</span>
                                        )}
                                        {isOverdue(ticket.dueDate) && (
                                            <span className="due-badge overdue">Overdue</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`status-badge badge-${ticket.status}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`priority-badge priority-${ticket.priority}`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td>
                                        {getUserName(
                                            activeTab === 'assigned' ? ticket.reporterId : ticket.assigneeId
                                        )}
                                    </td>
                                    <td>{ticket.dueDate ? formatDate(ticket.dueDate) : '-'}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="action-btn" onClick={() => handleEdit(ticket)}>
                                                ✏️
                                            </button>
                                            <button
                                                className="action-btn delete"
                                                onClick={() => handleDelete(ticket.id)}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        <p>No {TERMINOLOGY.items} found</p>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={`Edit ${TERMINOLOGY.ITEM}`}
            >
                <TicketForm
                    ticket={editingTicket}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                    isLoading={updateTicket.isPending}
                />
            </Modal>
        </div>
    );
};

export default MyTicketsPage;
