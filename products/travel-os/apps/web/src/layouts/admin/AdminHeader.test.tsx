import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// ─── Mocks ────────────────────────────────────────────────────────────────────

let mockPathname = '/dashboard';
let mockSidebarOpen = true;
const mockToggleSidebar = vi.fn();

vi.mock('next/navigation', () => ({ usePathname: () => mockPathname }));
vi.mock('../LayoutProvider', () => ({
  useLayout: () => ({
    sidebarOpen: mockSidebarOpen,
    toggleSidebar: mockToggleSidebar,
    setSidebarOpen: vi.fn(),
  }),
}));
vi.mock('next/link', () => ({
  default: ({ href, children, className, 'aria-label': al, 'aria-current': ac,
              role, onClick, 'data-testid': dt }:
    { href: string; children: React.ReactNode; className?: string;
      'aria-label'?: string; 'aria-current'?: string;
      role?: string; onClick?: () => void; 'data-testid'?: string }) => (
    <a href={href} className={className} aria-label={al} aria-current={ac}
       role={role} onClick={onClick} data-testid={dt}>{children}</a>
  ),
}));
vi.mock('@/components/icons/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-icon={name} />,
}));
vi.mock('@/config/constants', () => ({ APP_NAME: 'TravelOS', APP_VERSION: '1.0.0' }));
vi.mock('./theme', () => ({
  statusColorVar: () => '--tos-admin-status-operational',
  STATUS_LABELS: { operational: 'Operational', degraded: 'Degraded', down: 'Down' },
}));

import { AdminHeader, AdminToolbar } from './AdminHeader';

// ─── AdminHeader structure ────────────────────────────────────────────────────

describe('AdminHeader — structure', () => {
  beforeEach(() => { mockSidebarOpen = true; mockToggleSidebar.mockClear(); });

  it('renders a banner landmark', () => {
    render(<AdminHeader />);
    expect(screen.getByRole('banner')).toBeDefined();
  });

  it('has data-testid=admin-header', () => {
    render(<AdminHeader />);
    expect(screen.getByTestId('admin-header')).toBeDefined();
  });

  it('aria-label mentions Admin', () => {
    render(<AdminHeader />);
    const header = screen.getByRole('banner');
    expect(header.getAttribute('aria-label')).toMatch(/admin/i);
  });

  it('renders skip link to #admin-main', () => {
    render(<AdminHeader />);
    const skip = screen.getByText(/skip to main content/i);
    expect(skip.getAttribute('href')).toBe('#admin-main');
  });

  it('renders app name', () => {
    render(<AdminHeader />);
    expect(screen.getByText('TravelOS')).toBeDefined();
  });

  it('renders Admin badge', () => {
    render(<AdminHeader />);
    expect(screen.getByText('Admin')).toBeDefined();
  });

  it('brand link points to /dashboard', () => {
    render(<AdminHeader />);
    const link = screen.getByRole('link', { name: /TravelOS Admin/i });
    expect(link.getAttribute('href')).toContain('/dashboard');
  });
});

// ─── AdminHeader — sidebar toggle ────────────────────────────────────────────

describe('AdminHeader — sidebar toggle', () => {
  beforeEach(() => { mockSidebarOpen = true; mockToggleSidebar.mockClear(); });

  it('renders toggle button', () => {
    render(<AdminHeader />);
    const btn = screen.getByRole('button', { name: /collapse admin sidebar/i });
    expect(btn).toBeDefined();
  });

  it('toggle aria-expanded matches sidebarOpen', () => {
    render(<AdminHeader />);
    const btn = screen.getByRole('button', { name: /collapse admin sidebar/i });
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });

  it('toggle aria-controls=admin-sidebar', () => {
    render(<AdminHeader />);
    const btn = screen.getByRole('button', { name: /collapse admin sidebar/i });
    expect(btn.getAttribute('aria-controls')).toBe('admin-sidebar');
  });

  it('clicking toggle calls toggleSidebar', () => {
    render(<AdminHeader />);
    fireEvent.click(screen.getByRole('button', { name: /collapse admin sidebar/i }));
    expect(mockToggleSidebar).toHaveBeenCalledOnce();
  });

  it('shows Expand label when sidebar is closed', () => {
    mockSidebarOpen = false;
    render(<AdminHeader />);
    expect(screen.getByRole('button', { name: /expand admin sidebar/i })).toBeDefined();
  });

  it('toggle has aria-keyshortcuts=Control+b', () => {
    render(<AdminHeader />);
    const btn = screen.getByRole('button', { name: /collapse admin sidebar/i });
    expect(btn.getAttribute('aria-keyshortcuts')).toBe('Control+b');
  });
});

// ─── AdminHeader — system status ─────────────────────────────────────────────

