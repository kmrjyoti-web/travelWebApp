// ─── Minimal Layout Keyboard Shortcuts ────────────────────────────────────────
//
// Minimal set for focused single-task flows:
//   Escape       → go back / cancel current step
//   Alt+ArrowLeft → go back (browser-standard back gesture)
//   Alt+ArrowRight → go forward (if available)

import type { KeyboardShortcutDef, Modifier } from '../types';

// ─── Shortcut definitions ─────────────────────────────────────────────────────

export const MINIMAL_KEYBOARD_SHORTCUTS: KeyboardShortcutDef[] = [
  {
    id:          'goBack',
    key:         'Escape',
    modifiers:   [] satisfies Modifier[],
    description: 'Go back / cancel current step',
    scope:       'minimal',
    actionId:    'goBack',
  },
  {
    id:          'goBackAlt',
    key:         'ArrowLeft',
    modifiers:   ['alt'] satisfies Modifier[],
    description: 'Go back (Alt + ←)',
    scope:       'minimal',
    actionId:    'goBack',
  },
  {
    id:          'goForward',
    key:         'ArrowRight',
    modifiers:   ['alt'] satisfies Modifier[],
    description: 'Go forward (Alt + →)',
    scope:       'minimal',
    actionId:    'goForward',
  },
];

// ─── Custom DOM events ────────────────────────────────────────────────────────

/** Fired on `document` when the back action is triggered via keyboard. */
export const MINIMAL_BACK_EVENT = 'tos:min-back' as const;

/** Fired on `document` when the forward action is triggered via keyboard. */
export const MINIMAL_FORWARD_EVENT = 'tos:min-forward' as const;

export interface MinimalNavEventDetail {
  /** The actionId that triggered the event. */
  actionId: 'goBack' | 'goForward';
}

// ─── Modifier display labels ──────────────────────────────────────────────────

export const MINIMAL_MODIFIER_LABELS: Record<Modifier, string> = {
  ctrl:  '⌃',
  alt:   '⌥',
  shift: '⇧',
  meta:  '⌘',
};

// ─── Format helper ────────────────────────────────────────────────────────────

/**
 * Returns a human-readable shortcut string, e.g. `⌥←` or `Esc`.
 */
export function formatMinimalShortcut(
  shortcut: Pick<KeyboardShortcutDef, 'key' | 'modifiers'>,
): string {
  const mods = shortcut.modifiers
    .map((m) => MINIMAL_MODIFIER_LABELS[m])
    .join('');

  // Map arrow keys to symbols
  const keyMap: Record<string, string> = {
    ArrowLeft:  '←',
    ArrowRight: '→',
    ArrowUp:    '↑',
    ArrowDown:  '↓',
    Escape:     'Esc',
    Enter:      '↵',
  };
  const key = keyMap[shortcut.key] ?? (
    shortcut.key.length === 1 ? shortcut.key.toUpperCase() : shortcut.key
  );

  return `${mods}${key}`;
}
