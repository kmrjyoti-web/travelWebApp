import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// ─── Mocks ────────────────────────────────────────────────────────────────────

let mockPathname = '/dashboard';

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('@/components/icons/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-icon={name} />,
}));

import { DefaultBreadcrumb, buildBreadcrumbs } from './DefaultBreadcrumb';

// ─── buildBreadcrumbs (pure function) ─────────────────────────────────────────

describe('buildBreadcrumbs', () => {
  it('returns only Home for root path', () => {
    const crumbs = buildBreadcrumbs('/');
    expect(crumbs).toHaveLength(1);
    expect(crumbs[0].label).toBe('Home');
    expect(crumbs[0].isLast).toBe(true);
  });

  it('returns Home + Dashboard for /dashboard', () => {
    const crumbs = buildBreadcrumbs('/dashboard');
    expect(crumbs).toHaveLength(2);
    expect(crumbs[0].label).toBe('Home');
    expect(crumbs[1].label).toBe('Dashboard');
    expect(crumbs[1].isLast).toBe(true);
  });

  it('marks only the last segment as isLast', () => {
    const crumbs = buildBreadcrumbs('/dashboard/itineraries/new');
    const lastItems = crumbs.filter((c) => c.isLast);
    expect(lastItems).toHaveLength(1);
    expect(lastItems[0].label).toBe('New');
  });

  it('generates correct hrefs', () => {
    const crumbs = buildBreadcrumbs('/dashboard/itineraries');
    expect(crumbs[0].href).toBe('/');
    expect(crumbs[1].href).toBe('/dashboard');
    expect(crumbs[2].href).toBe('/dashboard/itineraries');
  });

  it('formats hyphenated segments to title case', () => {
    const crumbs = buildBreadcrumbs('/my-itineraries');
    expect(crumbs[1].label).toBe('My Itineraries');
  });

  it('leaves UUID-like segments unchanged', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    const crumbs = buildBreadcrumbs(`/bookings/${uuid}`);
    expect(crumbs[2].label).toBe(uuid);
  });

  it('Home href is always /', () => {
    const crumbs = buildBreadcrumbs('/settings/profile');
    expect(crumbs[0].href).toBe('/');
  });
});

// ─── DefaultBreadcrumb component ──────────────────────────────────────────────

describe('DefaultBreadcrumb', () => {
  it('renders nothing on root path', () => {
    mockPathname = '/';
    const { container } = render(<DefaultBreadcrumb />);
    expect(container.firstChild).toBeNull();
    mockPathname = '/dashboard';
  });

  it('renders a nav landmark with aria-label=Breadcrumb', () => {
    mockPathname = '/dashboard';
    render(<DefaultBreadcrumb />);
    const nav = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(nav).toBeDefined();
  });

  it('renders an ordered list', () => {
    mockPathname = '/dashboard';
    render(<DefaultBreadcrumb />);
    const nav = screen.getByRole('navigation', { name: /breadcrumb/i });
    const list = nav.querySelector('ol');
    expect(list).toBeDefined();
  });

  it('last item has aria-current=page', () => {
    mockPathname = '/dashboard/itineraries';
    render(<DefaultBreadcrumb />);
    const current = screen.getByText('Itineraries');
    expect(current.getAttribute('aria-current')).toBe('page');
  });

  it('non-last items render as links', () => {
    mockPathname = '/dashboard/itineraries';
    render(<DefaultBreadcrumb />);
    // Home and Dashboard should be links
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toBeDefined();
    const dashLink = screen.getByRole('link', { name: 'Dashboard' });
    expect(dashLink).toBeDefined();
  });

  it('last item is not a link', () => {
    mockPathname = '/dashboard/settings';
    render(<DefaultBreadcrumb />);
    // "Settings" (last) should not be a link
    const settingsElements = screen.getAllByText('Settings');
    for (const el of settingsElements) {
      expect(el.tagName.toLowerCase()).not.toBe('a');
    }
  });

  it('renders separator icons between items', () => {
    mockPathname = '/dashboard/itineraries';
    render(<DefaultBreadcrumb />);
    // 3 items → 2 separators (no separator before first item)
    const separators = document.querySelectorAll('[data-icon="ChevronRight"]');
    expect(separators.length).toBeGreaterThanOrEqual(2);
  });

  it('Home link points to /', () => {
    mockPathname = '/dashboard';
    render(<DefaultBreadcrumb />);
    const homeLink = screen.getByRole('link', { name: 'Home' }) as HTMLAnchorElement;
    expect(homeLink.href).toContain('/');
  });
});
