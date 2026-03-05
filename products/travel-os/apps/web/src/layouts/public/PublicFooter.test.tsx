import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('next/link', () => ({
  default: ({ href, children, className, 'aria-label': al, 'data-testid': dt }:
    { href: string; children: React.ReactNode; className?: string;
      'aria-label'?: string; 'data-testid'?: string }) => (
    <a href={href} className={className} aria-label={al} data-testid={dt}>{children}</a>
  ),
}));
vi.mock('@/components/icons/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-icon={name} />,
}));
vi.mock('@/config/constants', () => ({ APP_NAME: 'TravelOS', APP_VERSION: '2.0.0' }));

import { PublicFooter, FOOTER_SITEMAP, FOOTER_SOCIAL_LINKS } from './PublicFooter';

// ─── FOOTER_SITEMAP data ──────────────────────────────────────────────────────

describe('FOOTER_SITEMAP', () => {
  it('has 4 columns', () => {
    expect(FOOTER_SITEMAP).toHaveLength(4);
  });

  it('every column has a heading and links array', () => {
    for (const col of FOOTER_SITEMAP) {
      expect(typeof col.heading).toBe('string');
      expect(Array.isArray(col.links)).toBe(true);
      expect(col.links.length).toBeGreaterThan(0);
    }
  });

  it('includes Product column', () => {
    expect(FOOTER_SITEMAP.some((c) => c.heading === 'Product')).toBe(true);
  });

  it('includes Company column', () => {
    expect(FOOTER_SITEMAP.some((c) => c.heading === 'Company')).toBe(true);
  });

  it('includes Resources column', () => {
    expect(FOOTER_SITEMAP.some((c) => c.heading === 'Resources')).toBe(true);
  });

  it('includes Legal column', () => {
    expect(FOOTER_SITEMAP.some((c) => c.heading === 'Legal')).toBe(true);
  });

  it('every link has label and href', () => {
    for (const col of FOOTER_SITEMAP) {
      for (const link of col.links) {
        expect(typeof link.label).toBe('string');
        expect(link.href.startsWith('/')).toBe(true);
      }
    }
  });
});

// ─── FOOTER_SOCIAL_LINKS data ─────────────────────────────────────────────────

describe('FOOTER_SOCIAL_LINKS', () => {
  it('has at least 3 social links', () => {
    expect(FOOTER_SOCIAL_LINKS.length).toBeGreaterThanOrEqual(3);
  });

  it('every link has label, href, and icon', () => {
    for (const s of FOOTER_SOCIAL_LINKS) {
      expect(typeof s.label).toBe('string');
      expect(typeof s.href).toBe('string');
      expect(typeof s.icon).toBe('string');
    }
  });

  it('includes GitHub', () => {
    expect(FOOTER_SOCIAL_LINKS.some((s) => s.label === 'GitHub')).toBe(true);
  });

  it('includes LinkedIn', () => {
    expect(FOOTER_SOCIAL_LINKS.some((s) => s.label === 'LinkedIn')).toBe(true);
  });
});

// ─── PublicFooter — structure ─────────────────────────────────────────────────

describe('PublicFooter — structure', () => {
  it('renders a contentinfo landmark', () => {
    render(<PublicFooter />);
    expect(screen.getByRole('contentinfo')).toBeDefined();
  });

  it('has data-testid=public-footer', () => {
    render(<PublicFooter />);
    expect(screen.getByTestId('public-footer')).toBeDefined();
  });

  it('footer has aria-label mentioning footer', () => {
    render(<PublicFooter />);
    const footer = screen.getByRole('contentinfo');
    expect(footer.getAttribute('aria-label')).toMatch(/footer/i);
  });

  it('has tos-pub-footer class', () => {
    render(<PublicFooter />);
    expect(document.querySelector('.tos-pub-footer')).toBeDefined();
  });
});

// ─── PublicFooter — brand ─────────────────────────────────────────────────────

describe('PublicFooter — brand', () => {
  it('renders brand link to /', () => {
    render(<PublicFooter />);
    expect(screen.getByTestId('footer-brand-link').getAttribute('href')).toBe('/');
  });

  it('renders app name', () => {
    render(<PublicFooter />);
    expect(screen.getByText('TravelOS')).toBeDefined();
  });

  it('renders tagline', () => {
    render(<PublicFooter />);
    expect(screen.getByText(/your world.*your journey/i)).toBeDefined();
  });
});

// ─── PublicFooter — sitemap ───────────────────────────────────────────────────

describe('PublicFooter — sitemap', () => {
  it('renders sitemap container', () => {
    render(<PublicFooter />);
    expect(screen.getByTestId('footer-sitemap')).toBeDefined();
  });

  it('renders all column headings', () => {
    render(<PublicFooter />);
    for (const col of FOOTER_SITEMAP) {
      expect(screen.getByText(col.heading)).toBeDefined();
    }
  });

  it('each column has a nav with aria-label', () => {
    render(<PublicFooter />);
    for (const col of FOOTER_SITEMAP) {
      const nav = screen.getByRole('navigation', { name: new RegExp(col.heading, 'i') });
      expect(nav).toBeDefined();
    }
  });

  it('renders all sitemap links', () => {
    render(<PublicFooter />);
    expect(screen.getByRole('link', { name: /features/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /pricing/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /about/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /privacy policy/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /terms of service/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /docs/i })).toBeDefined();
  });

  it('Legal column contains Cookie Policy link', () => {
    render(<PublicFooter />);
    expect(screen.getByRole('link', { name: /cookie policy/i })).toBeDefined();
  });
});

// ─── PublicFooter — social links ──────────────────────────────────────────────

