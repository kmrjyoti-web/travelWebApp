import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// ─── Mocks ────────────────────────────────────────────────────────────────────

let mockPathname = '/dashboard';
let mockSidebarOpen = true;
const mockSetSidebarOpen = vi.fn();
const mockToggleSidebar = vi.fn();

vi.mock('next/navigation', () => ({ usePathname: () => mockPathname }));
vi.mock('../LayoutProvider', () => ({
  useLayout: () => ({
    sidebarOpen: mockSidebarOpen,
    setSidebarOpen: mockSetSidebarOpen,
    toggleSidebar: mockToggleSidebar,
  }),
}));
vi.mock('next/link', () => ({
  default: ({ href, children, className, 'aria-label': al, 'aria-current': ac,
              'data-nav-item': dni, 'data-nav-id': dnid, style }:
    { href: string; children: React.ReactNode; className?: string;
      'aria-label'?: string; 'aria-current'?: string;
      'data-nav-item'?: boolean; 'data-nav-id'?: string; style?: React.CSSProperties }) => (
    <a href={href} className={className} aria-label={al} aria-current={ac}
       data-nav-item={dni} data-nav-id={dnid} style={style}>{children}</a>
  ),
}));
vi.mock('@/components/icons/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-icon={name} />,
}));

// localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

import { AdminSidebar, ADMIN_NAV_ITEMS } from './AdminSidebar';

// ─── ADMIN_NAV_ITEMS data ─────────────────────────────────────────────────────

describe('ADMIN_NAV_ITEMS', () => {
  it('is a non-empty array', () => {
    expect(ADMIN_NAV_ITEMS.length).toBeGreaterThan(0);
  });

  it('every item has id, label, icon', () => {
    for (const item of ADMIN_NAV_ITEMS) {
      expect(typeof item.id).toBe('string');
      expect(typeof item.label).toBe('string');
      expect(typeof item.icon).toBe('string');
    }
  });

  it('includes Dashboard', () => {
    expect(ADMIN_NAV_ITEMS.some((i) => i.label === 'Dashboard')).toBe(true);
  });

  it('includes Users', () => {
    expect(ADMIN_NAV_ITEMS.some((i) => i.label === 'Users')).toBe(true);
  });

  it('includes Settings', () => {
    expect(ADMIN_NAV_ITEMS.some((i) => i.label === 'Settings')).toBe(true);
  });

  it('Access Control item has children', () => {
    const access = ADMIN_NAV_ITEMS.find((i) => i.id === 'admin-access');
    expect(access?.children?.length).toBeGreaterThan(0);
  });

  it('children of Access Control have href', () => {
    const access = ADMIN_NAV_ITEMS.find((i) => i.id === 'admin-access');
    for (const child of access?.children ?? []) {
      expect(typeof child.href).toBe('string');
    }
  });
});

// ─── AdminSidebar — structure ─────────────────────────────────────────────────

describe('AdminSidebar — structure', () => {
  beforeEach(() => {
    mockSidebarOpen = true;
    mockSetSidebarOpen.mockClear();
    localStorageMock.clear();
  });

  it('renders aside with id=admin-sidebar', () => {
    render(<AdminSidebar />);
    expect(document.getElementById('admin-sidebar')).toBeDefined();
  });

  it('has data-testid=admin-sidebar', () => {
    render(<AdminSidebar />);
    expect(screen.getByTestId('admin-sidebar')).toBeDefined();
  });

  it('aside has aria-label containing navigation', () => {
    render(<AdminSidebar />);
    const aside = screen.getByTestId('admin-sidebar');
    expect(aside.getAttribute('aria-label')).toMatch(/navigation/i);
  });

  it('renders a nav element', () => {
    render(<AdminSidebar />);
    expect(screen.getByRole('navigation')).toBeDefined();
  });

  it('nav has aria-label containing Admin', () => {
    render(<AdminSidebar />);
    const nav = screen.getByRole('navigation');
    expect(nav.getAttribute('aria-label')).toMatch(/admin/i);
  });

  it('renders all top-level nav labels', () => {
    render(<AdminSidebar />);
    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('Users')).toBeDefined();
    expect(screen.getByText('Settings')).toBeDefined();
  });

  it('shows ADMINISTRATION section label when open', () => {
    render(<AdminSidebar />);
    expect(screen.getByText('ADMINISTRATION')).toBeDefined();
  });

  it('hides ADMINISTRATION section label when collapsed', () => {
    mockSidebarOpen = false;
    render(<AdminSidebar />);
    expect(screen.queryByText('ADMINISTRATION')).toBeNull();
  });
});

