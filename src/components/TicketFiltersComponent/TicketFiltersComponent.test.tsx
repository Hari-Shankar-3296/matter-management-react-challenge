
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TicketFiltersComponent from './TicketFiltersComponent';

describe('TicketFiltersComponent', () => {
    const mockOnFilterChange = vi.fn();

    const renderFilters = (initialFilters = {}) => {
        return render(
            <BrowserRouter>
                <TicketFiltersComponent onFilterChange={mockOnFilterChange} initialFilters={initialFilters} />
            </BrowserRouter>
        );
    };

    it('renders search input and dropdowns', () => {
        const { asFragment } = renderFilters();
        expect(screen.getByPlaceholderText(/Search/i)).toBeDefined();
        expect(screen.getByDisplayValue('All Status')).toBeDefined();
        expect(screen.getByDisplayValue('All Priority')).toBeDefined();
        expect(screen.getByDisplayValue('Sort by Date')).toBeDefined();
        expect(asFragment()).toMatchSnapshot();
    });

    it('calls onFilterChange when search input changes', () => {
        renderFilters();
        const searchInput = screen.getByPlaceholderText(/Search/i);
        fireEvent.change(searchInput, { target: { value: 'bug' } });
        expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({ search: 'bug' }));
    });

    it('calls onFilterChange when status dropdown changes', () => {
        renderFilters();
        const statusSelect = screen.getByDisplayValue('All Status');
        fireEvent.change(statusSelect, { target: { value: 'open' } });
        expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({ status: 'open' }));
    });
});
