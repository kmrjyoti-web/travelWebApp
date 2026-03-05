import type { ComponentType, ReactNode } from 'react';

// ─── Layout Names ──────────────────────────────────────────────────────────────

export type LayoutName = 'default' | 'auth' | 'admin' | 'public' | 'minimal';

// ─── Theme ─────────────────────────────────────────────────────────────────────

export type ColorScheme = 'light' | 'dark' | 'system';
export type Modifier = 'ctrl' | 'alt' | 'shift' | 'meta';

export interface ThemeConfig {
  colorScheme: ColorScheme;
  primaryColor: string;
  accentColor: string;
  sidebarWidth: number;   // px
  headerHeight: number;   // px
  borderRadius: number;   // px
  fontFamily: string;
}

// ─── Keyboard Shortcuts ────────────────────────────────────────────────────────

/**
 * Static registry definition — no runtime closures.
 * `actionId` is resolved to `action: () => void` by the provider.
 */
export interface KeyboardShortcutDef {
  id: string;
  key: string;
  modifiers: Modifier[];
  description: string;
  scope: LayoutName | 'global';
  actionId: string;
}

/**
 * Runtime shortcut — `action` is the resolved closure.
 */
export interface KeyboardShortcut extends Omit<KeyboardShortcutDef, 'actionId'> {
  action: () => void;
}

// ─── Layout Config ─────────────────────────────────────────────────────────────

export interface LayoutConfig {
  name: LayoutName;
  label: string;
  hasHeader: boolean;
  hasFooter: boolean;
  hasSidebar: boolean;
  theme: ThemeConfig;
  keyboardShortcuts: KeyboardShortcutDef[];
}

// ─── Layout Component Props ────────────────────────────────────────────────────

export interface LayoutProps {
  children: ReactNode;
}

// ─── Registry ──────────────────────────────────────────────────────────────────

export interface LayoutRegistryEntry {
  config: LayoutConfig;
  /** Returns the layout shell component — called once then cached. */
  loader: () => Promise<ComponentType<LayoutProps>>;
}

export type LayoutRegistry = Record<LayoutName, LayoutRegistryEntry>;

// ─── Context ───────────────────────────────────────────────────────────────────

export interface LayoutContextValue {
  layoutName: LayoutName;
  config: LayoutConfig;
  theme: ThemeConfig;
  shortcuts: KeyboardShortcut[];
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setLayout: (name: LayoutName) => void;
}

// ─── Provider Props ────────────────────────────────────────────────────────────

export interface LayoutProviderProps {
  children: ReactNode;
  /** Override auto-detected layout (useful for testing). */
  initialLayout?: LayoutName;
}

// ─── Route Matching ────────────────────────────────────────────────────────────

export interface RouteLayoutEntry {
  matcher: RegExp;
  layout: LayoutName;
}

// ─── Utilities ─────────────────────────────────────────────────────────────────

/** Exhaustiveness helper — use in switch default branches. */
export function assertNever(value: never): never {
  throw new Error(`Unhandled LayoutName: ${String(value)}`);
}
