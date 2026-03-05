import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';

// ─── Mock next/navigation ──────────────────────────────────────────────────────

let mockPathname = '/dashboard';

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

// ─── Mock layout modules so loader() returns synchronously ────────────────────

vi.mock('./default/DefaultLayout', () => ({
  DefaultLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="default-layout">{children}</div>
  ),
}));

vi.mock('./auth/AuthLayout', () => ({
  AuthLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-layout">{children}</div>
  ),
}));

vi.mock('./admin/AdminLayout', () => ({
  AdminLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="admin-layout">{children}</div>
  ),
}));

vi.mock('./public/PublicLayout', () => ({
  PublicLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="public-layout">{children}</div>
  ),
}));

vi.mock('./minimal/MinimalLayout', () => ({
  MinimalLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="minimal-layout">{children}</div>
  ),
}));

// ─── Import AFTER mocks ────────────────────────────────────────────────────────

import {
  LayoutProvider,
  useLayout,
  detectLayoutFromPath,
  applyThemeTokens,
  matchesShortcut,
  resolveShortcuts,
} from './LayoutProvider';
import type { KeyboardShortcutDef, RouteLayoutEntry } from './types';

// ─── detectLayoutFromPath ─────────────────────────────────────────────────────

describe('detectLayoutFromPath', () => {
  const routeMap: RouteLayoutEntry[] = [
    { matcher: /^\/login$/, layout: 'auth' },
    { matcher: /^\/admin/, layout: 'admin' },
    { matcher: /.*/, layout: 'default' },
  ];

  it('returns auth for /login', () => {
    expect(detectLayoutFromPath('/login', routeMap)).toBe('auth');
  });

  it('returns admin for /admin/users', () => {
    expect(detectLayoutFromPath('/admin/users', routeMap)).toBe('admin');
  });

  it('returns default for /dashboard (catch-all)', () => {
    expect(detectLayoutFromPath('/dashboard', routeMap)).toBe('default');
  });

  it('returns default when routeMap is empty', () => {
    expect(detectLayoutFromPath('/anything', [])).toBe('default');
  });

  it('uses first-match-wins strategy', () => {
    const map: RouteLayoutEntry[] = [
      { matcher: /^\/.*$/, layout: 'auth' },
      { matcher: /^\/dashboard$/, layout: 'default' },
    ];
    expect(detectLayoutFromPath('/dashboard', map)).toBe('auth');
  });
});

// ─── applyThemeTokens ─────────────────────────────────────────────────────────

describe('applyThemeTokens', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('style');
    document.documentElement.removeAttribute('data-coreui-theme');
  });

  it('sets --tos-primary on :root', () => {
    applyThemeTokens({
      colorScheme: 'light',
      primaryColor: '#ff0000',
      accentColor: '#00ff00',
      sidebarWidth: 260,
      headerHeight: 56,
      borderRadius: 6,
      fontFamily: 'Inter',
    });
    expect(
      document.documentElement.style.getPropertyValue('--tos-primary'),
    ).toBe('#ff0000');
  });

  it('sets --tos-sidebar-width with px suffix', () => {
    applyThemeTokens({
      colorScheme: 'light',
      primaryColor: '#000',
      accentColor: '#111',
      sidebarWidth: 300,
      headerHeight: 56,
      borderRadius: 4,
      fontFamily: 'Inter',
    });
    expect(
      document.documentElement.style.getPropertyValue('--tos-sidebar-width'),
    ).toBe('300px');
  });

  it('sets data-coreui-theme=light for colorScheme light', () => {
    applyThemeTokens({
      colorScheme: 'light',
      primaryColor: '#000',
      accentColor: '#111',
      sidebarWidth: 0,
      headerHeight: 0,
      borderRadius: 0,
      fontFamily: 'Inter',
    });
    expect(document.documentElement.getAttribute('data-coreui-theme')).toBe('light');
  });

  it('sets data-coreui-theme=dark for colorScheme dark', () => {
    applyThemeTokens({
      colorScheme: 'dark',
      primaryColor: '#000',
      accentColor: '#111',
      sidebarWidth: 0,
      headerHeight: 0,
      borderRadius: 0,
      fontFamily: 'Inter',
    });
    expect(document.documentElement.getAttribute('data-coreui-theme')).toBe('dark');
  });
});

// ─── matchesShortcut ─────────────────────────────────────────────────────────