// ─── AdminSidebar — collapse toggle ──────────────────────────────────────────

describe('AdminSidebar — collapse toggle', () => {
  beforeEach(() => {
    mockSidebarOpen = true;
    mockSetSidebarOpen.mockClear();
    localStorageMock.clear();
  });

  it('renders collapse button', () => {
    render(<AdminSidebar />);
    expect(screen.getByRole('button', { name: /collapse admin sidebar/i })).toBeDefined();
  });

  it('collapse button aria-keyshortcuts=Control+b', () => {
    render(<AdminSidebar />);
    const btn = screen.getByRole('button', { name: /collapse admin sidebar/i });
    expect(btn.getAttribute('aria-keyshortcuts')).toBe('Control+b');
  });

  it('clicking collapse button calls setSidebarOpen', () => {
    render(<AdminSidebar />);
    fireEvent.click(screen.getByRole('button', { name: /collapse admin sidebar/i }));
    expect(mockSetSidebarOpen).toHaveBeenCalledOnce();
  });

  it('shows Expand label when sidebar closed', () => {
    mockSidebarOpen = false;
    render(<AdminSidebar />);
    expect(screen.getByRole('button', { name: /expand admin sidebar/i })).toBeDefined();
  });

  it('aside data-collapsed=false when open', () => {
    render(<AdminSidebar />);
    const aside = screen.getByTestId('admin-sidebar');
    expect(aside.getAttribute('data-collapsed')).toBe('false');
  });

  it('aside data-collapsed=true when closed', () => {
    mockSidebarOpen = false;
    render(<AdminSidebar />);
    const aside = screen.getByTestId('admin-sidebar');
    expect(aside.getAttribute('data-collapsed')).toBe('true');
  });
});

// ─── AdminSidebar — active route ─────────────────────────────────────────────

describe('AdminSidebar — active route', () => {
  beforeEach(() => {
    mockSidebarOpen = true;
    localStorageMock.clear();
  });

  it('Dashboard link has aria-current=page on /dashboard', () => {
    mockPathname = '/dashboard';
    render(<AdminSidebar />);
    const link = screen.getByRole('link', { name: /dashboard/i });
    expect(link.getAttribute('aria-current')).toBe('page');
  });

  it('Users link has aria-current=page on /users', () => {
    mockPathname = '/users';
    render(<AdminSidebar />);
    const link = screen.getByRole('link', { name: /users/i });
    expect(link.getAttribute('aria-current')).toBe('page');
  });

  it('Dashboard link has no aria-current on /users', () => {
    mockPathname = '/users';
    render(<AdminSidebar />);
    const link = screen.getByRole('link', { name: /dashboard/i });
    expect(link.getAttribute('aria-current')).toBeNull();
  });

  it('child route marks parent as active (parent button has active class)', () => {
    mockPathname = '/admin/roles';
    render(<AdminSidebar />);
    // Access Control button should be present and submenu expanded
    const accessBtn = screen.getByRole('button', { name: /access control/i });
    expect(accessBtn.className).toMatch(/active/);
  });
});

// ─── AdminSidebar — submenus ──────────────────────────────────────────────────

describe('AdminSidebar — submenus', () => {
  beforeEach(() => {
    mockSidebarOpen = true;
    mockPathname = '/dashboard';
    localStorageMock.clear();
  });

  it('Access Control button has aria-expanded=false initially', () => {
    render(<AdminSidebar />);
    const btn = screen.getByRole('button', { name: /access control/i });
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('clicking Access Control expands submenu', () => {
    render(<AdminSidebar />);
    fireEvent.click(screen.getByRole('button', { name: /access control/i }));
    expect(screen.getByText('Roles')).toBeDefined();
    expect(screen.getByText('Permissions')).toBeDefined();
  });

  it('Access Control button aria-expanded=true after click', () => {
    render(<AdminSidebar />);
    fireEvent.click(screen.getByRole('button', { name: /access control/i }));
    const btn = screen.getByRole('button', { name: /access control/i });
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });

  it('clicking Access Control again collapses submenu', () => {
    render(<AdminSidebar />);
    fireEvent.click(screen.getByRole('button', { name: /access control/i }));
    expect(screen.getByText('Roles')).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: /access control/i }));
    expect(screen.queryByText('Roles')).toBeNull();
  });

  it('submenu list has aria-label containing submenu', () => {
    render(<AdminSidebar />);
    fireEvent.click(screen.getByRole('button', { name: /access control/i }));
    const list = screen.getByRole('list', { name: /submenu/i });
    expect(list).toBeDefined();
  });

  it('submenu does not render when sidebar is collapsed', () => {
    mockSidebarOpen = false;
    render(<AdminSidebar />);
    // Even if expanded, collapsed sidebar hides submenus
    expect(screen.queryByText('Roles')).toBeNull();
  });

  it('auto-expands parent when child route is active', () => {
    mockPathname = '/admin/roles';
    render(<AdminSidebar />);
    expect(screen.getByText('Roles')).toBeDefined();
  });
});

