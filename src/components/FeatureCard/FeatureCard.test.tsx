import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeatureCard from './FeatureCard';

describe('FeatureCard', () => {
  it('renders title and description', () => {
    const { asFragment } = render(<FeatureCard title="Fast" description="Very fast" icon="⚡" />);
    expect(screen.getByText('Fast')).toBeDefined();
    expect(screen.getByText('Very fast')).toBeDefined();
    expect(screen.getByText('⚡')).toBeDefined();
    expect(asFragment()).toMatchSnapshot();
  });
});
