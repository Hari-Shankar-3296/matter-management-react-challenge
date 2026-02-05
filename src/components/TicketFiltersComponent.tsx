
import { TicketFilters } from '../types';
import { useSearchParams } from 'react-router-dom';
import { TERMINOLOGY } from '../constants';

/**
 * Ticket Filters Component
 * 
 * TASK 5: Fixed - Removed Redux usage.
 * Now uses React useState for local state and URL params for shareable state.
 */
interface TicketFiltersComponentProps {
    onFilterChange: (filters: TicketFilters) => void;
    initialFilters?: TicketFilters;
}

const TicketFiltersComponent = ({ onFilterChange, initialFilters }: TicketFiltersComponentProps) => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Use URL params as source of truth (makes filters shareable)
    const search = searchParams.get('search') || initialFilters?.search || '';
    const status = searchParams.get('status') || initialFilters?.status || '';
    const priority = searchParams.get('priority') || '';
    const sortBy = (searchParams.get('sortBy') || initialFilters?.sortBy || 'date') as 'date' | 'title' | 'priority' | 'dueDate';

    const updateFilters = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);

        // Notify parent
        onFilterChange({
            search: key === 'search' ? value : search,
            status: key === 'status' ? value : status,
            priority: key === 'priority' ? value : priority,
            sortBy: (key === 'sortBy' ? value : sortBy) as 'date' | 'title' | 'priority' | 'dueDate',
        });
    };

    return (
        <div className="ticket-filters">
            <input
                type="text"
                placeholder={`Search ${TERMINOLOGY.items}...`}
                value={search}
                onChange={(e) => updateFilters('search', e.target.value)}
            />
            <select
                value={status}
                onChange={(e) => updateFilters('status', e.target.value)}
            >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
            </select>
            <select
                value={priority}
                onChange={(e) => updateFilters('priority', e.target.value)}
            >
                <option value="">All Priority</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            </select>
            <select
                value={sortBy}
                onChange={(e) => updateFilters('sortBy', e.target.value)}
            >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="priority">Sort by Priority</option>
                <option value="dueDate">Sort by Due Date</option>
            </select>
        </div>
    );
};

export default TicketFiltersComponent;
