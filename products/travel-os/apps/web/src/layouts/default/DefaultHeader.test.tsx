import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockToggleSidebar = vi.fn();
let mockSidebarOpen = true;

vi.mock('../LayoutProvider', () => ({
  useLayout: () => ({
    sidebarOpen: mockSidebarOpen,
    toggleSidebar: mockToggleSidebar,
    setSidebarOpen: vi.fn(),
  }),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
    'aria-label': ariaLabel,
    role,
    onClick,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    'aria-label'?: string;
    role?: string;
    onClick?: () => void;
  }) => (
    <a href={href} className={className} aria-label={ariaLabel} role={role} onClick={onClick}>
      {children}
    </a>
  ),
}));

vi.mock('@/components/icons/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-icon={name} />,
}));

vi.mock('@/config/constants', () => ({
  APP_NAME: 'TravelOS',
  APP_VERSION: '1.0.0',
}));

// DefaultHeader calls useKeyboardShortcut which requires KeyboardShortcutProvider.
// Mock the hook so tests render without a provider wrapper.
vi.mock('@/hooks/useKeyboardShortcut', () => ({
  useKeyboardShortcut: vi.fn(),
  useKeyboardShortcuts: vi.fn(),
}));

// Import the event names so keyboard shortcut tests can fire DOM events directly.
// (The provider fires these; in unit tests we trigger them manually.)
import { TOS_SEARCH_OPEN, TOS_HELP_OPEN } from '@/config/keyboard-shortcuts';

import { DefaultHeader } from './DefaultHeader';

// ─── Structure ────────────────────────────────────────────────────────────────

describe('DefaultHeader — structure', () => {
  beforeEach(() => {
    mockSidebarOpen = true;
    mockToggleSidebar.mockClear();
  });

  it('renders a header element with role=banner', () => {
    render(<DefaultHeader />);
    const header = screen.getByRole('banner');
    expect(header).toBeDefined();
  });

  it('header has aria-label', () => {
    render(<DefaultHeader />);
    const header = screen.getByRole('banner');
    expect(header.getAttribute('aria-label')).toBeTruthy();
  });

  it('renders a skip-to-content link', () => {
    render(<DefaultHeader />);
    const skipLink = screen.getByText(/skip to main content/i);
    expect(skipLink.getAttribute('href')).toBe('#main-content');
  });

  it('renders the app name', () => {
    render(<DefaultHeader />);
    expect(screen.getByText('TravelOS')).toBeDefined();
  });

  it('brand link points to /dashboard', () => {
    render(<DefaultHeader />);
    const brand = screen.getByRole('link', { name: /TravelOS/i });
    expect(brand.getAttribute('href')).toContain('/dashboard');
  });
});

// ─── Hamburger / sidebar toggle ───────────────────────────────────────────────

describe('DefaultHeader — sidebar toggle', () => {
  beforeEach(() => {
    mockSidebarOpen = true;
    mockToggleSidebar.mockClear();
  });

  it('renders a sidebar toggle button', () => {
    render(<DefaultHeader />);
    const btn = screen.getByRole('button', { name: /collapse sidebar/i });
    expect(btn).toBeDefined();
  });

  it('toggle button shows "Expand" label when sidebar is closed', () => {
    mockSidebarOpen = false;
    render(<DefaultHeader />);
    const btn = screen.getByRole('button', { name: /expand sidebar/i });
    expect(btn).toBeDefined();
  });

  it('toggle button has aria-expanded matching sidebarOpen', () => {
    mockSidebarOpen = true;
    render(<DefaultHeader />);
    const btn = screen.getByRole('button', { name: /collapse sidebar/i });
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });

  it('toggle button has aria-controls=default-sidebar', () => {
    render(<DefaultHeader />);
    const btn = screen.getByRole('button', { name: /collapse sidebar/i });
    expect(btn.getAttribute('aria-controls')).toBe('default-sidebar');
  });

  it('clicking toggle calls toggleSidebar', () => {
    render(<DefaultHeader />);
    const btn = screen.getByRole('button', { name: /collapse sidebar/i });
    fireEvent.click(btn);
    expect(mockToggleSidebar).toHaveBeenCalledOnce();
  });

  it('toggle button has aria-keyshortcuts=Control+b', () => {
    render(<DefaultHeader />);
    const btn = screen.getByRole('button', { name: /collapse sidebar/i });
    expect(btn.getAttribute('aria-keyshortcuts')).toBe('Control+b');
  });
});

// ─── Search ───────────────────────────────────────────────────────────────────

describe('DefaultHeader — search', () => {
  beforeEach(() => {
    mockSidebarOpen = true;
  });

  it('renders a search trigger button', () => {
    render(<DefaultHeader />);
    const btn = screen.getByRole('button', { name: /open search/i });
    expect(btn).toBeDefined();
  });

  it('search trigger has aria-keyshortcuts=Control+k', () => {
    render(<DefaultHeader />);
    const btn = screen.getByRole('button', { name: /open search/i });
    expect(btn.getAttribute('aria-keyshortcuts')).toBe('Control+k');
  });

  it('clicking search trigger opens search overlay', () => {
    render(<DefaultHeader />);
    const btn = screen.getByRole('button', { name: /open search/i });
    fireEvent.click(btn);
    expect(screen.getByRole('dialog', { name: /global search/i })).toBeDefined();
  });

  it('search overlay has an input', () => {
    render(<DefaultHeader />);
    fireEvent.click(screen.getByRole('button', { name: /open search/i }));
    expect(screen.getByRole('searchbox')).toBeDefined();
  });

  it('Ctrl+K keyboard shortcut opens search overlay', () => {
    render(<DefaultHeader />);
    // In production, KeyboardShortcutProvider fires tos:search-open on Ctrl+K.
    // Fire the DOM event directly in this unit test.
    fireEvent(document, new CustomEvent(TOS_SEARCH_OPEN, { bubbles: true }));
    expect(screen.getByRole('dialog', { name: /global search/i })).toBeDefined();
  });

  it('Escape closes the search overlay', () => {
    render(<DefaultHeader />);
    fireEvent.click(screen.getByRole('button', { name: /open search/i }));
    expect(screen.getByRole('dialog', { name: /global search/i })).toBeDefined();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /global search/i })).toBeNull();
  });
});

