import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTickets, useUpdateTicket, useDeleteTicket, useCreateTicket } from '@/hooks/useTickets/useTickets';
import { useUsers } from '@/hooks/useUsers/useUsers';
import { Ticket, TicketStatus, TicketFilters, TicketPriority } from '@/types';
import TicketFiltersComponent from '@/components/TicketFiltersComponent/TicketFiltersComponent';
import Modal from '@/components/Modal/Modal';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
import TicketForm from '@/components/TicketForm/TicketForm';
import { TERMINOLOGY } from '@/constants';
import TicketList from '@/components/TicketList/TicketList';
import TicketDetail from '@/components/TicketDetail/TicketDetail';

const TicketsPage = () => {
    const [searchParams] = useSearchParams();
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
    const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false);
    const [pendingUpdateData, setPendingUpdateData] = useState<Partial<Ticket> | null>(null);

    // Derived filters from URL (Source of Truth)
    const filters: TicketFilters = {
        search: searchParams.get('search') || undefined,
        status: (searchParams.get('status') as TicketStatus) || undefined,
        priority: (searchParams.get('priority') as TicketPriority) || undefined,
        sortBy: (searchParams.get('sortBy') as 'date' | 'title' | 'priority' | 'dueDate') || 'date',
        dueThisWeek: searchParams.get('dueThisWeek') === 'true',
    };

    const { data: tickets, isLoading, error } = useTickets(filters);
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

    const handleFilterChange = useCallback(() => {
        // No local state update needed, URL params drive the hook
    }, []);

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

                {isLoading ? (
                    <div className="loading">Loading {TERMINOLOGY.items}...</div>
                ) : error ? (
                    <div className="error-message">Error loading {TERMINOLOGY.items}</div>
                ) : (
                    <TicketList
                        tickets={tickets || []}
                        selectedId={selectedTicketId}
                        onSelect={(ticket) => setSelectedTicketId(ticket.id)}
                        onEdit={handleEdit}
                        onDelete={confirmDelete}
                    />
                )}
            </div>

            <div className="ticket-detail-section">
                <TicketDetail ticket={selectedTicket} getUserName={getUserName} />
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
