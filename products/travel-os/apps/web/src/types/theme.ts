/**
 * @file src/types/theme.ts
 *
 * Theme system type definitions for TravelOS.
 *
 * Three orthogonal axes:
 *   1. ColorMode    — light | dark | system
 *   2. ProductTheme — travel-os | food-os | crm-os
 *   3. ResolvedColorMode — the actual mode after system detection (light | dark)
 */

// ─── Color mode ───────────────────────────────────────────────────────────────

/** User preference for color scheme. 'system' follows OS setting. */
export type ColorMode = 'light' | 'dark' | 'system';

/** The mode actually applied to the document (never 'system'). */
export type ResolvedColorMode = 'light' | 'dark';

// ─── Product theme ────────────────────────────────────────────────────────────

/** Which product palette to apply. */
export type ProductTheme = 'travel-os' | 'food-os' | 'crm-os';

// ─── Legacy alias ─────────────────────────────────────────────────────────────

/** @deprecated Use ColorMode instead */
export type ThemeMode = ColorMode;

// ─── Token snapshot ───────────────────────────────────────────────────────────

/** Minimal token snapshot (legacy — kept for backwards compat). */
export interface ThemeTokens {
  headerBg: string;
  sidebarBg: string;
  accentColor: string;
  iconColor: string;
  sidebarText: string;
}

// ─── Theme state ──────────────────────────────────────────────────────────────

/** Shape of the persisted + reactive theme state. */
export interface ThemeState {
  /** User preference. May be 'system'. */
  colorMode: ColorMode;
  /** Which product palette is active. */
  productTheme: ProductTheme;
  /** Derived — the mode actually rendered (light | dark). */
  resolvedColorMode: ResolvedColorMode;
}

// ─── Theme store actions ──────────────────────────────────────────────────────

export interface ThemeActions {
  setColorMode(mode: ColorMode): void;
  setProductTheme(product: ProductTheme): void;
  /** Read persisted prefs from localStorage and OS setting. */
  hydrate(): void;
}

export type ThemeStore = ThemeState & ThemeActions;

// ─── Theme context value ──────────────────────────────────────────────────────

/** Value exposed via ThemeContext. */
export interface ThemeContextValue extends ThemeState {
  setColorMode(mode: ColorMode): void;
  setProductTheme(product: ProductTheme): void;
  /** Convenience alias: toggles between light ↔ dark (ignores 'system'). */
  toggleColorMode(): void;
  /** true while the ThemeProvider hasn't resolved the OS preference yet. */
  isHydrated: boolean;
}

// ─── Product theme config ─────────────────────────────────────────────────────

/** Per-product color palette reference (used in config/theme.ts). */
export interface ProductThemeConfig {
  name: string;
  primaryColor: string;
  accentColor: string;
  secondaryColor: string;
  /** CSS file name to apply (loaded via globals.css import strategy). */
  cssFile: string;
  /** data-product attribute value set on <html>. */
  dataAttribute: ProductTheme;
}
