// ─── Provider & Hook ───────────────────────────────────────────────────────────
export { LayoutProvider, useLayout, detectLayoutFromPath, applyThemeTokens, matchesShortcut, resolveShortcuts } from './LayoutProvider';

// ─── Registry ──────────────────────────────────────────────────────────────────
export { LAYOUT_REGISTRY, ROUTE_LAYOUT_MAP } from './registry';

// ─── Types ─────────────────────────────────────────────────────────────────────
export type {
  LayoutName,
  ColorScheme,
  Modifier,
  ThemeConfig,
  KeyboardShortcutDef,
  KeyboardShortcut,
  LayoutConfig,
  LayoutProps,
  LayoutRegistryEntry,
  LayoutRegistry,
  LayoutContextValue,
  LayoutProviderProps,
  RouteLayoutEntry,
} from './types';
export { assertNever } from './types';

// ─── Layout Shell Components ───────────────────────────────────────────────────
export { DefaultLayout } from './default';
export { AuthLayout } from './auth';
export { AdminLayout } from './admin';
export { PublicLayout } from './public';
export { MinimalLayout } from './minimal';
