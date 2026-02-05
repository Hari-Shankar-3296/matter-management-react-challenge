interface TicketCardProps {
  ticket: {
    id: string;
    title: string;
    status: 'open' | 'closed';
  };
  isSelected: boolean;
  onClick: () => void;
}

const TicketCard = ({ ticket, isSelected, onClick }: TicketCardProps) => {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '10px',
        margin: '10px 0',
        border: `2px solid ${isSelected ? 'blue' : 'gray'}`,
        cursor: 'pointer',
      }}
    >
      <h3>{ticket.title}</h3>
      <p>Status: {ticket.status}</p>
    </div>
  );
};

export default TicketCard;
