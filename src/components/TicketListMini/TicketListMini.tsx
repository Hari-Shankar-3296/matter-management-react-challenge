import { Link } from 'react-router-dom';
import { Ticket } from '@/types';
import { TERMINOLOGY } from '@/constants';

interface TicketListMiniProps {
  tickets: Ticket[] | undefined;
  title: string;
  viewAllLink?: string;
}

const TicketListMini = ({ tickets, title, viewAllLink }: TicketListMiniProps) => {
  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h3>{title}</h3>
        {viewAllLink && (
          <Link to={viewAllLink} className="link">
            View All →
          </Link>
        )}
      </div>
      <div className="ticket-list-mini">
        {tickets && tickets.length > 0 ? (
          tickets.slice(0, 5).map((ticket) => (
            <div key={ticket.id} className="ticket-item-mini">
              <div className="ticket-info">
                <span className="ticket-id">#{ticket.id}</span>
                <span className="ticket-title">{ticket.title}</span>
              </div>
              <span className={`priority-badge priority-${ticket.priority}`}>
                {ticket.priority}
              </span>
            </div>
          ))
        ) : (
          <div className="empty-mini">No {TERMINOLOGY.items.toLowerCase()} found</div>
        )}
      </div>
    </div>
  );
};

export default TicketListMini;
