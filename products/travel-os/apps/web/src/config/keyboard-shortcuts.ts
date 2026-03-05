/**
 * @file src/config/keyboard-shortcuts.ts
 *
 * Canonical shortcut registry for TravelOS.
 *
 * Exports:
 *   GLOBAL_SHORTCUTS_DEF  — always-active shortcuts (Ctrl+K, Ctrl+/, Esc, ?)
 *   DEFAULT_SHORTCUTS_DEF — default-layout shortcuts (Ctrl+B, Ctrl+D, Ctrl+N, g→h, g→s)
 *   ALL_SHORTCUTS_DEF     — merged array for help panel rendering
 *   MODIFIER_LABELS       — ⌃ ⌥ ⇧ ⌘ display labels
 *   KEY_SYMBOLS           — arrow/special key display symbols
 *   formatShortcut()      — human-readable string, e.g. '⌃K'
 *   formatChord()         — human-readable chord, e.g. 'g → H'
 *   groupShortcuts()      — group shortcuts by display group
 *   shortcutKey()         — conflict-detection fingerprint
 *
 * Custom DOM events fired on document:
 *   TOS_SEARCH_OPEN   — Ctrl+K   → consumers open search UI
 *   TOS_HELP_OPEN     — Ctrl+/ or ?  → consumers open help overlay
 *   TOS_SHORTCUT_USED — every execution (analytics)
 */

import type { KeyboardShortcutDef, Modifier } from '@/layouts/types';

// ─── Re-export shared types ───────────────────────────────────────────────────

export type { KeyboardShortcutDef, Modifier };

// ─── Extended shortcut definition ────────────────────────────────────────────

/**
 * Extends KeyboardShortcutDef with chord + group metadata.
 *
 * Chord: pressing `chord` key (e.g. 'g') then `key` (e.g. 'h') within
 * CHORD_TIMEOUT_MS fires the action.  E.g. { chord: 'g', key: 'h' } → g → H
 */
export interface ShortcutDef extends KeyboardShortcutDef {
  /** Lead key for a two-key chord sequence.  Omit for single-key shortcuts. */
  chord?: string;
  /** Display group label for the help panel. */
  group?: string;
}

// ─── Runtime registered shortcut ─────────────────────────────────────────────

/** Full runtime shortcut — `action` replaces the static `actionId`. */
export interface RegisteredShortcut extends Omit<ShortcutDef, 'actionId'> {
  action: () => void;
}

// ─── Chord timing ─────────────────────────────────────────────────────────────

/** Max ms between chord leader and second key. */
export const CHORD_TIMEOUT_MS = 2000;

// ─── DOM events ───────────────────────────────────────────────────────────────

/** Fired on document when Ctrl+K is pressed. */
export const TOS_SEARCH_OPEN   = 'tos:search-open'   as const;
/** Fired on document when Ctrl+/ or ? is pressed. */
export const TOS_HELP_OPEN     = 'tos:help-open'     as const;
/** Fired on document when Settings button is clicked. */
export const TOS_SETTINGS_OPEN = 'tos:settings-open' as const;
/** Fired on document on every shortcut execution (analytics). */
export const TOS_SHORTCUT_USED = 'tos:shortcut-used' as const;

export interface ShortcutUsedDetail {
  id:        string;
  key:       string;
  modifiers: Modifier[];
  chord?:    string;
  scope:     string;
}

// ─── Modifier display labels ──────────────────────────────────────────────────

export const MODIFIER_LABELS: Readonly<Record<Modifier, string>> = {
  ctrl:  '⌃',
  alt:   '⌥',
  shift: '⇧',
  meta:  '⌘',
} as const;

// ─── Key display symbols ──────────────────────────────────────────────────────

export const KEY_SYMBOLS: Readonly<Record<string, string>> = {
  Escape:     'Esc',
  Enter:      '↵',
  Tab:        '⇥',
  Backspace:  '⌫',
  Delete:     '⌦',
  ArrowLeft:  '←',
  ArrowRight: '→',
  ArrowUp:    '↑',
  ArrowDown:  '↓',
  Space:      '␣',
} as const;

// ─── Format helpers ───────────────────────────────────────────────────────────

/**
 * Returns a human-readable shortcut label.
 * @example formatShortcut({ key: 'k', modifiers: ['ctrl'] }) → '⌃K'
 * @example formatShortcut({ key: 'Escape', modifiers: [] })  → 'Esc'
 */
export function formatShortcut(
  def: Pick<ShortcutDef, 'key' | 'modifiers'>,
): string {
  const mods = def.modifiers.map((m) => MODIFIER_LABELS[m] ?? m).join('');
  const key =
    KEY_SYMBOLS[def.key] ??
    (def.key.length === 1 ? def.key.toUpperCase() : def.key);
  return `${mods}${key}`;
}

