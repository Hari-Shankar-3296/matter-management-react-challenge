import { useState } from 'react';
import { useTicketList } from '../../hooks/useTicketList';
import TicketCard from '../../components/TicketCard';

/**
 * TASK 2: Fixed - Removed circular dependency useEffects
 * 
 * Changes made:
 * 1. Removed Effect 2 (manual refetch) - React Query auto-refetches when query key changes
 * 2. Removed Effect 3 & 4 (circular deps) - Notification count is now derived, not state
 * 3. Removed Effect 5 (success logging) - Use React Query's onSuccess callback if needed
 * 4. Kept Effect 1 simplified - notification count is now a derived value
 */
const TicketList = () => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // React Query auto-refetches when the query key (including filterStatus) changes
  const { data: tickets, isLoading } = useTicketList({
    status: filterStatus === 'all' ? undefined : filterStatus,
  });

  // Derived state instead of useEffect + useState
  // This is recalculated on every render when tickets change
  const notificationCount = tickets?.filter((t) => !t.read).length ?? 0;

  if (isLoading) {
    return <div>Loading tickets...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Ticket List</h1>
      <div>
        <label>
          Filter:
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </label>
        <p>Notifications: {notificationCount}</p>
      </div>
      <div>
        {tickets?.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            isSelected={selectedTicketId === ticket.id}
            onClick={() => setSelectedTicketId(ticket.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TicketList;
