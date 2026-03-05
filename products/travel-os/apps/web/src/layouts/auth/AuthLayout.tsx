'use client';

import { useEffect } from 'react';
import { APP_NAME } from '@/config/constants';

import type { LayoutProps } from '../types';
import { AuthHeader } from './AuthHeader';
import { AuthFooter } from './AuthFooter';
import { applyAuthTheme } from './theme';
import { AUTH_ESCAPE_EVENT } from './keyboard-shortcuts';

// ─── Illustration Panel ───────────────────────────────────────────────────────

/**
 * Decorative left panel shown only on desktop (≥768px).
 * aria-hidden — purely visual, no interactive elements.
 */
function AuthIllustration() {
  return (
    <div
      className="tos-auth-illustration"
      aria-hidden="true"
      data-testid="auth-illustration"
    >
      <div className="tos-auth-illustration__content">
        {/* Brand mark */}
        <div className="tos-auth-illustration__brand">
          <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            aria-hidden
          >
            <rect width="64" height="64" rx="16" fill="rgba(255,255,255,0.15)" />
            <path
              d="M14 32 L36 18 L44 22 L28 32 L44 42 L36 46 Z"
              fill="white"
              opacity="0.9"
            />
            <path
              d="M28 32 L32 44 L36 42"
              fill="white"
              opacity="0.7"
            />
          </svg>
          <span className="tos-auth-illustration__app-name">{APP_NAME}</span>
        </div>

        {/* Headline */}
        <h2 className="tos-auth-illustration__headline">
          Your World,<br />Your Journey
        </h2>

        {/* Tagline */}
        <p className="tos-auth-illustration__tagline">
          Manage itineraries, bookings, and global DMC networks — all from one intelligent platform.
        </p>

        {/* Feature list */}
        <ul className="tos-auth-illustration__features" role="list">
          {[
            'AI-powered trip building',
            'Real-time availability',
            'Multi-tenant management',
            'Global DMC network',
          ].map((feature) => (
            <li key={feature} className="tos-auth-illustration__feature">
              <span className="tos-auth-illustration__check" aria-hidden>✓</span>
              {feature}
            </li>
          ))}
        </ul>

        {/* Decorative circles */}
        <div className="tos-auth-illustration__decoration" aria-hidden>
          <div className="tos-auth-illustration__circle tos-auth-illustration__circle--1" />
          <div className="tos-auth-illustration__circle tos-auth-illustration__circle--2" />
          <div className="tos-auth-illustration__circle tos-auth-illustration__circle--3" />
        </div>
      </div>
    </div>
  );
}

// ─── AuthLayout ───────────────────────────────────────────────────────────────

/**
 * Auth Layout Shell
 *
 * Desktop (≥768px):   Split screen — illustration left, form card right
 * Mobile (<768px):    Full-width stacked — header → card → footer
 *
 * Keyboard:
 *   - Enter  → native form submission (no layout intervention)
 *   - Tab    → native focus movement (no layout intervention)
 *   - Esc    → dispatches `tos:auth-escape` for form components to clear fields
 */
export function AuthLayout({ children }: LayoutProps) {
  // Apply auth CSS tokens on mount
  useEffect(() => {
    applyAuthTheme();
  }, []);

  // Esc → dispatch custom event for form components to react to
  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        // Only fire if focus is inside a form element
        const target = e.target as HTMLElement | null;
        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target instanceof HTMLSelectElement
        ) {
          e.preventDefault();
          document.dispatchEvent(
            new CustomEvent(AUTH_ESCAPE_EVENT, {
              bubbles: false,
              detail: { target },
            }),
          );
        }
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div
      className="tos-auth-layout"
      data-layout="auth"
    >
      {/* Minimal header — logo only, visible on mobile */}
      <AuthHeader />

      {/* Body — split on desktop, stacked on mobile */}
      <div className="tos-auth-body" role="presentation">
        {/* Left: illustration (hidden on mobile via CSS) */}
        <AuthIllustration />

        {/* Right: form card */}
        <main
          id="auth-main"
          className="tos-auth-panel"
          tabIndex={-1}
          aria-label="Authentication form area"
        >
          <div className="tos-auth-card">
            {children}
          </div>
        </main>
      </div>

      {/* Minimal footer */}
      <AuthFooter />
    </div>
  );
}
