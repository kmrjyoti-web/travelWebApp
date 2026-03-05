import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('./theme', () => ({
  applyPublicTheme: vi.fn(),
}));
vi.mock('./PublicHeader', () => ({
  PublicHeader: () => <header data-testid="mock-public-header" />,
}));
vi.mock('./PublicFooter', () => ({
  PublicFooter: () => <footer data-testid="mock-public-footer" />,
}));

import { PublicLayout } from './PublicLayout';
import { applyPublicTheme } from './theme';

// ─── PublicLayout — structure ─────────────────────────────────────────────────

describe('PublicLayout — structure', () => {
  it('renders wrapper with data-layout=public', () => {
    render(<PublicLayout>content</PublicLayout>);
    const wrapper = document.querySelector('[data-layout="public"]');
    expect(wrapper).toBeDefined();
  });

  it('has data-testid=public-layout', () => {
    render(<PublicLayout>content</PublicLayout>);
    expect(screen.getByTestId('public-layout')).toBeDefined();
  });

  it('wrapper has tos-pub-layout class', () => {
    render(<PublicLayout>content</PublicLayout>);
    expect(document.querySelector('.tos-pub-layout')).toBeDefined();
  });

  it('renders PublicHeader', () => {
    render(<PublicLayout>content</PublicLayout>);
    expect(screen.getByTestId('mock-public-header')).toBeDefined();
  });

  it('renders PublicFooter', () => {
    render(<PublicLayout>content</PublicLayout>);
    expect(screen.getByTestId('mock-public-footer')).toBeDefined();
  });

  it('renders main element', () => {
    render(<PublicLayout>content</PublicLayout>);
    expect(screen.getByRole('main')).toBeDefined();
  });

  it('main has id=public-main', () => {
    render(<PublicLayout>content</PublicLayout>);
    expect(document.getElementById('public-main')).toBeDefined();
  });

  it('main has aria-label for content', () => {
    render(<PublicLayout>content</PublicLayout>);
    const main = screen.getByRole('main');
    expect(main.getAttribute('aria-label')).toBeTruthy();
  });

  it('main has data-testid=public-main', () => {
    render(<PublicLayout>content</PublicLayout>);
    expect(screen.getByTestId('public-main')).toBeDefined();
  });

  it('main has tabIndex=-1 for skip-link focus', () => {
    render(<PublicLayout>content</PublicLayout>);
    const main = screen.getByRole('main');
    expect(main.getAttribute('tabindex')).toBe('-1');
  });

  it('main has tos-pub-content class', () => {
    render(<PublicLayout>content</PublicLayout>);
    expect(document.querySelector('.tos-pub-content')).toBeDefined();
  });

  it('renders children inside main', () => {
    render(<PublicLayout><span data-testid="child">hello</span></PublicLayout>);
    expect(screen.getByTestId('child')).toBeDefined();
  });

  it('does not render a sidebar (no aside element)', () => {
    render(<PublicLayout>content</PublicLayout>);
    expect(screen.queryByRole('complementary')).toBeNull();
  });
});

// ─── PublicLayout — theme ─────────────────────────────────────────────────────

describe('PublicLayout — theme', () => {
  it('calls applyPublicTheme on mount', () => {
    render(<PublicLayout>content</PublicLayout>);
    expect(applyPublicTheme).toHaveBeenCalledOnce();
  });

  it('does not call applyPublicTheme again on re-render', () => {
    const { rerender } = render(<PublicLayout>content</PublicLayout>);
    (applyPublicTheme as ReturnType<typeof vi.fn>).mockClear();
    rerender(<PublicLayout>updated</PublicLayout>);
    expect(applyPublicTheme).not.toHaveBeenCalled();
  });
});

// ─── PublicLayout — layout order ─────────────────────────────────────────────

describe('PublicLayout — layout order', () => {
  it('header appears before main in DOM', () => {
    render(<PublicLayout>content</PublicLayout>);
    const header = screen.getByTestId('mock-public-header');
    const main   = screen.getByRole('main');
    // DOCUMENT_POSITION_FOLLOWING (4) means main comes after header
    expect(header.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('main appears before footer in DOM', () => {
    render(<PublicLayout>content</PublicLayout>);
    const main   = screen.getByRole('main');
    const footer = screen.getByTestId('mock-public-footer');
    expect(main.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
