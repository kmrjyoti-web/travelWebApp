import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('./DefaultHeader', () => ({
  DefaultHeader: () => <header data-testid="mock-header" role="banner" />,
}));

vi.mock('./DefaultSidebar', () => ({
  DefaultSidebar: () => (
    <aside
      data-testid="mock-sidebar"
      id="default-sidebar"
      aria-label="Main navigation"
    />
  ),
}));

vi.mock('./DefaultFooter', () => ({
  DefaultFooter: () => <footer data-testid="mock-footer" role="contentinfo" />,
}));

vi.mock('./theme', () => ({
  applyDefaultTheme: vi.fn(),
}));

vi.mock('../LayoutProvider', () => ({
  useLayout: () => ({
    sidebarOpen: true,
    setSidebarOpen: vi.fn(),
    toggleSidebar: vi.fn(),
    layoutName: 'default',
    config: { name: 'default', label: 'Default', hasHeader: true, hasFooter: true, hasSidebar: true, theme: {}, keyboardShortcuts: [] },
    theme: {},
    shortcuts: [],
    setLayout: vi.fn(),
  }),
}));

import { DefaultLayout } from './DefaultLayout';
import { applyDefaultTheme } from './theme';

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('DefaultLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all four layout regions', async () => {
    await act(async () => {
      render(<DefaultLayout>Page content</DefaultLayout>);
    });

    expect(screen.getByTestId('mock-header')).toBeDefined();
    expect(screen.getByTestId('mock-sidebar')).toBeDefined();
    expect(screen.getByRole('main')).toBeDefined();
    expect(screen.getByTestId('mock-footer')).toBeDefined();
  });

  it('renders children inside main', async () => {
    await act(async () => {
      render(<DefaultLayout><div>Hello world</div></DefaultLayout>);
    });
    const main = screen.getByRole('main');
    expect(main.textContent).toContain('Hello world');
  });

  it('main element has id=main-content for skip link', async () => {
    await act(async () => {
      render(<DefaultLayout>Content</DefaultLayout>);
    });
    const main = document.getElementById('main-content');
    expect(main).toBeDefined();
    expect(main?.tagName.toLowerCase()).toBe('main');
  });

  it('main has tabIndex=-1 for skip link focus', async () => {
    await act(async () => {
      render(<DefaultLayout>Content</DefaultLayout>);
    });
    const main = screen.getByRole('main');
    expect(main.getAttribute('tabindex')).toBe('-1');
  });

  it('main has aria-label=Main content', async () => {
    await act(async () => {
      render(<DefaultLayout>Content</DefaultLayout>);
    });
    const main = screen.getByRole('main', { name: /main content/i });
    expect(main).toBeDefined();
  });

  it('root div has data-sidebar-open attribute', async () => {
    await act(async () => {
      render(<DefaultLayout>Content</DefaultLayout>);
    });
    const root = document.querySelector('.tos-default-layout');
    expect(root?.getAttribute('data-sidebar-open')).toBe('true');
  });

  it('calls applyDefaultTheme on mount', async () => {
    await act(async () => {
      render(<DefaultLayout>Content</DefaultLayout>);
    });
    expect(applyDefaultTheme).toHaveBeenCalledOnce();
  });

  it('renders with data-sidebar-open=false when sidebar is closed', async () => {
    // Override the mock for this test
    const { useLayout } = await import('../LayoutProvider');
    vi.mocked(useLayout).mockReturnValue({
      sidebarOpen: false,
      setSidebarOpen: vi.fn(),
      toggleSidebar: vi.fn(),
      layoutName: 'default',
      config: { name: 'default', label: 'Default', hasHeader: true, hasFooter: true, hasSidebar: true, theme: { colorScheme: 'light', primaryColor: '', accentColor: '', sidebarWidth: 256, headerHeight: 56, borderRadius: 6, fontFamily: '' }, keyboardShortcuts: [] },
      theme: { colorScheme: 'light', primaryColor: '', accentColor: '', sidebarWidth: 256, headerHeight: 56, borderRadius: 6, fontFamily: '' },
      shortcuts: [],
      setLayout: vi.fn(),
    });

    await act(async () => {
      render(<DefaultLayout>Content</DefaultLayout>);
    });
    const root = document.querySelector('.tos-default-layout');
    expect(root?.getAttribute('data-sidebar-open')).toBe('false');
  });
});
