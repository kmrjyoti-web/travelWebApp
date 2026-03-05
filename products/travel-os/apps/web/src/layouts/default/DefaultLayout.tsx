'use client';

import { useCallback, useEffect, useState } from 'react';

import { useLayout } from '../LayoutProvider';
import type { LayoutProps } from '../types';

import { DefaultHeader } from './DefaultHeader';
import { DefaultSidebar } from './DefaultSidebar';
import { DefaultFooter } from './DefaultFooter';
import { ThemeSettingsPanel } from './ThemeSettingsPanel';
import { applyDefaultTheme } from './theme';
import { TOS_SETTINGS_OPEN } from '@/config/keyboard-shortcuts';

/**
 * Default Layout Shell
 *
 * Structure:
 *   <header>  ← sticky, full-width
 *   <div.body>
 *     <aside>  ← collapsible sidebar (256px full / 64px icon-only)
 *     <main>   ← scrollable content area
 *   </div>
 *   <footer>
 *
 * Responsive (via CSS + data-sidebar-open attribute):
 *   - Desktop: sidebar 256px open / 64px icon-only when collapsed
 *   - Mobile (<768px): sidebar is an overlay when open, hidden when collapsed
 */
export function DefaultLayout({ children }: LayoutProps) {
  const { sidebarOpen } = useLayout();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  // Apply default layout CSS tokens on mount
  useEffect(() => {
    applyDefaultTheme();
  }, []);

  // Listen for settings-open event from header toolbar
  useEffect(() => {
    const handler = () => setSettingsOpen((prev) => !prev);
    document.addEventListener(TOS_SETTINGS_OPEN, handler);
    return () => document.removeEventListener(TOS_SETTINGS_OPEN, handler);
  }, []);

  return (
    <div
      className="tos-default-layout"
      data-sidebar-open={sidebarOpen}
    >
      <DefaultHeader />

      <div className="tos-default-body">
        <DefaultSidebar />

        <main
          id="main-content"
          className="tos-default-content"
          tabIndex={-1}
          aria-label="Main content"
        >
          {children}
        </main>
      </div>

      <DefaultFooter />

      <ThemeSettingsPanel open={settingsOpen} onClose={closeSettings} />
    </div>
  );
}
