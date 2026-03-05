import type { KeyboardShortcutDef } from '../types';

/**
 * Keyboard shortcut definitions for the Default layout.
 *
 * Global shortcuts (Ctrl+B) are registered through LayoutProvider's action system.
 * Local shortcuts (Ctrl+K, Ctrl+/, Escape) are handled directly by the components
 * that own the UI state (DefaultHeader for search, etc.), using useEffect keydown
 * listeners. These definitions serve as the canonical documentation and source of
 * truth for help panel rendering.
 */
export const DEFAULT_KEYBOARD_SHORTCUTS: KeyboardShortcutDef[] = [
  {
    id: 'default:search',
    key: 'k',
    modifiers: ['ctrl'],
    description: 'Open global search',
    scope: 'default',
    actionId: 'openSearch',
  },
  {
    id: 'default:toggle-sidebar',
    key: 'b',
    modifiers: ['ctrl'],
    description: 'Toggle sidebar (expand / icon-only)',
    scope: 'default',
    actionId: 'toggleSidebar',
  },
  {
    id: 'default:help',
    key: '/',
    modifiers: ['ctrl'],
    description: 'Open keyboard shortcuts help',
    scope: 'default',
    actionId: 'openHelp',
  },
  {
    id: 'default:close',
    key: 'Escape',
    modifiers: [],
    description: 'Close active overlay or panel',
    scope: 'default',
    actionId: 'closeActive',
  },
];

/**
 * Human-readable labels for modifier keys.
 * Used when rendering shortcut hints in the UI.
 */
export const MODIFIER_LABELS: Readonly<Record<string, string>> = {
  ctrl: '⌃',
  alt: '⌥',
  shift: '⇧',
  meta: '⌘',
};

/** Format a shortcut definition for display. E.g. Ctrl+K → '⌃K' */
export function formatShortcut(
  shortcut: Pick<KeyboardShortcutDef, 'key' | 'modifiers'>,
): string {
  const mods = shortcut.modifiers.map((m) => MODIFIER_LABELS[m] ?? m).join('');
  const key = shortcut.key.length === 1 ? shortcut.key.toUpperCase() : shortcut.key;
  return `${mods}${key}`;
}
