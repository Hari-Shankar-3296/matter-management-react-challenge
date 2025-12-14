import { useEffect, useState } from 'react';
import { useTicketList } from './hooks/useTicketList';
import TicketCard from './components/TicketCard';

/**
 * TASK 2: This component has problematic useEffect usage
 * 
 * Issues to fix:
 * 1. Circular dependencies between useEffects
 * 2. Side effects that should use React Query callbacks
 * 3. Unnecessary useEffect for derived state
 */
const TicketList = () => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [notificationCount, setNotificationCount] = useState(0);

  const { data: tickets, isLoading, refetch } = useTicketList({
    status: filterStatus === 'all' ? undefined : filterStatus,
  });

  // Effect 1: Update notification count when tickets change
  useEffect(() => {
    if (tickets) {
      const unreadCount = tickets.filter((t) => !t.read).length;
      setNotificationCount(unreadCount);
    }
  }, [tickets]);

  // Effect 2: Refetch when filter changes
  useEffect(() => {
    refetch();
  }, [filterStatus, refetch]);

  // Effect 3: Log selected ticket (creates circular dependency with Effect 4)
  useEffect(() => {
    if (selectedTicketId) {
      console.log('Selected ticket:', selectedTicketId);
      // This triggers Effect 4
      setNotificationCount((prev) => prev + 1);
    }
  }, [selectedTicketId]);

  // Effect 4: Update selection when notification count changes (circular!)
  useEffect(() => {
    if (notificationCount > 5 && !selectedTicketId) {
      // Auto-select first ticket
      if (tickets && tickets.length > 0) {
        setSelectedTicketId(tickets[0].id);
      }
    }
  }, [notificationCount, selectedTicketId, tickets]);

  // Effect 5: Show success message after refetch (should use React Query callback)
  useEffect(() => {
    if (tickets && tickets.length > 0) {
      console.log('Tickets loaded successfully!');
    }
  }, [tickets]);

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
