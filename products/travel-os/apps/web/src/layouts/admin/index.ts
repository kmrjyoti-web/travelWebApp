// ─── Layout shell ──────────────────────────────────────────────────────────────
export { AdminLayout } from './AdminLayout';

// ─── Sub-components ────────────────────────────────────────────────────────────
export { AdminHeader, AdminToolbar } from './AdminHeader';
export { AdminSidebar } from './AdminSidebar';
export { AdminFooter } from './AdminFooter';

// ─── Nav data ─────────────────────────────────────────────────────────────────
export { ADMIN_NAV_ITEMS } from './AdminSidebar';
export type { AdminNavItem } from './AdminSidebar';

// ─── Theme ────────────────────────────────────────────────────────────────────
export {
  ADMIN_THEME_VARS,
  ADMIN_THEME_VALUES,
  applyAdminTheme,
  statusColorVar,
  STATUS_LABELS,
} from './theme';
export type { AdminThemeVar, SystemStatusLevel, SystemStatusItem } from './theme';

// ─── Keyboard shortcuts ────────────────────────────────────────────────────────
export {
  ADMIN_KEYBOARD_SHORTCUTS,
  ADMIN_SHORTCUT_ROUTES,
  ADMIN_NAV_EVENT,
  ADMIN_MODIFIER_LABELS,
  formatAdminShortcut,
} from './keyboard-shortcuts';
export type { AdminNavEventDetail } from './keyboard-shortcuts';
