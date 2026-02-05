
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TeamMemberItem from './TeamMemberItem';

describe('TeamMemberItem', () => {
    const mockMember = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
    } as any;

    it('renders member name and initials', () => {
        const { asFragment } = render(<TeamMemberItem member={mockMember} />);
        expect(screen.getByText('John Doe')).toBeDefined();
        expect(screen.getByText('john@example.com')).toBeDefined();
        expect(screen.getByText('JD')).toBeDefined();
        expect(asFragment()).toMatchSnapshot();
    });
});
