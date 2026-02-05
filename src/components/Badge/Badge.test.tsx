
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from './Badge';

describe('Badge Component', () => {
    it('renders the value correctly', () => {
        const { asFragment } = render(<Badge type="status" value="Open" />);
        expect(screen.getByText('Open')).toBeDefined();
        expect(asFragment()).toMatchSnapshot();
    });

    it('applies correct status classes', () => {
        const { container } = render(<Badge type="status" value="In Progress" />);
        const span = container.querySelector('span');
        expect(span?.className).toContain('status-badge');
        expect(span?.className).toContain('badge-in-progress');
    });

    it('applies correct priority classes', () => {
        const { container } = render(<Badge type="priority" value="High" />);
        const span = container.querySelector('span');
        expect(span?.className).toContain('priority-badge');
        expect(span?.className).toContain('priority-high');
    });

    it('applies correct due classes', () => {
        const { container } = render(<Badge type="due" value="Overdue" />);
        const span = container.querySelector('span');
        expect(span?.className).toContain('due-badge');
        expect(span?.className).toContain('overdue');
    });

    it('applies custom className and style', () => {
        const { container } = render(
            <Badge type="status" value="Open" className="custom-class" style={{ color: 'red' }} />
        );
        const span = container.querySelector('span');
        expect(span?.className).toContain('custom-class');
        expect(span?.style.color).toBe('red');
    });
});
