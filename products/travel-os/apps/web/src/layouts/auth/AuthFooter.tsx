'use client';

import Link from 'next/link';
import { APP_NAME, APP_VERSION } from '@/config/constants';

/**
 * AuthFooter — minimal footer for auth pages.
 *
 * Shows:
 *   - Copyright year + app name
 *   - Version (subtle)
 *   - Privacy + Terms links only (essential for auth pages)
 */

interface AuthFooterLink {
  label: string;
  href: string;
}

const AUTH_FOOTER_LINKS: AuthFooterLink[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

export function AuthFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="tos-auth-footer"
      role="contentinfo"
      aria-label="Authentication page footer"
    >
      <div className="tos-auth-footer__inner">
        {/* Copyright */}
        <p className="tos-auth-footer__copy">
          <span aria-hidden>©</span>
          <span className="tos-sr-only">Copyright</span>{' '}
          {year} {APP_NAME}
        </p>

        {/* Version */}
        <p
          className="tos-auth-footer__version"
          aria-label={`Version ${APP_VERSION}`}
        >
          v{APP_VERSION}
        </p>

        {/* Links */}
        <nav aria-label="Legal links" className="tos-auth-footer__nav">
          <ul className="tos-auth-footer__links" role="list">
            {AUTH_FOOTER_LINKS.map((link, idx) => (
              <li key={link.href} className="tos-auth-footer__link-item">
                {idx > 0 && (
                  <span className="tos-auth-footer__separator" aria-hidden>
                    ·
                  </span>
                )}
                <Link href={link.href} className="tos-auth-footer__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
