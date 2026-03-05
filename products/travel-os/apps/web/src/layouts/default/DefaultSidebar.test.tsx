import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

// ─── Mocks ────────────────────────────────────────────────────────────────────

let mockPathname = '/dashboard';
let mockSidebarOpen = true;
const mockSetSidebarOpen = vi.fn((val: boolean | ((prev: boolean) => boolean)) => {
  if (typeof val === 'function') {
    mockSidebarOpen = val(mockSidebarOpen);
  } else {
    mockSidebarOpen = val;
  }
});

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
    'aria-current': ariaCurrent,
    'aria-label': ariaLabel,
    'data-nav-item': dataNavItem,
    'data-nav-id': dataNavId,
    style,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    'aria-current'?: string;
    'aria-label'?: string;
    'data-nav-item'?: string;
    'data-nav-id'?: string;
    style?: React.CSSProperties;
  }) => (
    <a
      href={href}
      className={className}
      aria-current={ariaCurrent}
      aria-label={ariaLabel}
      data-nav-item={dataNavItem}
      data-nav-id={dataNavId}
      style={style}
    >
      {children}
    </a>
  ),
}));

vi.mock('@/components/icons/Icon', () => ({
  Icon: ({ name, 'aria-hidden': ariaHidden }: { name: string; 'aria-hidden'?: boolean }) => (
    <span data-icon={name} aria-hidden={ariaHidden} />
  ),
}));

