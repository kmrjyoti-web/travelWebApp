import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
    'aria-label': ariaLabel,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    'aria-label'?: string;
  }) => (
    <a href={href} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

vi.mock('@/config/constants', () => ({
  APP_NAME: 'TravelOS',
  APP_VERSION: '1.0.0',
}));

import { AuthHeader } from './AuthHeader';

// ─── Structure ────────────────────────────────────────────────────────────────

describe('AuthHeader — structure', () => {
  it('renders a <header> with role=banner', () => {
    render(<AuthHeader />);
    expect(screen.getByRole('banner')).toBeDefined();
  });

  it('header has a descriptive aria-label', () => {
    render(<AuthHeader />);
    const header = screen.getByRole('banner');
    expect(header.getAttribute('aria-label')).toBeTruthy();
    expect(header.getAttribute('aria-label')).toMatch(/auth/i);
  });
});

// ─── Skip link ────────────────────────────────────────────────────────────────

describe('AuthHeader — skip link', () => {
  it('renders a skip-to-form link', () => {
    render(<AuthHeader />);
    const skip = screen.getByText(/skip to form/i);
    expect(skip).toBeDefined();
  });

  it('skip link targets #auth-main', () => {
    render(<AuthHeader />);
    const skip = screen.getByText(/skip to form/i);
    expect(skip.getAttribute('href')).toBe('#auth-main');
  });
});

// ─── Logo / brand ─────────────────────────────────────────────────────────────

describe('AuthHeader — brand', () => {
  it('renders the app name', () => {
    render(<AuthHeader />);
    expect(screen.getByText('TravelOS')).toBeDefined();
  });

  it('brand is a link to /', () => {
    render(<AuthHeader />);
    const link = screen.getByRole('link', { name: /TravelOS/i });
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('/');
  });

  it('brand link has descriptive aria-label', () => {
    render(<AuthHeader />);
    const link = screen.getByRole('link', { name: /return to home/i });
    expect(link).toBeDefined();
  });

  it('renders a logo SVG (decorative)', () => {
    render(<AuthHeader />);
    // SVG should be aria-hidden since it's decorative
    const svgs = document.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
    for (const svg of Array.from(svgs)) {
      if (svg.closest('.tos-auth-header__logo-mark')) {
        expect(svg.getAttribute('aria-hidden')).toBeTruthy();
      }
    }
  });
});

// ─── Minimal — no navigation ──────────────────────────────────────────────────

describe('AuthHeader — minimal (no nav)', () => {
  it('does not render a navigation landmark', () => {
    render(<AuthHeader />);
    expect(screen.queryByRole('navigation')).toBeNull();
  });

  it('does not render search elements', () => {
    render(<AuthHeader />);
    expect(screen.queryByRole('searchbox')).toBeNull();
    expect(screen.queryByRole('button', { name: /search/i })).toBeNull();
  });

  it('does not render notification elements', () => {
    render(<AuthHeader />);
    expect(screen.queryByRole('button', { name: /notification/i })).toBeNull();
  });

  it('does not render a user menu', () => {
    render(<AuthHeader />);
    expect(screen.queryByRole('button', { name: /user menu/i })).toBeNull();
  });

  it('only contains one interactive element (brand link)', () => {
    render(<AuthHeader />);
    // Interactive = links + buttons
    const links = screen.getAllByRole('link');
    const buttons = screen.queryAllByRole('button');
    // skip link + brand link = 2 links, 0 buttons (skip link is visually hidden)
    expect(links.length).toBeLessThanOrEqual(2);
    expect(buttons.length).toBe(0);
  });
});
