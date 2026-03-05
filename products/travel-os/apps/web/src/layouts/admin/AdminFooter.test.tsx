import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/config/constants', () => ({ APP_NAME: 'TravelOS', APP_VERSION: '2.5.0' }));

import { AdminFooter } from './AdminFooter';

// ─── AdminFooter — structure ──────────────────────────────────────────────────

describe('AdminFooter — structure', () => {
  it('renders a contentinfo landmark', () => {
    render(<AdminFooter />);
    expect(screen.getByRole('contentinfo')).toBeDefined();
  });

  it('has data-testid=admin-footer', () => {
    render(<AdminFooter />);
    expect(screen.getByTestId('admin-footer')).toBeDefined();
  });

  it('footer has aria-label mentioning footer', () => {
    render(<AdminFooter />);
    const footer = screen.getByRole('contentinfo');
    expect(footer.getAttribute('aria-label')).toMatch(/footer/i);
  });

  it('has tos-admin-footer class', () => {
    render(<AdminFooter />);
    expect(document.querySelector('.tos-admin-footer')).toBeDefined();
  });

  it('inner wrapper has tos-admin-footer__inner class', () => {
    render(<AdminFooter />);
    expect(document.querySelector('.tos-admin-footer__inner')).toBeDefined();
  });
});

// ─── AdminFooter — copyright ──────────────────────────────────────────────────

describe('AdminFooter — copyright', () => {
  it('renders app name', () => {
    render(<AdminFooter />);
    expect(screen.getByText(/TravelOS/)).toBeDefined();
  });

  it('renders current year', () => {
    render(<AdminFooter />);
    const year = String(new Date().getFullYear());
    const copy = document.querySelector('.tos-admin-footer__copy');
    expect(copy?.textContent).toContain(year);
  });

  it('copyright symbol is aria-hidden', () => {
    render(<AdminFooter />);
    const sym = document.querySelector('[aria-hidden]');
    expect(sym?.textContent).toBe('©');
  });

  it('has screen-reader text "Copyright"', () => {
    render(<AdminFooter />);
    expect(screen.getByText('Copyright')).toBeDefined();
  });
});

// ─── AdminFooter — version ────────────────────────────────────────────────────

describe('AdminFooter — version', () => {
  it('renders version string', () => {
    render(<AdminFooter />);
    expect(screen.getByText(/v2\.5\.0/)).toBeDefined();
  });

  it('version element has tos-admin-footer__version class', () => {
    render(<AdminFooter />);
    expect(document.querySelector('.tos-admin-footer__version')).toBeDefined();
  });

  it('version element has aria-label with Version', () => {
    render(<AdminFooter />);
    const ver = document.querySelector('.tos-admin-footer__version');
    expect(ver?.getAttribute('aria-label')).toMatch(/version/i);
  });

  it('version aria-label contains the version number', () => {
    render(<AdminFooter />);
    const ver = document.querySelector('.tos-admin-footer__version');
    expect(ver?.getAttribute('aria-label')).toContain('2.5.0');
  });
});

// ─── AdminFooter — minimal design ────────────────────────────────────────────

describe('AdminFooter — minimal design', () => {
  it('does not render any nav links (admin footer is minimal)', () => {
    render(<AdminFooter />);
    expect(screen.queryByRole('navigation')).toBeNull();
  });

  it('does not render any anchor tags', () => {
    render(<AdminFooter />);
    expect(document.querySelectorAll('a').length).toBe(0);
  });
});
