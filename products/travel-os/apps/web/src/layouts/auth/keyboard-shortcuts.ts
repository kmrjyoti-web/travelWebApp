import type { KeyboardShortcutDef } from '../types';

/**
 * Keyboard shortcuts for the Auth layout.
 *
 * Most auth shortcuts are browser-native (Tab, Shift+Tab, Enter).
 * This file documents them alongside the custom Esc handler so the
 * help UI and tests have a single source of truth.
 *
 * Custom event: `tos:auth-escape`
 *   Dispatched on `document` when Esc is pressed inside the auth layout.
 *   Auth form components (LoginForm, RegisterForm, etc.) listen for this
 *   event to clear their fields.
 */
export const AUTH_KEYBOARD_SHORTCUTS: KeyboardShortcutDef[] = [
  {
    id: 'auth:submit',
    key: 'Enter',
    modifiers: [],
    description: 'Submit the current form',
    scope: 'auth',
    // Browser-native — no action needed from the layout layer.
    // Individual <form> elements handle Enter submission natively.
    actionId: 'native',
  },
  {
    id: 'auth:next-field',
    key: 'Tab',
    modifiers: [],
    description: 'Move focus to the next field',
    scope: 'auth',
    actionId: 'native',
  },
  {
    id: 'auth:prev-field',
    key: 'Tab',
    modifiers: ['shift'],
    description: 'Move focus to the previous field',
    scope: 'auth',
    actionId: 'native',
  },
  {
    id: 'auth:clear',
    key: 'Escape',
    modifiers: [],
    description: 'Clear the current field or cancel',
    scope: 'auth',
    actionId: 'authClear',
  },
];

/** Custom DOM event name dispatched when Esc is pressed in the auth layout. */
export const AUTH_ESCAPE_EVENT = 'tos:auth-escape' as const;

/**
 * Human-readable labels for modifier keys (same as default layout — shared util).
 */
export const AUTH_MODIFIER_LABELS: Readonly<Record<string, string>> = {
  ctrl: '⌃',
  alt: '⌥',
  shift: '⇧',
  meta: '⌘',
};

/** Format a shortcut for display. E.g. { key: 'Enter', modifiers: [] } → 'Enter' */
export function formatAuthShortcut(
  shortcut: Pick<KeyboardShortcutDef, 'key' | 'modifiers'>,
): string {
  const mods = shortcut.modifiers
    .map((m) => AUTH_MODIFIER_LABELS[m] ?? m)
    .join('');
  const key = shortcut.key.length === 1 ? shortcut.key.toUpperCase() : shortcut.key;
  return mods ? `${mods}${key}` : key;
}
