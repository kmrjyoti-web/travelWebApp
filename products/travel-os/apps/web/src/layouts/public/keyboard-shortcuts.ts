// ─── Public Layout Keyboard Shortcuts ─────────────────────────────────────────
//
// Minimal set — the public site is primarily pointer-driven but provides:
//   Ctrl+K  → open site search
//   Escape  → close mobile menu / any open overlay

import type { KeyboardShortcutDef, Modifier } from '../types';

// ─── Shortcut definitions ─────────────────────────────────────────────────────

export const PUBLIC_KEYBOARD_SHORTCUTS: KeyboardShortcutDef[] = [
  {
    id:          'openSearch',
    key:         'k',
    modifiers:   ['ctrl'] satisfies Modifier[],
    description: 'Open site search',
    scope:       'public',
    actionId:    'openSearch',
  },
  {
    id:          'closeMobileMenu',
    key:         'Escape',
    modifiers:   [] satisfies Modifier[],
    description: 'Close mobile menu or active overlay',
    scope:       'public',
    actionId:    'closeMobileMenu',
  },
];

// ─── Custom DOM events ────────────────────────────────────────────────────────

/** Fired on `document` when the mobile nav open/close state changes. */
export const PUBLIC_MOBILE_MENU_EVENT = 'tos:pub-mobile-menu' as const;

export interface PublicMobileMenuEventDetail {
  open: boolean;
}

// ─── Modifier display labels ──────────────────────────────────────────────────

export const PUBLIC_MODIFIER_LABELS: Record<Modifier, string> = {
  ctrl:  '⌃',
  alt:   '⌥',
  shift: '⇧',
  meta:  '⌘',
};

// ─── Format helper ────────────────────────────────────────────────────────────

/**
 * Formats a shortcut for display, e.g. `{ key: 'k', modifiers: ['ctrl'] }` → "⌃K"
 */
export function formatPublicShortcut(
  shortcut: Pick<KeyboardShortcutDef, 'key' | 'modifiers'>,
): string {
  const mods = shortcut.modifiers
    .map((m) => PUBLIC_MODIFIER_LABELS[m])
    .join('');
  const key = shortcut.key.length === 1
    ? shortcut.key.toUpperCase()
    : shortcut.key;
  return `${mods}${key}`;
}
