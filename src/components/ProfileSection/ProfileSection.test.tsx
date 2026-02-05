import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProfileSection from './ProfileSection';

describe('ProfileSection', () => {
  it('renders title and children correctly', () => {
    const { asFragment } = render(
      <ProfileSection title="Test Title">
        <div data-testid="child">Test Content</div>
      </ProfileSection>
    );
    expect(screen.getByText('Test Title')).toBeDefined();
    expect(screen.getByTestId('child')).toBeDefined();
    expect(asFragment()).toMatchSnapshot();
  });
});
