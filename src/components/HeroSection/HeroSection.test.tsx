import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HeroSection from './HeroSection';

describe('HeroSection', () => {
  it('renders hero content for unauthenticated user', () => {
    const { asFragment } = render(
      <BrowserRouter>
        <HeroSection user={null} isAuthenticated={false} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Welcome to/i)).toBeDefined();
    expect(screen.getByText(/Sign In/i)).toBeDefined();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders hero content for authenticated user', () => {
    const mockUser = { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
    const { asFragment } = render(
      <BrowserRouter>
        <HeroSection user={mockUser} isAuthenticated={true} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Welcome back,/i)).toBeDefined();
    expect(screen.getByText(/John/i)).toBeDefined();
    expect(screen.getByText(/View All/i)).toBeDefined();
    expect(asFragment()).toMatchSnapshot();
  });
});
