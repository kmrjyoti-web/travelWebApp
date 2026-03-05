import React from 'react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// ─── Mocks ────────────────────────────────────────────────────────────────────

let mockPathname = '/';

vi.mock('next/navigation', () => ({ usePathname: () => mockPathname }));
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
vi.mock('@/config/constants', () => ({ APP_NAME: 'TravelOS' }));

import { PublicHeader, PUBLIC_NAV_ITEMS } from './PublicHeader';

// ─── PUBLIC_NAV_ITEMS ─────────────────────────────────────────────────────────

describe('PUBLIC_NAV_ITEMS', () => {
  it('is a non-empty array', () => {
    expect(PUBLIC_NAV_ITEMS.length).toBeGreaterThan(0);
  });

  it('every item has label and href', () => {
    for (const item of PUBLIC_NAV_ITEMS) {
      expect(typeof item.label).toBe('string');
      expect(typeof item.href).toBe('string');
    }
  });

  it('includes Features', () => {
    expect(PUBLIC_NAV_ITEMS.some((i) => i.label === 'Features')).toBe(true);
  });

  it('includes Pricing', () => {
    expect(PUBLIC_NAV_ITEMS.some((i) => i.label === 'Pricing')).toBe(true);
  });
});

// ─── PublicHeader — structure ─────────────────────────────────────────────────

describe('PublicHeader — structure', () => {
  beforeEach(() => { mockPathname = '/'; });

  it('renders a banner landmark', () => {
    render(<PublicHeader />);
    expect(screen.getByRole('banner')).toBeDefined();
  });

  it('has data-testid=public-header', () => {
    render(<PublicHeader />);
    expect(screen.getByTestId('public-header')).toBeDefined();
  });

  it('has aria-label mentioning TravelOS', () => {
    render(<PublicHeader />);
    const header = screen.getByRole('banner');
    expect(header.getAttribute('aria-label')).toMatch(/travelOS/i);
  });

  it('renders skip link to #public-main', () => {
    render(<PublicHeader />);
    const skip = screen.getByText(/skip to main content/i);
    expect(skip.getAttribute('href')).toBe('#public-main');
  });

  it('renders brand link to /', () => {
    render(<PublicHeader />);
    const brand = screen.getByTestId('public-brand-link');
    expect(brand.getAttribute('href')).toBe('/');
  });

  it('renders app name in brand', () => {
    render(<PublicHeader />);
    expect(screen.getByText('TravelOS')).toBeDefined();
  });
});

// ─── PublicHeader — scroll behaviour ─────────────────────────────────────────

describe('PublicHeader — scroll', () => {
  let originalScrollY: PropertyDescriptor | undefined;

  beforeEach(() => {
    mockPathname = '/';
    originalScrollY = Object.getOwnPropertyDescriptor(window, 'scrollY');
    Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 0 });
  });

  afterEach(() => {
    if (originalScrollY) {
      Object.defineProperty(window, 'scrollY', originalScrollY);
    }
  });

  it('starts with data-scrolled=false when at top', () => {
    render(<PublicHeader />);
    const header = screen.getByTestId('public-header');
    expect(header.getAttribute('data-scrolled')).toBe('false');
  });

  it('sets data-scrolled=true after scroll', () => {
    render(<PublicHeader />);
    Object.defineProperty(window, 'scrollY', { value: 100, configurable: true });
    fireEvent.scroll(window);
    const header = screen.getByTestId('public-header');
    expect(header.getAttribute('data-scrolled')).toBe('true');
  });

  it('resets data-scrolled=false when scrolled back to top', () => {
    render(<PublicHeader />);
    Object.defineProperty(window, 'scrollY', { value: 100, configurable: true });
    fireEvent.scroll(window);
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    fireEvent.scroll(window);
    expect(screen.getByTestId('public-header').getAttribute('data-scrolled')).toBe('false');
  });

  it('removes scroll listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<PublicHeader />);
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    removeSpy.mockRestore();
  });
});

// ─── PublicHeader — desktop nav ───────────────────────────────────────────────

describe('PublicHeader — desktop nav', () => {
  beforeEach(() => { mockPathname = '/'; });

  it('renders main navigation landmark', () => {
    render(<PublicHeader />);
    expect(screen.getByTestId('public-main-nav')).toBeDefined();
  });

  it('nav has aria-label="Main navigation"', () => {
    render(<PublicHeader />);
    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(nav).toBeDefined();
  });

  it('renders all nav links', () => {
    render(<PublicHeader />);
    expect(screen.getByRole('link', { name: /features/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /pricing/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /destinations/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /about/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /blog/i })).toBeDefined();
  });

  it('active nav link has aria-current=page', () => {
    mockPathname = '/features';
    render(<PublicHeader />);
    const link = screen.getByRole('link', { name: /features/i });
    expect(link.getAttribute('aria-current')).toBe('page');
  });

  it('inactive nav links do not have aria-current', () => {
    mockPathname = '/features';
    render(<PublicHeader />);
    const link = screen.getByRole('link', { name: /pricing/i });
    expect(link.getAttribute('aria-current')).toBeNull();
  });

  it('active link has active class', () => {
    mockPathname = '/features';
    render(<PublicHeader />);
    const link = screen.getByRole('link', { name: /features/i });
    expect(link.className).toMatch(/active/);
  });
});

