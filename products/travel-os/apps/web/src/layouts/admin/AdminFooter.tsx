'use client';

import { APP_NAME, APP_VERSION } from '@/config/constants';

/**
 * AdminFooter — minimal dark status bar.
 *
 * Intentionally lightweight: just a copyright line + version.
 * The admin layout does not render a footer by default (hasFooter: false
 * in LAYOUT_REGISTRY) — but this component exists for optional use in
 * admin sub-pages that need a bottom boundary.
 */
export function AdminFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="tos-admin-footer"
      role="contentinfo"
      aria-label="Admin panel footer"
      data-testid="admin-footer"
    >
      <div className="tos-admin-footer__inner">
        <span className="tos-admin-footer__copy">
          <span aria-hidden>©</span>
          <span className="tos-sr-only">Copyright</span>{' '}
          {year} {APP_NAME}
        </span>
        <span
          className="tos-admin-footer__version"
          aria-label={`Version ${APP_VERSION}`}
        >
          v{APP_VERSION}
        </span>
      </div>
    </footer>
  );
}
