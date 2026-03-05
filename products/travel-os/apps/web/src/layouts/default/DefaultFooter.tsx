'use client';

import Link from 'next/link';
import { APP_NAME, APP_VERSION } from '@/config/constants';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FOOTER_LINKS: FooterLink[] = [
  { label: 'Docs', href: '/docs' },
  { label: 'Support', href: '/support' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function DefaultFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="tos-default-footer"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="tos-footer__inner">
        {/* Copyright */}
        <p className="tos-footer__copyright">
          <span aria-hidden>©</span>
          <span className="tos-sr-only">Copyright</span>{' '}
          {year} {APP_NAME}. All rights reserved.
        </p>

        {/* Version */}
        <p className="tos-footer__version" aria-label={`Version ${APP_VERSION}`}>
          v{APP_VERSION}
        </p>

        {/* Help links */}
        <nav aria-label="Footer links" className="tos-footer__nav">
          <ul className="tos-footer__links" role="list">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href} className="tos-footer__link-item">
                {link.external ? (
                  <a
                    href={link.href}
                    className="tos-footer__link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                    <span className="tos-sr-only"> (opens in new tab)</span>
                  </a>
                ) : (
                  <Link href={link.href} className="tos-footer__link">
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