// ─── PublicHeader — CTAs ──────────────────────────────────────────────────────

describe('PublicHeader — CTAs', () => {
  beforeEach(() => { mockPathname = '/'; });

  it('renders Sign In button', () => {
    render(<PublicHeader />);
    expect(screen.getByTestId('pub-signin-btn')).toBeDefined();
  });

  it('Sign In points to /login', () => {
    render(<PublicHeader />);
    expect(screen.getByTestId('pub-signin-btn').getAttribute('href')).toBe('/login');
  });

  it('renders Get Started button', () => {
    render(<PublicHeader />);
    expect(screen.getByTestId('pub-getstarted-btn')).toBeDefined();
  });

  it('Get Started points to /register', () => {
    render(<PublicHeader />);
    expect(screen.getByTestId('pub-getstarted-btn').getAttribute('href')).toBe('/register');
  });

  it('CTA container has data-testid=public-header-ctas', () => {
    render(<PublicHeader />);
    expect(screen.getByTestId('public-header-ctas')).toBeDefined();
  });
});

// ─── PublicHeader — mobile menu ───────────────────────────────────────────────

describe('PublicHeader — mobile menu', () => {
  beforeEach(() => { mockPathname = '/'; });

  it('renders mobile toggle button', () => {
    render(<PublicHeader />);
    expect(screen.getByTestId('pub-mobile-toggle')).toBeDefined();
  });

  it('toggle button aria-expanded=false initially', () => {
    render(<PublicHeader />);
    const btn = screen.getByTestId('pub-mobile-toggle');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('toggle button aria-controls=pub-mobile-menu', () => {
    render(<PublicHeader />);
    const btn = screen.getByTestId('pub-mobile-toggle');
    expect(btn.getAttribute('aria-controls')).toBe('pub-mobile-menu');
  });

  it('clicking toggle opens mobile menu', () => {
    render(<PublicHeader />);
    fireEvent.click(screen.getByTestId('pub-mobile-toggle'));
    expect(screen.getByTestId('pub-mobile-menu')).toBeDefined();
  });

  it('mobile menu shows all nav items', () => {
    render(<PublicHeader />);
    fireEvent.click(screen.getByTestId('pub-mobile-toggle'));
    for (const item of PUBLIC_NAV_ITEMS) {
      const links = screen.getAllByRole('link', { name: new RegExp(item.label, 'i') });
      expect(links.length).toBeGreaterThan(0);
    }
  });

  it('toggle aria-expanded=true when menu open', () => {
    render(<PublicHeader />);
    fireEvent.click(screen.getByTestId('pub-mobile-toggle'));
    expect(screen.getByTestId('pub-mobile-toggle').getAttribute('aria-expanded')).toBe('true');
  });

  it('toggle shows "Close" label when menu is open', () => {
    render(<PublicHeader />);
    fireEvent.click(screen.getByTestId('pub-mobile-toggle'));
    const btn = screen.getByTestId('pub-mobile-toggle');
    expect(btn.getAttribute('aria-label')).toMatch(/close/i);
  });

  it('clicking toggle again closes mobile menu', () => {
    render(<PublicHeader />);
    fireEvent.click(screen.getByTestId('pub-mobile-toggle'));
    fireEvent.click(screen.getByTestId('pub-mobile-toggle'));
    expect(screen.queryByTestId('pub-mobile-menu')).toBeNull();
  });

  it('Escape closes mobile menu', () => {
    render(<PublicHeader />);
    fireEvent.click(screen.getByTestId('pub-mobile-toggle'));
    expect(screen.getByTestId('pub-mobile-menu')).toBeDefined();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('pub-mobile-menu')).toBeNull();
  });

  it('mobile menu contains Sign In link', () => {
    render(<PublicHeader />);
    fireEvent.click(screen.getByTestId('pub-mobile-toggle'));
    expect(screen.getByTestId('pub-mobile-signin-btn')).toBeDefined();
  });

  it('mobile menu contains Get Started link', () => {
    render(<PublicHeader />);
    fireEvent.click(screen.getByTestId('pub-mobile-toggle'));
    expect(screen.getByTestId('pub-mobile-getstarted-btn')).toBeDefined();
  });

  it('mobile menu has a navigation landmark', () => {
    render(<PublicHeader />);
    fireEvent.click(screen.getByTestId('pub-mobile-toggle'));
    const navs = screen.getAllByRole('navigation');
    // At least one nav inside mobile menu
    expect(navs.length).toBeGreaterThanOrEqual(2);
  });
});
