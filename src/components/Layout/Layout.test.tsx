
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';

vi.mock('@/components/Header/Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

describe('Layout', () => {
    it('renders header and outlet content', () => {
        const { asFragment } = render(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<div data-testid="content">Page Content</div>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        );
        expect(screen.getByTestId('header')).toBeDefined();
        expect(screen.getByTestId('content')).toBeDefined();
        expect(asFragment()).toMatchSnapshot();
    });
});
