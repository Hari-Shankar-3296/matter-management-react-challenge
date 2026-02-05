import { Ticket } from '../types';
import TicketCard from './TicketCard';
import { TERMINOLOGY } from '../constants';

interface TicketListProps {
  tickets: Ticket[];
  selectedId: string | null;
  onSelect: (ticket: Ticket) => void;
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
}

const TicketList = ({ tickets, selectedId, onSelect, onEdit, onDelete }: TicketListProps) => {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="empty-state">No {TERMINOLOGY.items} found</div>
    );
  }

  return (
    <div className="ticket-list" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          isSelected={selectedId === ticket.id}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TicketList;
