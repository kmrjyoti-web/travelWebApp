'use client';

import Link from 'next/link';
import { APP_NAME } from '@/config/constants';

/**
 * AuthHeader — minimal header for auth pages.
 *
 * Contains only:
 *   - Logo mark (decorative plane icon)
 *   - App name as a link back to the landing page
 *
 * No navigation, no user menu, no search — auth pages are pre-login.
 */
export function AuthHeader() {
  return (
    <header
      className="tos-auth-header"
      role="banner"
      aria-label="Authentication page header"
    >
      {/* Skip to main content — required for keyboard users */}
      <a href="#auth-main" className="tos-skip-link">
        Skip to form
      </a>

      <div className="tos-auth-header__inner">
        <Link
          href="/"
          className="tos-auth-header__brand"
          aria-label={`${APP_NAME} — return to home`}
        >
          {/* Logo mark */}
          <span className="tos-auth-header__logo-mark" aria-hidden>
            <svg
              className="tos-auth-header__logo-svg"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              role="img"
              aria-hidden
            >
              <rect width="32" height="32" rx="8" fill="var(--tos-auth-primary, #1B4F72)" />
              {/* Stylised plane */}
              <path
                d="M7 16 L18 9 L22 11 L14 16 L22 21 L18 23 Z"
                fill="white"
                opacity="0.9"
              />
              <path
                d="M14 16 L16 22 L18 21"
                fill="white"
                opacity="0.7"
              />
            </svg>
          </span>

          {/* Brand name */}
          <span className="tos-auth-header__brand-name">
            {APP_NAME}
          </span>
        </Link>
      </div>
    </header>
  );
}
