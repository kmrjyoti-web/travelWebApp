/**
 * @file src/stores/themeStore.ts
 *
 * Zustand store for theme state.
 *
 * Responsibilities:
 *   • Track colorMode (light | dark | system)
 *   • Track productTheme (travel-os | food-os | crm-os)
 *   • Derive resolvedColorMode (never 'system' — reads OS preference)
 *   • Hydrate from localStorage on first mount
 *   • Expose setColorMode / setProductTheme
 *
 * Actual DOM mutation (setting data-theme, data-product attributes) is
 * done by ThemeProvider — this store is pure state.
 */

import { create } from 'zustand';
import {
  THEME_STORAGE_KEYS,
  DEFAULT_COLOR_MODE,
  DEFAULT_PRODUCT_THEME,
} from '@/config/theme';
import type {
  ColorMode,
  ProductTheme,
  ResolvedColorMode,
  ThemeStore,
} from '@/types/theme';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function safeLocalStorage(): Storage | null {
  return typeof window !== 'undefined' ? window.localStorage : null;
}

function readSystemScheme(): ResolvedColorMode {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveColorMode(mode: ColorMode): ResolvedColorMode {
  if (mode === 'system') return readSystemScheme();
  return mode;
}

function readPersistedColorMode(): ColorMode {
  try {
    const ls = safeLocalStorage();
    const stored = ls?.getItem(THEME_STORAGE_KEYS.COLOR_MODE);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {
    // ignore
  }
  return DEFAULT_COLOR_MODE;
}

function readPersistedProductTheme(): ProductTheme {
  try {
    const ls = safeLocalStorage();
    const stored = ls?.getItem(THEME_STORAGE_KEYS.PRODUCT_THEME);
    if (stored === 'travel-os' || stored === 'food-os' || stored === 'crm-os') return stored;
  } catch {
    // ignore
  }
  return DEFAULT_PRODUCT_THEME;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useThemeStore = create<ThemeStore>((set) => ({
  colorMode:         DEFAULT_COLOR_MODE,
  productTheme:      DEFAULT_PRODUCT_THEME,
  resolvedColorMode: resolveColorMode(DEFAULT_COLOR_MODE),

  setColorMode(mode: ColorMode) {
    const resolved = resolveColorMode(mode);
    set({ colorMode: mode, resolvedColorMode: resolved });
    try {
      safeLocalStorage()?.setItem(THEME_STORAGE_KEYS.COLOR_MODE, mode);
    } catch {
      // ignore
    }
  },

  setProductTheme(product: ProductTheme) {
    set({ productTheme: product });
    try {
      safeLocalStorage()?.setItem(THEME_STORAGE_KEYS.PRODUCT_THEME, product);
    } catch {
      // ignore
    }
  },

  hydrate() {
    const colorMode    = readPersistedColorMode();
    const productTheme = readPersistedProductTheme();
    const resolved     = resolveColorMode(colorMode);
    set({ colorMode, productTheme, resolvedColorMode: resolved });
  },
}));
