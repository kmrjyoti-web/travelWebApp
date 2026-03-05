import type { KeyboardShortcutDef } from '../types';

/**
 * Keyboard shortcut definitions for the Admin layout.
 *
 * Navigation shortcuts (Ctrl+U, Ctrl+S, Ctrl+L) are handled locally
 * by AdminLayout via a document keydown listener — not via the global
 * LayoutProvider action system — because they trigger imperative navigation
 * rather than state mutations.
 *
 * Ctrl+B (toggle sidebar) is handled by AdminSidebar, same as Default layout.
 */
export const ADMIN_KEYBOARD_SHORTCUTS: KeyboardShortcutDef[] = [
  {
    id: 'admin:go-users',
    key: 'u',
    modifiers: ['ctrl'],
    description: 'Navigate to Users',
    scope: 'admin',
    actionId: 'goUsers',
  },
  {
    id: 'admin:go-settings',
    key: 's',
    modifiers: ['ctrl'],
    description: 'Navigate to Settings',
    scope: 'admin',
    actionId: 'goSettings',
  },
  {
    id: 'admin:go-logs',
    key: 'l',
    modifiers: ['ctrl'],
    description: 'Navigate to System Logs',
    scope: 'admin',
    actionId: 'goLogs',
  },
  {
    id: 'admin:toggle-sidebar',
    key: 'b',
    modifiers: ['ctrl'],
    description: 'Toggle sidebar',
    scope: 'admin',
    actionId: 'toggleSidebar',
  },
  {
    id: 'admin:search',
    key: 'k',
    modifiers: ['ctrl'],
    description: 'Open search',
    scope: 'admin',
    actionId: 'openSearch',
  },
];

/** Routes for admin navigation shortcuts. */
export const ADMIN_SHORTCUT_ROUTES: Record<string, string> = {
  goUsers:    '/users',
  goSettings: '/settings',
  goLogs:     '/admin/logs',
};

/** Custom DOM event dispatched when an admin shortcut triggers navigation. */
export const ADMIN_NAV_EVENT = 'tos:admin-navigate' as const;

export interface AdminNavEventDetail {
  actionId: string;
  href: string;
}

export const ADMIN_MODIFIER_LABELS: Readonly<Record<string, string>> = {
  ctrl: '⌃',
  alt: '⌥',
  shift: '⇧',
  meta: '⌘',
};

export function formatAdminShortcut(
  shortcut: Pick<KeyboardShortcutDef, 'key' | 'modifiers'>,
): string {
  const mods = shortcut.modifiers.map((m) => ADMIN_MODIFIER_LABELS[m] ?? m).join('');
  const key = shortcut.key.length === 1 ? shortcut.key.toUpperCase() : shortcut.key;
  return `${mods}${key}`;
}