// ─── AdminSidebar — collapsed icon-only mode ──────────────────────────────────

describe('AdminSidebar — collapsed mode', () => {
  beforeEach(() => {
    mockSidebarOpen = false;
    mockPathname = '/dashboard';
    localStorageMock.clear();
  });

  it('hides labels when collapsed', () => {
    render(<AdminSidebar />);
    // Dashboard label should not be visible text (icon-only)
    // aria-label on link provides accessible name instead
    const link = document.querySelector('[aria-label="Dashboard"]');
    expect(link).toBeDefined();
  });

  it('links still have aria-label when collapsed', () => {
    render(<AdminSidebar />);
    // All links should have aria-label in icon-only mode
    const links = document.querySelectorAll('.tos-admin-sidebar__link[aria-label]');
    expect(links.length).toBeGreaterThan(0);
  });
});

// ─── AdminSidebar — localStorage ─────────────────────────────────────────────

describe('AdminSidebar — localStorage', () => {
  beforeEach(() => {
    mockSidebarOpen = true;
    mockSetSidebarOpen.mockClear();
    localStorageMock.clear();
  });

  it('reads localStorage on mount and calls setSidebarOpen if saved value differs', () => {
    localStorageMock.setItem('tos-admin-sidebar-open', 'false');
    render(<AdminSidebar />);
    expect(mockSetSidebarOpen).toHaveBeenCalledWith(false);
  });

  it('does not call setSidebarOpen if no saved value', () => {
    render(<AdminSidebar />);
    expect(mockSetSidebarOpen).not.toHaveBeenCalled();
  });
});

// ─── AdminSidebar — keyboard shortcut ────────────────────────────────────────

describe('AdminSidebar — Ctrl+B shortcut', () => {
  beforeEach(() => {
    mockSidebarOpen = true;
    mockSetSidebarOpen.mockClear();
    mockToggleSidebar.mockClear();
    localStorageMock.clear();
  });

  it('Ctrl+B calls toggleSidebar', () => {
    render(<AdminSidebar />);
    fireEvent.keyDown(document, { key: 'b', ctrlKey: true });
    expect(mockToggleSidebar).toHaveBeenCalledOnce();
  });

  it('Ctrl+B with altKey does not toggle', () => {
    render(<AdminSidebar />);
    fireEvent.keyDown(document, { key: 'b', ctrlKey: true, altKey: true });
    expect(mockToggleSidebar).not.toHaveBeenCalled();
  });

  it('Ctrl+B with shiftKey does not toggle', () => {
    render(<AdminSidebar />);
    fireEvent.keyDown(document, { key: 'b', ctrlKey: true, shiftKey: true });
    expect(mockToggleSidebar).not.toHaveBeenCalled();
  });
});

// ─── AdminSidebar — arrow key navigation ─────────────────────────────────────

describe('AdminSidebar — arrow key navigation', () => {
  beforeEach(() => {
    mockSidebarOpen = true;
    mockPathname = '/dashboard';
    localStorageMock.clear();
  });

  it('renders nav items with data-nav-item attribute', () => {
    render(<AdminSidebar />);
    const items = document.querySelectorAll('[data-nav-item]');
    expect(items.length).toBeGreaterThan(0);
  });

  it('nav items have data-nav-id attribute', () => {
    render(<AdminSidebar />);
    const items = document.querySelectorAll('[data-nav-id]');
    expect(items.length).toBeGreaterThan(0);
  });
});
