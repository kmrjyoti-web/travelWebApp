// ─── Layout shell ──────────────────────────────────────────────────────────────
export { MinimalLayout } from './MinimalLayout';
export type { MinimalLayoutProps } from './MinimalLayout';

// ─── Sub-components ────────────────────────────────────────────────────────────
export { MinimalHeader } from './MinimalHeader';
export type { MinimalHeaderProps } from './MinimalHeader';

export { MinimalProgress } from './MinimalProgress';
export type { MinimalProgressProps } from './MinimalProgress';

// ─── Theme ────────────────────────────────────────────────────────────────────
export {
  MINIMAL_THEME_VARS,
  MINIMAL_THEME_VALUES,
  applyMinimalTheme,
} from './theme';
export type { MinimalThemeVar } from './theme';

// ─── Keyboard shortcuts ────────────────────────────────────────────────────────
export {
  MINIMAL_KEYBOARD_SHORTCUTS,
  MINIMAL_BACK_EVENT,
  MINIMAL_FORWARD_EVENT,
  MINIMAL_MODIFIER_LABELS,
  formatMinimalShortcut,
} from './keyboard-shortcuts';
export type { MinimalNavEventDetail } from './keyboard-shortcuts';
