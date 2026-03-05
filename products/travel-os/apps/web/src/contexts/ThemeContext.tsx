'use client';

/**
 * @file src/contexts/ThemeContext.tsx
 *
 * React context that bridges the Zustand themeStore into the component tree.
 *
 * useThemeContext() returns:
 *   colorMode, productTheme, resolvedColorMode  — current state
 *   setColorMode(mode)       — update + persist color mode
 *   setProductTheme(product) — update + persist product theme
 *   toggleColorMode()        — convenience: flip light ↔ dark
 *   isHydrated               — false until ThemeProvider has resolved OS pref
 */

import { createContext, useContext } from 'react';
import type { ThemeContextValue } from '@/types/theme';

// ─── Context ──────────────────────────────────────────────────────────────────

export const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns the current theme context.
 * Must be rendered inside <ThemeProvider>.
 */
export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeContext must be used inside <ThemeProvider>');
  }
  return ctx;
}
