import { TicketStatus } from '../types';

interface TicketCardProps {
  ticket: {
    id: string;
    title: string;
    status: TicketStatus | 'open' | 'closed';
    read?: boolean;
  };
  isSelected: boolean;
  onClick: () => void;
}

const TicketCard = ({ ticket, isSelected, onClick }: TicketCardProps) => {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px 16px',
        margin: '8px 0',
        border: `2px solid ${isSelected ? 'var(--primary-500)' : 'var(--border-color)'}`,
        borderRadius: '8px',
        cursor: 'pointer',
        background: isSelected ? 'var(--bg-hover)' : 'var(--bg-card)',
        transition: 'all 0.15s ease',
      }}
    >
      <h4 style={{ margin: 0, marginBottom: '4px', fontSize: '0.95rem' }}>{ticket.title}</h4>
      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Status: <span style={{ textTransform: 'capitalize' }}>{ticket.status}</span>
      </p>
    </div>
  );
};

export default TicketCard;
