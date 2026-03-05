import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// Mock constants
vi.mock('@/config/constants', () => ({
  APP_NAME: 'TravelOS',
  APP_VERSION: '1.0.0',
}));

import { DefaultFooter } from './DefaultFooter';

describe('DefaultFooter', () => {
  it('renders a footer element with role=contentinfo', () => {
    render(<DefaultFooter />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeDefined();
  });

  it('renders copyright text with current year', () => {
    render(<DefaultFooter />);
    const year = new Date().getFullYear().toString();
    // Copyright text contains the year
    expect(screen.getByRole('contentinfo').textContent).toContain(year);
  });

  it('renders app name in copyright', () => {
    render(<DefaultFooter />);
    expect(screen.getByRole('contentinfo').textContent).toContain('TravelOS');
  });

  it('renders version number', () => {
    render(<DefaultFooter />);
    expect(screen.getByRole('contentinfo').textContent).toContain('1.0.0');
  });

  it('has aria-label on version', () => {
    render(<DefaultFooter />);
    const version = screen.getByLabelText('Version 1.0.0');
    expect(version).toBeDefined();
  });

  it('renders footer navigation landmark', () => {
    render(<DefaultFooter />);
    const nav = screen.getByRole('navigation', { name: /footer links/i });
    expect(nav).toBeDefined();
  });

  it('renders all required help links', () => {
    render(<DefaultFooter />);
    expect(screen.getByRole('link', { name: /docs/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /support/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /privacy/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /terms/i })).toBeDefined();
  });

  it('links point to correct hrefs', () => {
    render(<DefaultFooter />);
    const docsLink = screen.getByRole('link', { name: /docs/i }) as HTMLAnchorElement;
    expect(docsLink.href).toContain('/docs');
  });

  it('uses a list for footer links', () => {
    render(<DefaultFooter />);
    // The nav should contain a list
    const nav = screen.getByRole('navigation', { name: /footer links/i });
    const list = nav.querySelector('[role="list"]');
    expect(list).toBeDefined();
  });
});
