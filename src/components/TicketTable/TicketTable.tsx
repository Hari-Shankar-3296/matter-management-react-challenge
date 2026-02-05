import { Ticket } from '@/types';
import TicketTableRow from '@/components/TicketTableRow/TicketTableRow';
import { TERMINOLOGY } from '@/constants';

interface TicketTableProps {
    tickets: Ticket[] | undefined;
    activeTab: 'assigned' | 'reported';
    onEdit: (ticket: Ticket) => void;
    onDelete: (id: string) => void;
}

const TicketTable = ({ tickets, activeTab, onEdit, onDelete }: TicketTableProps) => {
    if (!tickets || tickets.length === 0) {
        return (
            <div className="empty-state">
                <p>No {TERMINOLOGY.items} found</p>
            </div>
        );
    }

    return (
        <div className="tickets-table-container">
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
                        <TicketTableRow
                            key={ticket.id}
                            ticket={ticket}
                            activeTab={activeTab}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TicketTable;
