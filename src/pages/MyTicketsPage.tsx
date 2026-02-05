import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMyTickets, useUpdateTicket, useDeleteTicket } from '../hooks/useTickets';
import { Ticket, TicketStatus, TicketPriority } from '../types';
import Modal from '../components/Modal';
import ConfirmationModal from '../components/ConfirmationModal';
import TicketForm from '../components/TicketForm';
import { TERMINOLOGY } from '../constants';
import TicketTable from '../components/TicketTable';

const MyTicketsPage = () => {
    useAuth(); // Used for auth check
    const { data: myTickets, isLoading } = useMyTickets();
    const updateTicket = useUpdateTicket();
    const deleteTicket = useDeleteTicket();

    const [activeTab, setActiveTab] = useState<'assigned' | 'reported'>('assigned');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
    const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false);
    const [pendingUpdateData, setPendingUpdateData] = useState<Partial<Ticket> | null>(null);

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

            <TicketTable
                tickets={tickets}
                activeTab={activeTab}
                onEdit={handleEdit}
                onDelete={confirmDelete}
            />

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

export default MyTicketsPage;
