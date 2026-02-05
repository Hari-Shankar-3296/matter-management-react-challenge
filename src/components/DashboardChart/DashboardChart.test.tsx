import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardChart from './DashboardChart';

// Mock ResponsiveContainer and other Recharts components to avoid issues in JSDOM
vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: any) => (
      <div style={{ width: 800, height: 400 }}>{children}</div>
    ),
  };
});

describe('DashboardChart', () => {
  const mockData = [
    { name: 'Open', value: 5, color: '#ff0000' },
    { name: 'Closed', value: 3, color: '#00ff00' },
  ];

  it('renders pie chart with title', () => {
    const { asFragment } = render(
      <DashboardChart title="Status Distribution" data={mockData} type="pie" />
    );
    expect(screen.getByText('Status Distribution')).toBeDefined();
    // Recharts might be hard to test for content in JSDOM, but we can check if it renders
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders bar chart with title', () => {
    const { asFragment } = render(
      <DashboardChart title="Priority Summary" data={mockData} type="bar" />
    );
    expect(screen.getByText('Priority Summary')).toBeDefined();
    expect(asFragment()).toMatchSnapshot();
  });
});