/**
 * Returns a chord sequence label.
 * @example formatChord({ chord: 'g', key: 'h', modifiers: [] }) → 'g → H'
 * Falls back to formatShortcut() for non-chord shortcuts.
 */
export function formatChord(
  def: Pick<ShortcutDef, 'key' | 'modifiers' | 'chord'>,
): string {
  if (!def.chord) return formatShortcut(def);
  const leader = def.chord.length === 1 ? def.chord.toLowerCase() : def.chord;
  const follow =
    KEY_SYMBOLS[def.key] ??
    (def.key.length === 1 ? def.key.toUpperCase() : def.key);
  return `${leader} → ${follow}`;
}

// ─── Global shortcut definitions ──────────────────────────────────────────────

/** Shortcuts active regardless of which layout is rendered. */
export const GLOBAL_SHORTCUTS_DEF: ShortcutDef[] = [
  {
    id:          'global:search',
    key:         'k',
    modifiers:   ['ctrl'] satisfies Modifier[],
    description: 'Open global search',
    scope:       'global',
    actionId:    'openSearch',
    group:       'Navigation',
  },
  {
    id:          'global:help-slash',
    key:         '/',
    modifiers:   ['ctrl'] satisfies Modifier[],
    description: 'Open keyboard shortcuts help',
    scope:       'global',
    actionId:    'openHelp',
    group:       'Navigation',
  },
  {
    id:          'global:help-question',
    key:         '?',
    modifiers:   [] satisfies Modifier[],
    description: 'Open keyboard shortcuts help',
    scope:       'global',
    actionId:    'openHelp',
    group:       'Navigation',
  },
  {
    id:          'global:close',
    key:         'Escape',
    modifiers:   [] satisfies Modifier[],
    description: 'Close active overlay or panel',
    scope:       'global',
    actionId:    'closeActive',
    group:       'Navigation',
  },
];

// ─── Default layout shortcut definitions ──────────────────────────────────────

/** Shortcuts active in the default / admin layout. */
export const DEFAULT_SHORTCUTS_DEF: ShortcutDef[] = [
  {
    id:          'default:toggle-sidebar',
    key:         'b',
    modifiers:   ['ctrl'] satisfies Modifier[],
    description: 'Toggle sidebar',
    scope:       'default',
    actionId:    'toggleSidebar',
    group:       'Layout',
  },
  {
    id:          'default:dashboard',
    key:         'd',
    modifiers:   ['ctrl'] satisfies Modifier[],
    description: 'Go to dashboard',
    scope:       'default',
    actionId:    'gotoDashboard',
    group:       'Navigation',
  },
  {
    id:          'default:new',
    key:         'n',
    modifiers:   ['ctrl'] satisfies Modifier[],
    description: 'New item (context-sensitive)',
    scope:       'default',
    actionId:    'createNew',
    group:       'Actions',
  },
  {
    id:          'default:goto-home',
    key:         'h',
    modifiers:   [] satisfies Modifier[],
    chord:       'g',
    description: 'Go to home / dashboard',
    scope:       'default',
    actionId:    'gotoHome',
    group:       'Go to',
  },
  {
    id:          'default:goto-settings',
    key:         's',
    modifiers:   [] satisfies Modifier[],
    chord:       'g',
    description: 'Go to settings',
    scope:       'default',
    actionId:    'gotoSettings',
    group:       'Go to',
  },
];

// ─── Combined registry ────────────────────────────────────────────────────────

export const ALL_SHORTCUTS_DEF: ShortcutDef[] = [
  ...GLOBAL_SHORTCUTS_DEF,
  ...DEFAULT_SHORTCUTS_DEF,
];

// ─── Group helpers ────────────────────────────────────────────────────────────

/**
 * Groups shortcuts by their `group` field.
 * Shortcuts without a group appear under 'General'.
 */
export function groupShortcuts<T extends Pick<ShortcutDef, 'group'>>(
  shortcuts: T[],
): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const s of shortcuts) {
    const key = s.group ?? 'General';
    const bucket = map.get(key) ?? [];
    bucket.push(s);
    map.set(key, bucket);
  }
  return map;
}

// ─── Conflict detection fingerprint ──────────────────────────────────────────

/**
 * Returns a stable string key for a shortcut trigger.
 * Used to detect duplicate registrations.
 *
 * @example shortcutKey({ scope:'global', chord:undefined, modifiers:['ctrl'], key:'k' })
 *          → 'global::ctrl:k'
 */
export function shortcutKey(
  def: Pick<ShortcutDef, 'key' | 'modifiers' | 'chord' | 'scope'>,
): string {
  const mods  = [...def.modifiers].sort().join('+');
  const chord = def.chord ? `${def.chord}→` : '';
  return `${def.scope}:${chord}${mods}:${def.key}`;
}
