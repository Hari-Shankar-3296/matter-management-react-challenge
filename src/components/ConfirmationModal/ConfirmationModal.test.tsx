import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmationModal from './ConfirmationModal';

describe('ConfirmationModal', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  it('renders all labels and messages correctly', () => {
    const { asFragment } = render(
      <ConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Delete Matter"
        message="Are you sure you want to delete this matter?"
        confirmLabel="Yes, Delete"
      />
    );

    expect(screen.getByText('Delete Matter')).toBeDefined();
    expect(screen.getByText('Are you sure you want to delete this matter?')).toBeDefined();
    expect(screen.getByText('Yes, Delete')).toBeDefined();
    expect(asFragment()).toMatchSnapshot();
  });

  it('calls onConfirm and onClose when confirm button is clicked', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Title"
        message="Message"
      />
    );

    fireEvent.click(screen.getByText('Confirm'));
    expect(mockOnConfirm).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Title"
        message="Message"
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
