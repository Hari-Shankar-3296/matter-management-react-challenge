import { useState } from 'react';

/**
 * TASK 5: Fixed - Removed Redux usage
 * 
 * This component now uses:
 * - React useState for local state
 * - React Query for server state (via parent component)
 * 
 * Redux was overkill for this simple filter state.
 */
const TicketFiltersContainer = () => {
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Ticket Filters</h1>
      <div>
        <label>
          Filter:
          <select value={filter} onChange={(e) => handleFilterChange(e.target.value)}>
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </label>
        <label style={{ marginLeft: '16px' }}>
          Sort by:
          <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
            <option value="date">Date</option>
            <option value="title">Title</option>
            <option value="priority">Priority</option>
          </select>
        </label>
        <p>Current filter: {filter}</p>
        <p>Sort by: {sortBy}</p>
      </div>
    </div>
  );
};

export default TicketFiltersContainer;
