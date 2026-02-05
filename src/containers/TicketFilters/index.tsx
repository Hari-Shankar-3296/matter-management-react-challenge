// NOTE: Redux is intentionally NOT installed to force candidates to remove it
// import { useSelector, useDispatch } from 'react-redux';
// import { setFilter } from './slice';

/**
 * TASK 5: Remove Redux usage
 * 
 * This component uses Redux for local component state that should be:
 * - React useState for local state
 * - React Query for server state
 * - URL params for shareable state (bonus)
 */
const TicketFilters = () => {
  // TODO: Remove Redux usage - Redux is not installed TODO:
  // Replace with React useState or URL params
  // @ts-ignore - Redux not installed
  const dispatch = null; // useDispatch();
  // @ts-ignore - Redux store type
  const filter = 'all'; // useSelector((state: any) => state.ticketFilters.filter);
  // @ts-ignore
  const sortBy = 'date'; // useSelector((state: any) => state.ticketFilters.sortBy);

  const handleFilterChange = (newFilter: string) => {
    // dispatch(setFilter({ filter: newFilter }));
    console.log('Filter change:', newFilter);
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
            <option value="closed">Closed</option>
          </select>
        </label>
        <p>Current filter: {filter}</p>
        <p>Sort by: {sortBy}</p>
      </div>
    </div>
  );
};

export default TicketFilters;
