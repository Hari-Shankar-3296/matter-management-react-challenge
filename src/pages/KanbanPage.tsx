import { useState } from 'react';
import { Ticket, TicketStatus } from '../types';
import { useTickets, useUpdateTicket, useDeleteTicket, useCreateTicket } from '../hooks/useTickets';
import KanbanColumn from '../components/KanbanColumn';
import Modal from '../components/Modal';
import TicketForm from '../components/TicketForm';
import { TERMINOLOGY } from '../constants';

const KanbanPage = () => {
    const { data: tickets, isLoading } = useTickets();
    const updateTicket = useUpdateTicket();
    const deleteTicket = useDeleteTicket();
    const createTicket = useCreateTicket();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

    const columns: { status: TicketStatus; title: string }[] = [
        { status: 'open', title: 'Open' },
        { status: 'in-progress', title: 'In Progress' },
        { status: 'closed', title: 'Closed' },
    ];

    const handleDrop = (ticketId: string, newStatus: TicketStatus) => {
        const ticket = tickets?.find((t) => t.id === ticketId);
        if (ticket && ticket.status !== newStatus) {
            updateTicket.mutate({ id: ticketId, status: newStatus });
        }
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

    const handleAddNew = () => {
        setEditingTicket(null);
        setIsModalOpen(true);
    };

    const handleFormSubmit = (data: { title: string; description: string; status: TicketStatus }) => {
        if (editingTicket) {
            updateTicket.mutate({ id: editingTicket.id, ...data }, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setEditingTicket(null);
                },
            });
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
        <div className="kanban-page">
            <div className="page-header">
                <h1>Kanban Board</h1>
                <button className="btn btn-primary" onClick={handleAddNew}>
                    + Add {TERMINOLOGY.ITEM}
                </button>
            </div>

            <div className="kanban-board">
                {columns.map((column) => (
                    <KanbanColumn
                        key={column.status}
                        status={column.status}
                        title={column.title}
                        tickets={tickets?.filter((t) => t.status === column.status) || []}
                        onDrop={handleDrop}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
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

export default KanbanPage;
