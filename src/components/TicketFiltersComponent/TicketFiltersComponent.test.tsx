import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TicketFiltersComponent from './TicketFiltersComponent';

describe('TicketFiltersComponent', () => {
  const mockOnFilterChange = vi.fn();

  const renderFilters = (initialFilters = {}) => {
    return render(
      <BrowserRouter>
        <TicketFiltersComponent
          onFilterChange={mockOnFilterChange}
          initialFilters={initialFilters}
        />
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

  it('calls onFilterChange when search input changes (debounced)', () => {
    vi.useFakeTimers();
    renderFilters();
    const searchInput = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(searchInput, { target: { value: 'bug' } });

    // Should not be called immediately due to debounce
    expect(mockOnFilterChange).not.toHaveBeenCalled();

    // Advance time by 300ms
    vi.advanceTimersByTime(300);

    expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({ search: 'bug' }));
    vi.useRealTimers();
  });

  it('calls onFilterChange when status dropdown changes', () => {
    renderFilters();
    const statusSelect = screen.getByDisplayValue('All Status');
    fireEvent.change(statusSelect, { target: { value: 'open' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({ status: 'open' }));
  });

  it('calls onFilterChange when dueThisWeek checkbox changes', () => {
    renderFilters();
    const checkbox = screen.getByLabelText(/Due this week/i);
    fireEvent.click(checkbox);
    expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({ dueThisWeek: true }));
  });
});
