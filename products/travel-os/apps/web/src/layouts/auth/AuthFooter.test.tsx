import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => <a href={href} className={className}>{children}</a>,
}));

vi.mock('@/config/constants', () => ({
  APP_NAME: 'TravelOS',
  APP_VERSION: '2.5.0',
}));

import { AuthFooter } from './AuthFooter';

// ─── Structure ────────────────────────────────────────────────────────────────

describe('AuthFooter — structure', () => {
  it('renders a <footer> with role=contentinfo', () => {
    render(<AuthFooter />);
    expect(screen.getByRole('contentinfo')).toBeDefined();
  });

  it('footer has a descriptive aria-label', () => {
    render(<AuthFooter />);
    const footer = screen.getByRole('contentinfo');
    expect(footer.getAttribute('aria-label')).toBeTruthy();
    expect(footer.getAttribute('aria-label')).toMatch(/footer/i);
  });
});

// ─── Copyright ────────────────────────────────────────────────────────────────

describe('AuthFooter — copyright', () => {
  it('displays the current year', () => {
    render(<AuthFooter />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByRole('contentinfo').textContent).toContain(year);
  });

  it('displays the app name', () => {
    render(<AuthFooter />);
    expect(screen.getByRole('contentinfo').textContent).toContain('TravelOS');
  });
});

// ─── Version ──────────────────────────────────────────────────────────────────

describe('AuthFooter — version', () => {
  it('renders version text', () => {
    render(<AuthFooter />);
    expect(screen.getByRole('contentinfo').textContent).toContain('2.5.0');
  });

  it('version element has a descriptive aria-label', () => {
    render(<AuthFooter />);
    const version = screen.getByLabelText(/version 2\.5\.0/i);
    expect(version).toBeDefined();
  });
});

// ─── Links ────────────────────────────────────────────────────────────────────

describe('AuthFooter — links', () => {
  it('renders a legal navigation landmark', () => {
    render(<AuthFooter />);
    const nav = screen.getByRole('navigation', { name: /legal links/i });
    expect(nav).toBeDefined();
  });

  it('renders a Privacy link', () => {
    render(<AuthFooter />);
    expect(screen.getByRole('link', { name: /privacy/i })).toBeDefined();
  });

  it('renders a Terms link', () => {
    render(<AuthFooter />);
    expect(screen.getByRole('link', { name: /terms/i })).toBeDefined();
  });

  it('Privacy link points to /privacy', () => {
    render(<AuthFooter />);
    const link = screen.getByRole('link', { name: /privacy/i }) as HTMLAnchorElement;
    expect(link.href).toContain('/privacy');
  });

  it('Terms link points to /terms', () => {
    render(<AuthFooter />);
    const link = screen.getByRole('link', { name: /terms/i }) as HTMLAnchorElement;
    expect(link.href).toContain('/terms');
  });

  it('links are wrapped in a list', () => {
    render(<AuthFooter />);
    const nav = screen.getByRole('navigation', { name: /legal links/i });
    const list = nav.querySelector('[role="list"]');
    expect(list).toBeDefined();
  });
});

// ─── Minimal ──────────────────────────────────────────────────────────────────

describe('AuthFooter — minimal (auth-specific)', () => {
  it('does not render Docs or Support links (only Privacy and Terms)', () => {
    render(<AuthFooter />);
    expect(screen.queryByRole('link', { name: /docs/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /support/i })).toBeNull();
  });

  it('total link count is 2 (Privacy + Terms)', () => {
    render(<AuthFooter />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
  });
});
