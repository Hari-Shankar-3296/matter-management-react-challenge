import { useState } from 'react';
import { Ticket, TicketStatus } from '../types';
import { useTickets, useUpdateTicket, useDeleteTicket, useCreateTicket } from '../hooks/useTickets';
import KanbanColumn from '../components/KanbanColumn';
import Modal from '../components/Modal';
import ConfirmationModal from '../components/ConfirmationModal';
import TicketForm from '../components/TicketForm';
import { TERMINOLOGY } from '../constants';

const KanbanPage = () => {
    const { data: tickets, isLoading } = useTickets();
    const updateTicket = useUpdateTicket();
    const deleteTicket = useDeleteTicket();
    const createTicket = useCreateTicket();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
    const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false);
    const [pendingUpdateData, setPendingUpdateData] = useState<any>(null);

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

    const confirmDelete = (id: string) => {
        setTicketToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (ticketToDelete) {
            deleteTicket.mutate(ticketToDelete);
            setTicketToDelete(null);
        }
    };

    const handleAddNew = () => {
        setEditingTicket(null);
        setIsModalOpen(true);
    };

    const handleFormSubmit = (data: { title: string; description: string; status: TicketStatus }) => {
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
            updateTicket.mutate({ id: editingTicket.id, ...pendingUpdateData }, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setEditingTicket(null);
                    setIsUpdateConfirmOpen(false);
                    setPendingUpdateData(null);
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
                        onDelete={confirmDelete}
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

export default KanbanPage;
