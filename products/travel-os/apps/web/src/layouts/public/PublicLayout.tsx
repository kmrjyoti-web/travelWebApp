'use client';

import { useEffect } from 'react';

import type { LayoutProps } from '../types';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';
import { applyPublicTheme } from './theme';

/**
 * Public Layout Shell
 *
 * Structure:
 *   <header>  ← sticky, transparent → solid on scroll, marketing nav + CTAs
 *   <main>    ← full-width, no sidebar
 *   <footer>  ← rich: sitemap + social + newsletter
 *
 * No sidebar: public pages are full-width marketing / landing content.
 * Header height is accounted for via CSS var --tos-pub-header-height (72px).
 */
export function PublicLayout({ children }: LayoutProps) {
  // Apply public CSS tokens once on mount
  useEffect(() => {
    applyPublicTheme();
  }, []);

  return (
    <div
      className="tos-pub-layout"
      data-layout="public"
      data-testid="public-layout"
    >
      <PublicHeader />

      <main
        id="public-main"
        className="tos-pub-content"
        tabIndex={-1}
        aria-label="Main content"
        data-testid="public-main"
      >
        {children}
      </main>

      <PublicFooter />
    </div>
  );
}