describe('matchesShortcut', () => {
  const makeEvent = (
    key: string,
    modifiers: { ctrlKey?: boolean; altKey?: boolean; shiftKey?: boolean; metaKey?: boolean } = {},
  ): KeyboardEvent =>
    new KeyboardEvent('keydown', {
      key,
      ctrlKey: modifiers.ctrlKey ?? false,
      altKey: modifiers.altKey ?? false,
      shiftKey: modifiers.shiftKey ?? false,
      metaKey: modifiers.metaKey ?? false,
    });

  it('matches Ctrl+B', () => {
    const evt = makeEvent('b', { ctrlKey: true });
    expect(matchesShortcut(evt, { key: 'b', modifiers: ['ctrl'] })).toBe(true);
  });

  it('does not match when modifier is missing', () => {
    const evt = makeEvent('b'); // no ctrl
    expect(matchesShortcut(evt, { key: 'b', modifiers: ['ctrl'] })).toBe(false);
  });

  it('does not match when extra modifier is pressed', () => {
    const evt = makeEvent('b', { ctrlKey: true, shiftKey: true });
    expect(matchesShortcut(evt, { key: 'b', modifiers: ['ctrl'] })).toBe(false);
  });

  it('matches Ctrl+Shift+D', () => {
    const evt = makeEvent('d', { ctrlKey: true, shiftKey: true });
    expect(matchesShortcut(evt, { key: 'd', modifiers: ['ctrl', 'shift'] })).toBe(true);
  });

  it('is case-insensitive for the key', () => {
    const evt = makeEvent('B', { ctrlKey: true });
    expect(matchesShortcut(evt, { key: 'b', modifiers: ['ctrl'] })).toBe(true);
  });

  it('returns false when key does not match', () => {
    const evt = makeEvent('x', { ctrlKey: true });
    expect(matchesShortcut(evt, { key: 'b', modifiers: ['ctrl'] })).toBe(false);
  });

  it('matches shortcut with no modifiers', () => {
    const evt = makeEvent('f');
    expect(matchesShortcut(evt, { key: 'f', modifiers: [] })).toBe(true);
  });
});

// ─── resolveShortcuts ─────────────────────────────────────────────────────────

describe('resolveShortcuts', () => {
  const defs: KeyboardShortcutDef[] = [
    {
      id: 'test:toggle',
      key: 'b',
      modifiers: ['ctrl'],
      description: 'Toggle',
      scope: 'default',
      actionId: 'toggleSidebar',
    },
    {
      id: 'test:unknown',
      key: 'z',
      modifiers: ['ctrl'],
      description: 'Unknown action',
      scope: 'default',
      actionId: 'nonExistentAction',
    },
  ];

  it('resolves known actionIds to functions', () => {
    const fn = vi.fn();
    const shortcuts = resolveShortcuts(defs, { toggleSidebar: fn });
    const resolved = shortcuts.find((s) => s.id === 'test:toggle');
    expect(resolved).toBeDefined();
    resolved?.action();
    expect(fn).toHaveBeenCalledOnce();
  });

  it('skips defs with unknown actionIds', () => {
    const shortcuts = resolveShortcuts(defs, { toggleSidebar: vi.fn() });
    const unknown = shortcuts.find((s) => s.id === 'test:unknown');
    expect(unknown).toBeUndefined();
  });

  it('removes actionId from the runtime shortcut', () => {
    const shortcuts = resolveShortcuts(defs, { toggleSidebar: vi.fn() });
    const resolved = shortcuts.find((s) => s.id === 'test:toggle');
    expect(resolved).not.toHaveProperty('actionId');
  });

  it('returns empty array when actions map is empty', () => {
    const shortcuts = resolveShortcuts(defs, {});
    expect(shortcuts).toHaveLength(0);
  });
});

// ─── useLayout ────────────────────────────────────────────────────────────────

describe('useLayout', () => {
  it('throws when used outside LayoutProvider', () => {
    const Thrower = () => {
      useLayout();
      return null;
    };
    // Suppress React error boundary noise
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Thrower />)).toThrow(
      'useLayout must be used within LayoutProvider',
    );
    consoleError.mockRestore();
  });

  it('returns a context value when inside LayoutProvider', async () => {
    let capturedCtx: ReturnType<typeof useLayout> | null = null;

    const Consumer = () => {
      capturedCtx = useLayout();
      return <div data-testid="consumer">{capturedCtx.layoutName}</div>;
    };

    await act(async () => {
      render(
        <LayoutProvider initialLayout="auth">
          <Consumer />
        </LayoutProvider>,
      );
    });

    expect(capturedCtx).not.toBeNull();
    expect(capturedCtx?.layoutName).toBe('auth');
  });

  it('exposes sidebarOpen and toggleSidebar', async () => {
    let ctx: ReturnType<typeof useLayout> | null = null;

    const Consumer = () => {
      ctx = useLayout();
      return null;
    };

    await act(async () => {
      render(
        <LayoutProvider initialLayout="default">
          <Consumer />
        </LayoutProvider>,
      );
    });

    expect(ctx?.sidebarOpen).toBe(true);
    act(() => ctx?.toggleSidebar());
    expect(ctx?.sidebarOpen).toBe(false);
  });
});

// ─── LayoutProvider — detectLayoutFromPath integration ────────────────────────

describe('LayoutProvider — pathname detection', () => {
  it('detects auth layout for /login pathname', async () => {
    mockPathname = '/login';
    let capturedName: string | null = null;

    const Consumer = () => {
      const { layoutName } = useLayout();
      capturedName = layoutName;
      return null;
    };

    await act(async () => {
      render(
        <LayoutProvider>
          <Consumer />
        </LayoutProvider>,
      );
    });

    expect(capturedName).toBe('auth');
    mockPathname = '/dashboard'; // reset
  });
});

// ─── LayoutProvider — children rendering ──────────────────────────────────────

describe('LayoutProvider — children rendering', () => {
  it('renders children inside the provider', async () => {
    await act(async () => {
      render(
        <LayoutProvider initialLayout="minimal">
          <div data-testid="child">hello</div>
        </LayoutProvider>,
      );
    });

    expect(screen.getByTestId('child')).toBeDefined();
  });
});