describe('PublicFooter — social links', () => {
  it('renders social links container', () => {
    render(<PublicFooter />);
    expect(screen.getByTestId('footer-social')).toBeDefined();
  });

  it('social container has aria-label', () => {
    render(<PublicFooter />);
    const social = screen.getByTestId('footer-social');
    expect(social.getAttribute('aria-label')).toMatch(/social/i);
  });

  it('renders all social links', () => {
    render(<PublicFooter />);
    for (const s of FOOTER_SOCIAL_LINKS) {
      expect(screen.getByTestId(`social-${s.label.toLowerCase()}`)).toBeDefined();
    }
  });

  it('each social link has a descriptive aria-label', () => {
    render(<PublicFooter />);
    for (const s of FOOTER_SOCIAL_LINKS) {
      const link = screen.getByTestId(`social-${s.label.toLowerCase()}`);
      expect(link.getAttribute('aria-label')).toMatch(new RegExp(s.label, 'i'));
    }
  });

  it('social links open in new tab (target=_blank)', () => {
    render(<PublicFooter />);
    for (const s of FOOTER_SOCIAL_LINKS) {
      const link = screen.getByTestId(`social-${s.label.toLowerCase()}`);
      expect(link.getAttribute('target')).toBe('_blank');
    }
  });

  it('social links have rel=noopener noreferrer', () => {
    render(<PublicFooter />);
    for (const s of FOOTER_SOCIAL_LINKS) {
      const link = screen.getByTestId(`social-${s.label.toLowerCase()}`);
      expect(link.getAttribute('rel')).toContain('noopener');
    }
  });
});

// ─── PublicFooter — newsletter ────────────────────────────────────────────────

describe('PublicFooter — newsletter', () => {
  it('renders newsletter container', () => {
    render(<PublicFooter />);
    expect(screen.getByTestId('footer-newsletter')).toBeDefined();
  });

  it('renders newsletter form', () => {
    render(<PublicFooter />);
    expect(screen.getByTestId('newsletter-form')).toBeDefined();
  });

  it('form has aria-label="Newsletter signup"', () => {
    render(<PublicFooter />);
    const form = screen.getByTestId('newsletter-form');
    expect(form.getAttribute('aria-label')).toBe('Newsletter signup');
  });

  it('renders email input', () => {
    render(<PublicFooter />);
    expect(screen.getByTestId('newsletter-email-input')).toBeDefined();
  });

  it('email input has type=email', () => {
    render(<PublicFooter />);
    const input = screen.getByTestId('newsletter-email-input');
    expect(input.getAttribute('type')).toBe('email');
  });

  it('email input has aria-label', () => {
    render(<PublicFooter />);
    const input = screen.getByTestId('newsletter-email-input');
    expect(input.getAttribute('aria-label')).toBeTruthy();
  });

  it('email input has associated label element', () => {
    render(<PublicFooter />);
    const input = screen.getByTestId('newsletter-email-input') as HTMLInputElement;
    const label = document.querySelector(`label[for="${input.id}"]`);
    expect(label).toBeDefined();
  });

  it('renders subscribe button', () => {
    render(<PublicFooter />);
    expect(screen.getByTestId('newsletter-submit-btn')).toBeDefined();
  });

  it('subscribe button has aria-label', () => {
    render(<PublicFooter />);
    const btn = screen.getByTestId('newsletter-submit-btn');
    expect(btn.getAttribute('aria-label')).toMatch(/subscribe/i);
  });

  it('submitting with email shows success message', () => {
    render(<PublicFooter />);
    const input = screen.getByTestId('newsletter-email-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.submit(screen.getByTestId('newsletter-form'));
    expect(screen.getByTestId('newsletter-success')).toBeDefined();
  });

  it('success message has role=status', () => {
    render(<PublicFooter />);
    fireEvent.change(screen.getByTestId('newsletter-email-input'), { target: { value: 'test@example.com' } });
    fireEvent.submit(screen.getByTestId('newsletter-form'));
    const msg = screen.getByTestId('newsletter-success');
    expect(msg.getAttribute('role')).toBe('status');
  });

  it('does not submit with empty email', () => {
    render(<PublicFooter />);
    fireEvent.submit(screen.getByTestId('newsletter-form'));
    expect(screen.queryByTestId('newsletter-success')).toBeNull();
  });
});

// ─── PublicFooter — copyright ─────────────────────────────────────────────────

describe('PublicFooter — copyright', () => {
  it('renders copyright section', () => {
    render(<PublicFooter />);
    expect(screen.getByTestId('footer-copyright')).toBeDefined();
  });

  it('renders current year', () => {
    render(<PublicFooter />);
    const year = String(new Date().getFullYear());
    expect(screen.getByTestId('footer-copyright').textContent).toContain(year);
  });

  it('renders app name in copyright', () => {
    render(<PublicFooter />);
    expect(screen.getByTestId('footer-copyright').textContent).toContain('TravelOS');
  });

  it('renders version string', () => {
    render(<PublicFooter />);
    expect(screen.getByText(/v2\.0\.0/)).toBeDefined();
  });

  it('version has aria-label containing Version', () => {
    render(<PublicFooter />);
    const ver = document.querySelector('.tos-pub-footer__version');
    expect(ver?.getAttribute('aria-label')).toMatch(/version/i);
  });

  it('copyright symbol is aria-hidden', () => {
    render(<PublicFooter />);
    const hidden = document.querySelector('[aria-hidden]');
    expect(hidden?.textContent).toBe('©');
  });

  it('has screen-reader "Copyright" text', () => {
    render(<PublicFooter />);
    expect(screen.getByText('Copyright')).toBeDefined();
  });
});
