
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal Component', () => {
    const mockOnClose = vi.fn();

    it('does not render when isOpen is false', () => {
        const { container } = render(
            <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
                <div>Content</div>
            </Modal>
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders correctly when isOpen is true', () => {
        const { asFragment } = render(
            <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
                <div>Modal Content</div>
            </Modal>
        );
        expect(screen.getByText('Test Modal')).toBeDefined();
        expect(screen.getByText('Modal Content')).toBeDefined();
        expect(asFragment()).toMatchSnapshot();
    });

    it('calls onClose when close button is clicked', () => {
        render(
            <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
                <div>Content</div>
            </Modal>
        );
        fireEvent.click(screen.getByLabelText('Close modal'));
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('calls onClose when clicking the overlay', () => {
        const { container } = render(
            <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
                <div>Content</div>
            </Modal>
        );
        const overlay = container.querySelector('.modal-overlay');
        if (overlay) fireEvent.click(overlay);
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('calls onClose when Escape key is pressed', () => {
        render(
            <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
                <div>Content</div>
            </Modal>
        );
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(mockOnClose).toHaveBeenCalled();
    });
});
