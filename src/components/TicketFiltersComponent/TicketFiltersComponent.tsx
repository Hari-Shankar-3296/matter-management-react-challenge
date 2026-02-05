import { useState, useEffect } from 'react';
import { TicketFilters } from '@/types';
import { useSearchParams } from 'react-router-dom';
import { TERMINOLOGY } from '@/constants';

interface TicketFiltersComponentProps {
    onFilterChange: (filters: TicketFilters) => void;
    initialFilters?: TicketFilters;
}

const TicketFiltersComponent = ({ onFilterChange, initialFilters }: TicketFiltersComponentProps) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || initialFilters?.search || '');

    // Current filter values from URL
    const status = searchParams.get('status') || initialFilters?.status || '';
    const priority = searchParams.get('priority') || '';
    const sortBy = (searchParams.get('sortBy') || initialFilters?.sortBy || 'date') as 'date' | 'title' | 'priority' | 'dueDate';
    const dueThisWeek = searchParams.get('dueThisWeek') === 'true';

    // Handle search debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            const newParams = new URLSearchParams(searchParams);
            if (searchTerm) {
                newParams.set('search', searchTerm);
            } else {
                newParams.delete('search');
            }
            setSearchParams(newParams);

            // Notify parent
            onFilterChange({
                search: searchTerm,
                status,
                priority,
                sortBy,
                dueThisWeek,
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, status, priority, sortBy, dueThisWeek, setSearchParams, onFilterChange, searchParams]);

    const updateFilters = (key: string, value: string | boolean) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value.toString());
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);

        // Notify parent immediately for non-search filters
        onFilterChange({
            search: searchTerm,
            status: key === 'status' ? (value as string) : status,
            priority: key === 'priority' ? (value as string) : priority,
            sortBy: (key === 'sortBy' ? (value as string) : sortBy) as 'date' | 'title' | 'priority' | 'dueDate',
            dueThisWeek: key === 'dueThisWeek' ? (value as boolean) : dueThisWeek,
        });
    };

    return (
        <div className="ticket-filters">
            <input
                type="text"
                placeholder={`Search ${TERMINOLOGY.items}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            <div className="filter-checkbox">
                <input
                    type="checkbox"
                    id="dueThisWeek"
                    checked={dueThisWeek}
                    onChange={(e) => updateFilters('dueThisWeek', e.target.checked)}
                />
                <label htmlFor="dueThisWeek" style={{ marginLeft: '10px' }}>Due this week</label>
            </div>
        </div>
    );
};

export default TicketFiltersComponent;
