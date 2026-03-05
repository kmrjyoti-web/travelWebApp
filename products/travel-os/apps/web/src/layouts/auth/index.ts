// ─── Layout shell ──────────────────────────────────────────────────────────────
export { AuthLayout } from './AuthLayout';

// ─── Sub-components ────────────────────────────────────────────────────────────
export { AuthHeader } from './AuthHeader';
export { AuthFooter } from './AuthFooter';

// ─── Theme ────────────────────────────────────────────────────────────────────
export { AUTH_THEME_VARS, AUTH_THEME_VALUES, applyAuthTheme } from './theme';
export type { AuthThemeVar } from './theme';

// ─── Keyboard shortcuts ────────────────────────────────────────────────────────
export {
  AUTH_KEYBOARD_SHORTCUTS,
  AUTH_ESCAPE_EVENT,
  AUTH_MODIFIER_LABELS,
  formatAuthShortcut,
} from './keyboard-shortcuts';
