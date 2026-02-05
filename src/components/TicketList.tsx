import { useMemo } from 'react';

interface Ticket {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

interface TicketListProps {
  tickets: Ticket[];
  onSelect: (id: string) => void;
  selectedId: string | null;
}

const TicketList = ({ tickets, onSelect, selectedId }: TicketListProps) => {
  // Unnecessary useMemo - this is just rendering, no expensive computation TODO: add in render logic itself
  const ticketItems = useMemo(() => {
    return tickets.map(ticket => (
      <div
        key={ticket.id}
        onClick={() => onSelect(ticket.id)}
        style={{
          padding: '12px',
          marginBottom: '8px',
          border: selectedId === ticket.id ? '2px solid blue' : '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
          backgroundColor: selectedId === ticket.id ? '#e3f2fd' : 'white',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{ticket.title}</div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          {ticket.status} • {new Date(ticket.createdAt).toLocaleDateString()}
        </div>
      </div>
    ));
  }, [tickets, onSelect, selectedId]);

  if (tickets.length === 0) {
    return <div>No tickets found</div>;
  }

  return <div>{ticketItems}</div>;
};

export default TicketList;
