import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from './StatCard';

describe('StatCard Component', () => {
  it('renders label and value correctly', () => {
    const { asFragment } = render(<StatCard label="Total Tickets" value={42} />);
    expect(screen.getByText('Total Tickets')).toBeDefined();
    expect(screen.getByText('42')).toBeDefined();
    expect(asFragment()).toMatchSnapshot();
  });

  it('handles string values', () => {
    render(<StatCard label="Status" value="Active" />);
    expect(screen.getByText('Active')).toBeDefined();
  });
});
