'use client';

/**
 * @file src/providers/ThemeProvider.tsx
 *
 * Root theme provider for TravelOS.
 *
 * Responsibilities:
 *   1. Hydrate store from localStorage on first mount.
 *   2. Watch system prefers-color-scheme and update when colorMode='system'.
 *   3. Apply data-theme + data-coreui-theme on <html> when resolvedColorMode changes.
 *   4. Apply data-product on <html> when productTheme changes.
 *   5. Add/remove tos-theme-transitioning class for smooth CSS transitions.
 *   6. Expose everything via ThemeContext.
 *
 * Does NOT import CSS files — those are handled by globals.css + product CSS.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useThemeStore } from '@/stores/themeStore';
import { ThemeContext } from '@/contexts/ThemeContext';
import {
  DATA_THEME_ATTR,
  DATA_COREUI_ATTR,
  DATA_PRODUCT_ATTR,
  THEME_TRANSITION_CLASS,
  THEME_TRANSITION_DURATION_MS,
} from '@/config/theme';
import type { ColorMode, ProductTheme, ThemeContextValue } from '@/types/theme';

// ─── ThemeProvider ────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const store                     = useThemeStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const mediaQueryRef             = useRef<MediaQueryList | null>(null);

  // ── Apply dark / light mode attrs to <html> ────────────────────────────────

  function applyColorMode(dark: boolean) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    root.classList.add(THEME_TRANSITION_CLASS);

    if (dark) {
      root.setAttribute(DATA_THEME_ATTR,  'dark');
      root.setAttribute(DATA_COREUI_ATTR, 'dark');
    } else {
      root.removeAttribute(DATA_THEME_ATTR);
      root.removeAttribute(DATA_COREUI_ATTR);
    }

    setTimeout(() => {
      root.classList.remove(THEME_TRANSITION_CLASS);
    }, THEME_TRANSITION_DURATION_MS);
  }

  // ── Apply product theme attr to <html> ─────────────────────────────────────

  function applyProductTheme(product: ProductTheme) {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute(DATA_PRODUCT_ATTR, product);
  }

  // ── Hydrate from localStorage on mount ─────────────────────────────────────

  useEffect(() => {
    store.hydrate();
    setIsHydrated(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── React to resolvedColorMode changes ─────────────────────────────────────

  useEffect(() => {
    applyColorMode(store.resolvedColorMode === 'dark');
  }, [store.resolvedColorMode]);

  // ── React to productTheme changes ──────────────────────────────────────────

  useEffect(() => {
    applyProductTheme(store.productTheme);
  }, [store.productTheme]);

  // ── Listen for OS prefers-color-scheme while mode is 'system' ─────────────

  useEffect(() => {
    if (store.colorMode !== 'system') {
      if (mediaQueryRef.current) {
        mediaQueryRef.current.removeEventListener('change', handleSystemChange);
        mediaQueryRef.current = null;
      }
      return;
    }

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQueryRef.current = mq;

    function handleSystemChange(e: MediaQueryListEvent) {
      // Re-invoke setColorMode('system') to re-derive resolvedColorMode.
      store.setColorMode('system');
      applyColorMode(e.matches);
    }

    mq.addEventListener('change', handleSystemChange);
    return () => mq.removeEventListener('change', handleSystemChange);
  }, [store.colorMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Context actions ────────────────────────────────────────────────────────

  const setColorMode = useCallback(
    (mode: ColorMode) => store.setColorMode(mode),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const setProductTheme = useCallback(
    (product: ProductTheme) => store.setProductTheme(product),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const toggleColorMode = useCallback(() => {
    const next = store.resolvedColorMode === 'dark' ? 'light' : 'dark';
    store.setColorMode(next);
  }, [store.resolvedColorMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Context value ──────────────────────────────────────────────────────────

  const value: ThemeContextValue = {
    colorMode:         store.colorMode,
    productTheme:      store.productTheme,
    resolvedColorMode: store.resolvedColorMode,
    isHydrated,
    setColorMode,
    setProductTheme,
    toggleColorMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