vi.mock('../LayoutProvider', () => ({
  useLayout: () => ({
    sidebarOpen: mockSidebarOpen,
    setSidebarOpen: mockSetSidebarOpen,
    toggleSidebar: () => mockSetSidebarOpen(!mockSidebarOpen),
  }),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

import { DefaultSidebar, NAV_ITEMS } from './DefaultSidebar';

// ─── NAV_ITEMS data ───────────────────────────────────────────────────────────

describe('NAV_ITEMS', () => {
  it('is non-empty', () => {
    expect(NAV_ITEMS.length).toBeGreaterThan(0);
  });

  it('all items have required fields', () => {
    for (const item of NAV_ITEMS) {
      expect(typeof item.id).toBe('string');
      expect(typeof item.label).toBe('string');
      expect(typeof item.icon).toBe('string');
    }
  });

  it('includes dashboard as first item', () => {
    expect(NAV_ITEMS[0].id).toBe('dashboard');
    expect(NAV_ITEMS[0].href).toBe('/dashboard');
  });

  it('includes settings', () => {
    const settings = NAV_ITEMS.find((n) => n.id === 'settings');
    expect(settings).toBeDefined();
  });

  it('itineraries has children', () => {
    const itin = NAV_ITEMS.find((n) => n.id === 'itineraries');
    expect(itin?.children?.length).toBeGreaterThan(0);
  });
});

// ─── DefaultSidebar rendering ─────────────────────────────────────────────────

describe('DefaultSidebar — rendering', () => {
  beforeEach(() => {
    mockSidebarOpen = true;
    mockPathname = '/dashboard';
    mockSetSidebarOpen.mockClear();
    localStorageMock.clear();
  });

  it('renders an aside landmark', () => {
    render(<DefaultSidebar />);
    const aside = screen.getByRole('complementary');
    expect(aside).toBeDefined();
  });

  it('aside has id=default-sidebar', () => {
    render(<DefaultSidebar />);
    const aside = document.getElementById('default-sidebar');
    expect(aside).toBeDefined();
  });

  it('aside has aria-label=Main navigation', () => {
    render(<DefaultSidebar />);
    const aside = screen.getByRole('complementary', { name: /main navigation/i });
    expect(aside).toBeDefined();
  });

  it('renders a nav element inside aside', () => {
    render(<DefaultSidebar />);
    const navs = screen.getAllByRole('navigation', { name: /main navigation/i });
    expect(navs.length).toBeGreaterThan(0);
  });

  it('renders collapse toggle button', () => {
    render(<DefaultSidebar />);
    const btn = screen.getByRole('button', { name: /collapse sidebar/i });
    expect(btn).toBeDefined();
  });

  it('collapse button shows aria-keyshortcuts=Control+b', () => {
    render(<DefaultSidebar />);
    const btn = screen.getByRole('button', { name: /collapse sidebar/i });
    expect(btn.getAttribute('aria-keyshortcuts')).toBe('Control+b');
  });

  it('renders all top-level nav item labels in open state', () => {
    mockSidebarOpen = true;
    render(<DefaultSidebar />);
    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('Bookings')).toBeDefined();
    expect(screen.getByText('Settings')).toBeDefined();
  });

  it('active route gets aria-current=page', () => {
    mockPathname = '/dashboard';
    render(<DefaultSidebar />);
    const dashLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashLink.getAttribute('aria-current')).toBe('page');
  });

  it('inactive routes do not get aria-current', () => {
    mockPathname = '/dashboard';
    render(<DefaultSidebar />);
    const bookingsLink = screen.getByRole('link', { name: /bookings/i });
    expect(bookingsLink.getAttribute('aria-current')).toBeNull();
  });
});

// ─── DefaultSidebar — collapse state ─────────────────────────────────────────

describe('DefaultSidebar — collapse', () => {
  beforeEach(() => {
    mockSidebarOpen = true;
    mockSetSidebarOpen.mockClear();
    localStorageMock.clear();
  });

  it('sets data-collapsed=false when sidebar is open', () => {
    mockSidebarOpen = true;
    render(<DefaultSidebar />);
    const aside = document.getElementById('default-sidebar');
    expect(aside?.getAttribute('data-collapsed')).toBe('false');
  });

  it('sets data-collapsed=true when sidebar is closed', () => {
    mockSidebarOpen = false;
    render(<DefaultSidebar />);
    const aside = document.getElementById('default-sidebar');
    expect(aside?.getAttribute('data-collapsed')).toBe('true');
  });

  it('clicking collapse button calls setSidebarOpen', () => {
    render(<DefaultSidebar />);
    const btn = screen.getByRole('button', { name: /collapse sidebar/i });
    fireEvent.click(btn);
    expect(mockSetSidebarOpen).toHaveBeenCalled();
  });

  it('expand button label shown when collapsed', () => {
    mockSidebarOpen = false;
    render(<DefaultSidebar />);
    const btn = screen.getByRole('button', { name: /expand sidebar/i });
    expect(btn).toBeDefined();
  });
});

// ─── DefaultSidebar — localStorage persistence ────────────────────────────────

describe('DefaultSidebar — localStorage', () => {
  beforeEach(() => {
    mockSidebarOpen = true;
    mockSetSidebarOpen.mockClear();
    localStorageMock.clear();
  });

  it('persists sidebarOpen=true to localStorage', async () => {
    mockSidebarOpen = true;
    await act(async () => {
      render(<DefaultSidebar />);
    });
    expect(localStorageMock.getItem('tos-sidebar-open')).toBe('true');
  });

  it('persists sidebarOpen=false to localStorage', async () => {
    mockSidebarOpen = false;
    await act(async () => {
      render(<DefaultSidebar />);
    });
    expect(localStorageMock.getItem('tos-sidebar-open')).toBe('false');
  });

  it('restores sidebar state from localStorage on mount', async () => {
    localStorageMock.setItem('tos-sidebar-open', 'false');
    await act(async () => {
      render(<DefaultSidebar />);
    });
    expect(mockSetSidebarOpen).toHaveBeenCalledWith(false);
  });
});

// ─── DefaultSidebar — submenu expand/collapse ────────────────────────────────

describe('DefaultSidebar — submenu', () => {
  beforeEach(() => {
    mockSidebarOpen = true;
    mockPathname = '/dashboard';
    localStorageMock.clear();
  });

  it('submenu is hidden by default for non-active parent', () => {
    render(<DefaultSidebar />);
    // Itineraries submenu should be collapsed
    expect(screen.queryByText('My Itineraries')).toBeNull();
  });

  it('clicking parent button expands submenu', () => {
    render(<DefaultSidebar />);
    const itinBtn = screen.getByRole('button', { name: /itineraries/i });
    fireEvent.click(itinBtn);
    expect(screen.getByText('My Itineraries')).toBeDefined();
  });

  it('parent button has aria-expanded=false when collapsed', () => {
    render(<DefaultSidebar />);
    const itinBtn = screen.getByRole('button', { name: /itineraries/i });
    expect(itinBtn.getAttribute('aria-expanded')).toBe('false');
  });

  it('parent button has aria-expanded=true when expanded', () => {
    render(<DefaultSidebar />);
    const itinBtn = screen.getByRole('button', { name: /itineraries/i });
    fireEvent.click(itinBtn);
    expect(itinBtn.getAttribute('aria-expanded')).toBe('true');
  });

  it('clicking parent again collapses submenu', () => {
    render(<DefaultSidebar />);
    const itinBtn = screen.getByRole('button', { name: /itineraries/i });
    fireEvent.click(itinBtn);
    fireEvent.click(itinBtn);
    expect(screen.queryByText('My Itineraries')).toBeNull();
  });

  it('auto-expands parent when child route is active', async () => {
    mockPathname = '/itineraries';
    await act(async () => {
      render(<DefaultSidebar />);
    });
    // My Itineraries should be visible
    expect(screen.getByText('My Itineraries')).toBeDefined();
  });
});

// ─── DefaultSidebar — keyboard navigation ─────────────────────────────────────

describe('DefaultSidebar — keyboard navigation', () => {
  beforeEach(() => {
    mockSidebarOpen = true;
    mockPathname = '/dashboard';
    localStorageMock.clear();
  });

  it('ArrowDown moves focus to next nav item', () => {
    render(<DefaultSidebar />);
    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    const items = nav.querySelectorAll<HTMLElement>('[data-nav-item]');
    if (items.length < 2) return;

    items[0].focus();
    fireEvent.keyDown(nav, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[1]);
  });

  it('ArrowUp moves focus to previous nav item', () => {
    render(<DefaultSidebar />);
    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    const items = nav.querySelectorAll<HTMLElement>('[data-nav-item]');
    if (items.length < 2) return;

    items[1].focus();
    fireEvent.keyDown(nav, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(items[0]);
  });

  it('Home key focuses the first nav item', () => {
    render(<DefaultSidebar />);
    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    const items = nav.querySelectorAll<HTMLElement>('[data-nav-item]');
    if (items.length < 2) return;

    items[items.length - 1].focus();
    fireEvent.keyDown(nav, { key: 'Home' });
    expect(document.activeElement).toBe(items[0]);
  });

  it('End key focuses the last nav item', () => {
    render(<DefaultSidebar />);
    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    const items = nav.querySelectorAll<HTMLElement>('[data-nav-item]');
    if (items.length < 2) return;

    items[0].focus();
    fireEvent.keyDown(nav, { key: 'End' });
    expect(document.activeElement).toBe(items[items.length - 1]);
  });
});
