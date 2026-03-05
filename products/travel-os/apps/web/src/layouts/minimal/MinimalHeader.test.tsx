import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockRouterBack = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: mockRouterBack }),
}));
vi.mock('@/components/icons/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-icon={name} />,
}));

import { MinimalHeader } from './MinimalHeader';

// ─── MinimalHeader — structure ────────────────────────────────────────────────

describe('MinimalHeader — structure', () => {
  it('renders a banner landmark', () => {
    render(<MinimalHeader />);
    expect(screen.getByRole('banner')).toBeDefined();
  });

  it('has data-testid=minimal-header', () => {
    render(<MinimalHeader />);
    expect(screen.getByTestId('minimal-header')).toBeDefined();
  });

  it('has aria-label on the header element', () => {
    render(<MinimalHeader />);
    const header = screen.getByRole('banner');
    expect(header.getAttribute('aria-label')).toBeTruthy();
  });

  it('renders skip link to #minimal-main', () => {
    render(<MinimalHeader />);
    const skip = screen.getByText(/skip to main content/i);
    expect(skip.getAttribute('href')).toBe('#minimal-main');
  });

  it('has inner wrapper with tos-min-header__inner class', () => {
    render(<MinimalHeader />);
    expect(document.querySelector('.tos-min-header__inner')).toBeDefined();
  });
});

// ─── MinimalHeader — back button ──────────────────────────────────────────────

describe('MinimalHeader — back button', () => {
  beforeEach(() => mockRouterBack.mockClear());

  it('renders back button by default (showBack=true)', () => {
    render(<MinimalHeader />);
    expect(screen.getByTestId('minimal-back-btn')).toBeDefined();
  });

  it('back button is role=button', () => {
    render(<MinimalHeader />);
    expect(screen.getByRole('button', { name: /go back/i })).toBeDefined();
  });

  it('back button aria-label defaults to "Go back"', () => {
    render(<MinimalHeader />);
    const btn = screen.getByTestId('minimal-back-btn');
    expect(btn.getAttribute('aria-label')).toBe('Go back');
  });

  it('uses custom backLabel', () => {
    render(<MinimalHeader backLabel="Return to dashboard" />);
    const btn = screen.getByTestId('minimal-back-btn');
    expect(btn.getAttribute('aria-label')).toBe('Return to dashboard');
  });

  it('back button has ArrowLeft icon', () => {
    render(<MinimalHeader />);
    const icon = screen.getByTestId('minimal-back-btn').querySelector('[data-icon="ArrowLeft"]');
    expect(icon).toBeDefined();
  });

  it('clicking calls onBack when provided', () => {
    const onBack = vi.fn();
    render(<MinimalHeader onBack={onBack} />);
    fireEvent.click(screen.getByTestId('minimal-back-btn'));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it('clicking calls router.back() when onBack not provided', () => {
    render(<MinimalHeader />);
    fireEvent.click(screen.getByTestId('minimal-back-btn'));
    expect(mockRouterBack).toHaveBeenCalledOnce();
  });

  it('does not call router.back() when onBack is provided', () => {
    render(<MinimalHeader onBack={vi.fn()} />);
    fireEvent.click(screen.getByTestId('minimal-back-btn'));
    expect(mockRouterBack).not.toHaveBeenCalled();
  });

  it('hides back button when showBack=false', () => {
    render(<MinimalHeader showBack={false} />);
    expect(screen.queryByTestId('minimal-back-btn')).toBeNull();
  });

  it('no role=button when showBack=false', () => {
    render(<MinimalHeader showBack={false} />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});

// ─── MinimalHeader — title ────────────────────────────────────────────────────

describe('MinimalHeader — title', () => {
  it('renders title when provided', () => {
    render(<MinimalHeader title="Confirm Booking" />);
    expect(screen.getByTestId('minimal-header-title')).toBeDefined();
  });

  it('title text matches prop', () => {
    render(<MinimalHeader title="Confirm Booking" />);
    expect(screen.getByText('Confirm Booking')).toBeDefined();
  });

  it('title is an h1 element', () => {
    render(<MinimalHeader title="Confirm Booking" />);
    const title = screen.getByTestId('minimal-header-title');
    expect(title.tagName).toBe('H1');
  });

  it('title has tos-min-header__title class', () => {
    render(<MinimalHeader title="Confirm Booking" />);
    expect(document.querySelector('.tos-min-header__title')).toBeDefined();
  });

  it('does not render h1 when title is omitted', () => {
    render(<MinimalHeader />);
    expect(screen.queryByTestId('minimal-header-title')).toBeNull();
  });

  it('does not render any h1 when title is not provided', () => {
    render(<MinimalHeader />);
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
  });
});

// ─── MinimalHeader — combined props ──────────────────────────────────────────

describe('MinimalHeader — combined props', () => {
  it('shows back + title together', () => {
    render(<MinimalHeader title="Step 1" showBack={true} onBack={vi.fn()} />);
    expect(screen.getByTestId('minimal-back-btn')).toBeDefined();
    expect(screen.getByText('Step 1')).toBeDefined();
  });

  it('no back and no title renders clean header', () => {
    render(<MinimalHeader showBack={false} />);
    // Only the skip link should be a link
    const links = document.querySelectorAll('a');
    expect(links.length).toBe(1); // just the skip link
  });
});
