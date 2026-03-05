'use client';

import { useEffect } from 'react';

import type { LayoutProps } from '../types';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { applyAdminTheme } from './theme';
import {
  ADMIN_KEYBOARD_SHORTCUTS,
  ADMIN_SHORTCUT_ROUTES,
} from './keyboard-shortcuts';

/**
 * Admin Layout Shell
 *
 * Structure:
 *   <header>  ← dark header row + admin toolbar row (sticky)
 *   <div.body>
 *     <aside>  ← 280px admin sidebar (collapsible to 64px icon-only)
 *     <main>   ← dark content area
 *   </div>
 *
 * No footer: admin pages use all available vertical space.
 * Footer component (AdminFooter) exists for optional use in sub-pages.
 *
 * Keyboard shortcuts registered here:
 *   Ctrl+U → /users
 *   Ctrl+S → /settings
 *   Ctrl+L → /admin/logs
 */
export function AdminLayout({ children }: LayoutProps) {
  // Apply admin dark CSS tokens
  useEffect(() => {
    applyAdminTheme();
  }, []);

  // Register Ctrl+U / Ctrl+S / Ctrl+L navigation shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      // Ignore when typing inside an input
      const target = e.target as HTMLElement | null;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable
      ) return;

      if (!e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;

      const matchedShortcut = ADMIN_KEYBOARD_SHORTCUTS.find(
        (s) =>
          s.key.toLowerCase() === e.key.toLowerCase() &&
          s.modifiers.length === 1 &&
          s.modifiers[0] === 'ctrl',
      );

      if (!matchedShortcut) return;

      const href = ADMIN_SHORTCUT_ROUTES[matchedShortcut.actionId];
      if (!href) return;

      e.preventDefault();
      window.location.href = href;
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div
      className="tos-admin-layout"
      data-layout="admin"
      data-testid="admin-layout"
    >
      <AdminHeader />

      <div className="tos-admin-body">
        <AdminSidebar />

        <main
          id="admin-main"
          className="tos-admin-content"
          tabIndex={-1}
          aria-label="Admin main content"
          data-testid="admin-main"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