describe('AdminHeader — system status', () => {
  beforeEach(() => { mockSidebarOpen = true; });

  it('renders a system status trigger button', () => {
    render(<AdminHeader />);
    expect(screen.getByTestId('system-status-trigger')).toBeDefined();
  });

  it('status trigger has descriptive aria-label', () => {
    render(<AdminHeader />);
    const btn = screen.getByTestId('system-status-trigger');
    expect(btn.getAttribute('aria-label')).toMatch(/system status/i);
  });

  it('status trigger has aria-haspopup=dialog', () => {
    render(<AdminHeader />);
    const btn = screen.getByTestId('system-status-trigger');
    expect(btn.getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('clicking status trigger opens status panel', () => {
    render(<AdminHeader />);
    fireEvent.click(screen.getByTestId('system-status-trigger'));
    expect(screen.getByTestId('system-status-panel')).toBeDefined();
  });

  it('status panel has role=dialog', () => {
    render(<AdminHeader />);
    fireEvent.click(screen.getByTestId('system-status-trigger'));
    expect(screen.getByRole('dialog', { name: /system status/i })).toBeDefined();
  });

  it('status panel lists service items', () => {
    render(<AdminHeader />);
    fireEvent.click(screen.getByTestId('system-status-trigger'));
    expect(screen.getByText('API')).toBeDefined();
    expect(screen.getByText('DB')).toBeDefined();
    expect(screen.getByText('Cache')).toBeDefined();
  });

  it('Escape closes status panel', () => {
    render(<AdminHeader />);
    fireEvent.click(screen.getByTestId('system-status-trigger'));
    expect(screen.getByTestId('system-status-panel')).toBeDefined();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('system-status-panel')).toBeNull();
  });

  it('trigger aria-expanded=false by default', () => {
    render(<AdminHeader />);
    expect(screen.getByTestId('system-status-trigger').getAttribute('aria-expanded')).toBe('false');
  });

  it('trigger aria-expanded=true when panel is open', () => {
    render(<AdminHeader />);
    fireEvent.click(screen.getByTestId('system-status-trigger'));
    expect(screen.getByTestId('system-status-trigger').getAttribute('aria-expanded')).toBe('true');
  });
});

// ─── AdminHeader — user menu ──────────────────────────────────────────────────

describe('AdminHeader — user menu', () => {
  beforeEach(() => mockSidebarOpen = true);

  it('renders admin user button', () => {
    render(<AdminHeader />);
    expect(screen.getByTestId('admin-user-btn')).toBeDefined();
  });

  it('user button aria-label mentions admin', () => {
    render(<AdminHeader />);
    const btn = screen.getByTestId('admin-user-btn');
    expect(btn.getAttribute('aria-label')).toMatch(/admin menu/i);
  });

  it('user button aria-haspopup=menu', () => {
    render(<AdminHeader />);
    expect(screen.getByTestId('admin-user-btn').getAttribute('aria-haspopup')).toBe('menu');
  });

  it('clicking user button opens dropdown', () => {
    render(<AdminHeader />);
    fireEvent.click(screen.getByTestId('admin-user-btn'));
    expect(screen.getByTestId('admin-user-dropdown')).toBeDefined();
  });

  it('dropdown has role=menu', () => {
    render(<AdminHeader />);
    fireEvent.click(screen.getByTestId('admin-user-btn'));
    expect(screen.getByRole('menu')).toBeDefined();
  });

  it('dropdown contains sign out button', () => {
    render(<AdminHeader />);
    fireEvent.click(screen.getByTestId('admin-user-btn'));
    expect(screen.getByRole('menuitem', { name: /sign out/i })).toBeDefined();
  });

  it('Escape closes user dropdown', () => {
    render(<AdminHeader />);
    fireEvent.click(screen.getByTestId('admin-user-btn'));
    expect(screen.getByTestId('admin-user-dropdown')).toBeDefined();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('admin-user-dropdown')).toBeNull();
  });
});

// ─── AdminHeader — keyboard shortcut hints ────────────────────────────────────

describe('AdminHeader — shortcut hints', () => {
  it('displays Ctrl+U shortcut hint', () => {
    render(<AdminHeader />);
    // kbd elements showing the shortcuts
    const kbds = document.querySelectorAll('.tos-admin-header__shortcut-chip kbd');
    const labels = Array.from(kbds).map((k) => k.textContent);
    expect(labels.some((l) => l?.includes('U'))).toBe(true);
  });
});

// ─── AdminToolbar ─────────────────────────────────────────────────────────────

describe('AdminToolbar', () => {
  it('renders a toolbar landmark', () => {
    render(<AdminToolbar pathname="/dashboard" />);
    expect(screen.getByRole('toolbar', { name: /admin quick navigation/i })).toBeDefined();
  });

  it('has data-testid=admin-toolbar', () => {
    render(<AdminToolbar pathname="/dashboard" />);
    expect(screen.getByTestId('admin-toolbar')).toBeDefined();
  });

  it('renders all toolbar links', () => {
    render(<AdminToolbar pathname="/dashboard" />);
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /users/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /settings/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /logs/i })).toBeDefined();
  });

  it('active link has aria-current=page', () => {
    render(<AdminToolbar pathname="/users" />);
    // Find all links and check which has aria-current
    const usersLink = screen.getByRole('link', { name: /users/i });
    expect(usersLink.getAttribute('aria-current')).toBe('page');
  });

  it('inactive links do not have aria-current', () => {
    render(<AdminToolbar pathname="/users" />);
    const dashLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashLink.getAttribute('aria-current')).toBeNull();
  });

  it('shows keyboard shortcut hints on applicable links', () => {
    render(<AdminToolbar pathname="/dashboard" />);
    // Users link should show ⌃U
    const kbds = document.querySelectorAll('.tos-admin-toolbar__kbd');
    expect(kbds.length).toBeGreaterThan(0);
  });

  it('contains a navigation landmark', () => {
    render(<AdminToolbar pathname="/dashboard" />);
    const nav = screen.getByRole('navigation', { name: /admin sections/i });
    expect(nav).toBeDefined();
  });

  it('renders quick stats region', () => {
    render(<AdminToolbar pathname="/dashboard" />);
    expect(screen.getByLabelText(/quick statistics/i)).toBeDefined();
  });
});