// ─── Notifications ────────────────────────────────────────────────────────────

describe('DefaultHeader — notifications', () => {
  beforeEach(() => mockSidebarOpen = true);

  it('renders a notifications button', () => {
    render(<DefaultHeader />);
    const btn = screen.getByRole('button', { name: /notifications/i });
    expect(btn).toBeDefined();
  });

  it('notifications button includes unread count in aria-label', () => {
    render(<DefaultHeader />);
    const btn = screen.getByRole('button', { name: /notifications/i });
    const label = btn.getAttribute('aria-label') ?? '';
    // Should mention unread
    expect(label).toMatch(/unread/i);
  });

  it('notifications button has aria-haspopup=dialog', () => {
    render(<DefaultHeader />);
    const btn = screen.getByRole('button', { name: /notifications/i });
    expect(btn.getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('clicking notifications opens the panel', () => {
    render(<DefaultHeader />);
    const btn = screen.getByRole('button', { name: /notifications/i });
    fireEvent.click(btn);
    expect(screen.getByRole('dialog', { name: /notifications/i })).toBeDefined();
  });

  it('notifications button has aria-expanded=false initially', () => {
    render(<DefaultHeader />);
    const btn = screen.getByRole('button', { name: /notifications/i });
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('notifications button has aria-expanded=true when panel is open', () => {
    render(<DefaultHeader />);
    const btn = screen.getByRole('button', { name: /notifications/i });
    fireEvent.click(btn);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });

  it('Escape closes notification panel', () => {
    render(<DefaultHeader />);
    fireEvent.click(screen.getByRole('button', { name: /notifications/i }));
    expect(screen.getByRole('dialog', { name: /notifications/i })).toBeDefined();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /notifications/i })).toBeNull();
  });
});

// ─── User menu ────────────────────────────────────────────────────────────────

describe('DefaultHeader — user menu', () => {
  beforeEach(() => mockSidebarOpen = true);

  it('renders a user menu button', () => {
    render(<DefaultHeader />);
    const btn = screen.getByRole('button', { name: /user menu/i });
    expect(btn).toBeDefined();
  });

  it('user button has aria-haspopup=menu', () => {
    render(<DefaultHeader />);
    const btn = screen.getByRole('button', { name: /user menu/i });
    expect(btn.getAttribute('aria-haspopup')).toBe('menu');
  });

  it('clicking user button opens the dropdown', () => {
    render(<DefaultHeader />);
    const btn = screen.getByRole('button', { name: /user menu/i });
    fireEvent.click(btn);
    expect(screen.getByRole('menu', { name: /user menu/i })).toBeDefined();
  });

  it('user menu contains sign out button', () => {
    render(<DefaultHeader />);
    fireEvent.click(screen.getByRole('button', { name: /user menu/i }));
    const signOut = screen.getByRole('menuitem', { name: /sign out/i });
    expect(signOut).toBeDefined();
  });

  it('user menu contains profile link', () => {
    render(<DefaultHeader />);
    fireEvent.click(screen.getByRole('button', { name: /user menu/i }));
    const profile = screen.getByRole('menuitem', { name: /profile/i });
    expect(profile).toBeDefined();
  });

  it('Escape closes user dropdown', () => {
    render(<DefaultHeader />);
    fireEvent.click(screen.getByRole('button', { name: /user menu/i }));
    expect(screen.getByRole('menu')).toBeDefined();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
  });
});

// ─── Help panel ───────────────────────────────────────────────────────────────

describe('DefaultHeader — help panel', () => {
  beforeEach(() => mockSidebarOpen = true);

  it('renders a help button', () => {
    render(<DefaultHeader />);
    const btn = screen.getByRole('button', { name: /keyboard shortcuts help/i });
    expect(btn).toBeDefined();
  });

  it('clicking help button opens help panel', () => {
    render(<DefaultHeader />);
    fireEvent.click(screen.getByRole('button', { name: /keyboard shortcuts help/i }));
    expect(screen.getByRole('dialog', { name: /keyboard shortcuts help/i })).toBeDefined();
  });

  it('Ctrl+/ opens help panel', () => {
    render(<DefaultHeader />);
    // In production, KeyboardShortcutProvider fires tos:help-open on Ctrl+/.
    // Fire the DOM event directly in this unit test.
    fireEvent(document, new CustomEvent(TOS_HELP_OPEN, { bubbles: true }));
    expect(screen.getByRole('dialog', { name: /keyboard shortcuts help/i })).toBeDefined();
  });

  it('help panel contains shortcut descriptions', () => {
    render(<DefaultHeader />);
    fireEvent.click(screen.getByRole('button', { name: /keyboard shortcuts help/i }));
    // Should show Ctrl+K description
    expect(screen.getByText(/open search/i)).toBeDefined();
  });

  it('Escape closes help panel', async () => {
    render(<DefaultHeader />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /keyboard shortcuts help/i }));
    });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /keyboard shortcuts help/i })).toBeNull();
  });
});
