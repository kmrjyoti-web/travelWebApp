'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { APP_NAME } from '@/config/constants';
import { Icon } from '@/components/icons/Icon';

// ─── Nav data ─────────────────────────────────────────────────────────────────

export interface PublicNavItem {
  label: string;
  href: string;
}

export const PUBLIC_NAV_ITEMS: PublicNavItem[] = [
  { label: 'Features',     href: '/features' },
  { label: 'Pricing',      href: '/pricing' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'About',        href: '/about' },
  { label: 'Blog',         href: '/blog' },
];

// ─── PublicHeader ─────────────────────────────────────────────────────────────

export function PublicHeader() {
  const pathname     = usePathname() ?? '/';
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  // ── Scroll listener — transparent → solid
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // sync initial position (e.g. hard-refresh mid-page)
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Escape closes mobile menu
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        mobileToggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  // ── Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className="tos-pub-header"
      role="banner"
      aria-label="TravelOS public site header"
      data-testid="public-header"
      data-scrolled={scrolled}
    >
      {/* Skip to main */}
      <a
        href="#public-main"
        className="tos-pub-skip-link"
        tabIndex={0}
      >
        Skip to main content
      </a>

      <div className="tos-pub-header__inner">

        {/* Brand */}
        <Link
          href="/"
          className="tos-pub-header__brand"
          aria-label={`${APP_NAME} — home`}
          data-testid="public-brand-link"
        >
          <span className="tos-pub-header__logo" aria-hidden="true">
            <Icon name="Globe" size={24} />
          </span>
          <span className="tos-pub-header__app-name">{APP_NAME}</span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="tos-pub-header__nav"
          aria-label="Main navigation"
          data-testid="public-main-nav"
        >
          <ul className="tos-pub-header__nav-list" role="list">
            {PUBLIC_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href ||
                               pathname.startsWith(item.href + '/');
              return (
                <li key={item.href} className="tos-pub-header__nav-item">
                  <Link
                    href={item.href}
                    className={[
                      'tos-pub-header__nav-link',
                      isActive ? 'tos-pub-header__nav-link--active' : '',
                    ].join(' ').trim()}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Desktop CTAs */}
        <div className="tos-pub-header__ctas" data-testid="public-header-ctas">
          <Link
            href="/login"
            className="tos-pub-header__cta tos-pub-header__cta--secondary"
            data-testid="pub-signin-btn"
            role="button"
          >
            <Icon name="LogIn" size={16} aria-hidden />
            Sign In
          </Link>
          <Link
            href="/register"
            className="tos-pub-header__cta tos-pub-header__cta--primary"
            data-testid="pub-getstarted-btn"
            role="button"
          >
            <Icon name="Sparkles" size={16} aria-hidden />
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          ref={mobileToggleRef}
          type="button"
          className="tos-pub-header__mobile-toggle"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          aria-controls="pub-mobile-menu"
          data-testid="pub-mobile-toggle"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <Icon name={mobileOpen ? 'X' : 'Menu'} size={22} aria-hidden />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          id="pub-mobile-menu"
          className="tos-pub-header__mobile-menu"
          data-testid="pub-mobile-menu"
        >
          <nav aria-label="Mobile navigation">
            <ul className="tos-pub-header__mobile-nav-list" role="list">
              {PUBLIC_NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href ||
                                 pathname.startsWith(item.href + '/');
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={[
                        'tos-pub-header__mobile-nav-link',
                        isActive ? 'tos-pub-header__mobile-nav-link--active' : '',
                      ].join(' ').trim()}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile CTAs */}
          <div className="tos-pub-header__mobile-ctas">
            <Link
              href="/login"
              className="tos-pub-header__cta tos-pub-header__cta--secondary"
              data-testid="pub-mobile-signin-btn"
              role="button"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="tos-pub-header__cta tos-pub-header__cta--primary"
              data-testid="pub-mobile-getstarted-btn"
              role="button"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
