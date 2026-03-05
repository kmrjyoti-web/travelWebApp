// ─── Layout shell ──────────────────────────────────────────────────────────────
export { DefaultLayout } from './DefaultLayout';

// ─── Sub-components ────────────────────────────────────────────────────────────
export { DefaultHeader } from './DefaultHeader';
export { DefaultSidebar } from './DefaultSidebar';
export { DefaultFooter } from './DefaultFooter';
export { DefaultBreadcrumb, buildBreadcrumbs } from './DefaultBreadcrumb';
export type { BreadcrumbItem } from './DefaultBreadcrumb';

// ─── Nav data ─────────────────────────────────────────────────────────────────
export { NAV_ITEMS } from './DefaultSidebar';
export type { NavItem } from './DefaultSidebar';

// ─── Theme ────────────────────────────────────────────────────────────────────
export { DEFAULT_THEME_VARS, DEFAULT_THEME_VALUES, applyDefaultTheme } from './theme';
export type { DefaultThemeVar } from './theme';

// ─── Keyboard shortcuts ────────────────────────────────────────────────────────
export {
  DEFAULT_KEYBOARD_SHORTCUTS,
  MODIFIER_LABELS,
  formatShortcut,
} from './keyboard-shortcuts';
