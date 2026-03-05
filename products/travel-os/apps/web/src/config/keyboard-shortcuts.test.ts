import { describe, it, expect } from 'vitest';
import {
  GLOBAL_SHORTCUTS_DEF,
  DEFAULT_SHORTCUTS_DEF,
  ALL_SHORTCUTS_DEF,
  MODIFIER_LABELS,
  KEY_SYMBOLS,
  CHORD_TIMEOUT_MS,
  TOS_SEARCH_OPEN,
  TOS_HELP_OPEN,
  TOS_SHORTCUT_USED,
  formatShortcut,
  formatChord,
  groupShortcuts,
  shortcutKey,
} from './keyboard-shortcuts';

// ─── GLOBAL_SHORTCUTS_DEF ─────────────────────────────────────────────────────

describe('GLOBAL_SHORTCUTS_DEF', () => {
  it('is a non-empty array', () => {
    expect(GLOBAL_SHORTCUTS_DEF.length).toBeGreaterThan(0);
  });

  it('every entry has required fields', () => {
    for (const s of GLOBAL_SHORTCUTS_DEF) {
      expect(typeof s.id).toBe('string');
      expect(typeof s.key).toBe('string');
      expect(Array.isArray(s.modifiers)).toBe(true);
      expect(typeof s.description).toBe('string');
      expect(s.scope).toBe('global');
      expect(typeof s.actionId).toBe('string');
    }
  });

  it('ids are unique', () => {
    const ids = GLOBAL_SHORTCUTS_DEF.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('contains Ctrl+K search shortcut', () => {
    const s = GLOBAL_SHORTCUTS_DEF.find((x) => x.id === 'global:search');
    expect(s).toBeDefined();
    expect(s?.key).toBe('k');
    expect(s?.modifiers).toContain('ctrl');
  });

  it('contains Ctrl+/ help shortcut', () => {
    const s = GLOBAL_SHORTCUTS_DEF.find((x) => x.id === 'global:help-slash');
    expect(s).toBeDefined();
    expect(s?.key).toBe('/');
    expect(s?.modifiers).toContain('ctrl');
  });

  it('contains ? help shortcut with no modifiers', () => {
    const s = GLOBAL_SHORTCUTS_DEF.find((x) => x.id === 'global:help-question');
    expect(s).toBeDefined();
    expect(s?.key).toBe('?');
    expect(s?.modifiers).toHaveLength(0);
  });

  it('contains Escape close shortcut', () => {
    const s = GLOBAL_SHORTCUTS_DEF.find((x) => x.id === 'global:close');
    expect(s).toBeDefined();
    expect(s?.key).toBe('Escape');
    expect(s?.modifiers).toHaveLength(0);
  });
});

// ─── DEFAULT_SHORTCUTS_DEF ────────────────────────────────────────────────────

describe('DEFAULT_SHORTCUTS_DEF', () => {
  it('is a non-empty array', () => {
    expect(DEFAULT_SHORTCUTS_DEF.length).toBeGreaterThan(0);
  });

  it('every entry has scope "default"', () => {
    for (const s of DEFAULT_SHORTCUTS_DEF) {
      expect(s.scope).toBe('default');
    }
  });

  it('ids are unique', () => {
    const ids = DEFAULT_SHORTCUTS_DEF.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('contains Ctrl+B toggle sidebar', () => {
    const s = DEFAULT_SHORTCUTS_DEF.find((x) => x.id === 'default:toggle-sidebar');
    expect(s).toBeDefined();
    expect(s?.key).toBe('b');
    expect(s?.modifiers).toContain('ctrl');
  });

  it('contains Ctrl+D dashboard', () => {
    const s = DEFAULT_SHORTCUTS_DEF.find((x) => x.id === 'default:dashboard');
    expect(s?.key).toBe('d');
    expect(s?.modifiers).toContain('ctrl');
  });

  it('contains Ctrl+N new', () => {
    const s = DEFAULT_SHORTCUTS_DEF.find((x) => x.id === 'default:new');
    expect(s?.key).toBe('n');
    expect(s?.modifiers).toContain('ctrl');
  });

  it('contains g→h chord for home', () => {
    const s = DEFAULT_SHORTCUTS_DEF.find((x) => x.id === 'default:goto-home');
    expect(s).toBeDefined();
    expect(s?.chord).toBe('g');
    expect(s?.key).toBe('h');
    expect(s?.modifiers).toHaveLength(0);
  });

  it('contains g→s chord for settings', () => {
    const s = DEFAULT_SHORTCUTS_DEF.find((x) => x.id === 'default:goto-settings');
    expect(s).toBeDefined();
    expect(s?.chord).toBe('g');
    expect(s?.key).toBe('s');
  });
});

// ─── ALL_SHORTCUTS_DEF ────────────────────────────────────────────────────────

describe('ALL_SHORTCUTS_DEF', () => {
  it('contains all global shortcuts', () => {
    for (const s of GLOBAL_SHORTCUTS_DEF) {
      expect(ALL_SHORTCUTS_DEF.some((x) => x.id === s.id)).toBe(true);
    }
  });

  it('contains all default shortcuts', () => {
    for (const s of DEFAULT_SHORTCUTS_DEF) {
      expect(ALL_SHORTCUTS_DEF.some((x) => x.id === s.id)).toBe(true);
    }
  });

  it('ids are globally unique', () => {
    const ids = ALL_SHORTCUTS_DEF.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ─── CHORD_TIMEOUT_MS ─────────────────────────────────────────────────────────

describe('CHORD_TIMEOUT_MS', () => {
  it('is a positive number', () => {
    expect(typeof CHORD_TIMEOUT_MS).toBe('number');
    expect(CHORD_TIMEOUT_MS).toBeGreaterThan(0);
  });
});

// ─── DOM event constants ──────────────────────────────────────────────────────

describe('DOM event constants', () => {
  it('TOS_SEARCH_OPEN starts with tos:', () => {
    expect(TOS_SEARCH_OPEN.startsWith('tos:')).toBe(true);
  });

  it('TOS_HELP_OPEN starts with tos:', () => {
    expect(TOS_HELP_OPEN.startsWith('tos:')).toBe(true);
  });

  it('TOS_SHORTCUT_USED starts with tos:', () => {
    expect(TOS_SHORTCUT_USED.startsWith('tos:')).toBe(true);
  });

  it('all three event names are distinct', () => {
    const names = new Set([TOS_SEARCH_OPEN, TOS_HELP_OPEN, TOS_SHORTCUT_USED]);
    expect(names.size).toBe(3);
  });
});

// ─── MODIFIER_LABELS ─────────────────────────────────────────────────────────

describe('MODIFIER_LABELS', () => {
  const modifiers = ['ctrl', 'alt', 'shift', 'meta'] as const;
  for (const mod of modifiers) {
    it(`has non-empty label for "${mod}"`, () => {
      expect(typeof MODIFIER_LABELS[mod]).toBe('string');
      expect(MODIFIER_LABELS[mod].length).toBeGreaterThan(0);
    });
  }
});

// ─── KEY_SYMBOLS ──────────────────────────────────────────────────────────────

describe('KEY_SYMBOLS', () => {
  it('maps Escape to "Esc"', () => {
    expect(KEY_SYMBOLS['Escape']).toBe('Esc');
  });

  it('maps ArrowLeft to "←"', () => {
    expect(KEY_SYMBOLS['ArrowLeft']).toBe('←');
  });

  it('maps Enter to "↵"', () => {
    expect(KEY_SYMBOLS['Enter']).toBe('↵');
  });
});

// ─── formatShortcut ───────────────────────────────────────────────────────────

describe('formatShortcut', () => {
  it('formats Ctrl+K as ⌃K', () => {
    const result = formatShortcut({ key: 'k', modifiers: ['ctrl'] });
    expect(result).toContain('K');
    expect(result).toContain(MODIFIER_LABELS.ctrl);
  });

  it('formats Escape (no modifier) as "Esc"', () => {
    expect(formatShortcut({ key: 'Escape', modifiers: [] })).toBe('Esc');
  });

  it('uppercases single-char keys', () => {
    expect(formatShortcut({ key: 'b', modifiers: [] })).toBe('B');
  });

  it('preserves multi-char keys not in KEY_SYMBOLS', () => {
    expect(formatShortcut({ key: 'Tab', modifiers: [] })).toBe('Tab');
  });

  it('formats Ctrl+Shift+K with both modifier symbols', () => {
    const result = formatShortcut({ key: 'k', modifiers: ['ctrl', 'shift'] });
    expect(result).toContain(MODIFIER_LABELS.ctrl);
    expect(result).toContain(MODIFIER_LABELS.shift);
    expect(result).toContain('K');
  });

  it('formats ? (no modifier)', () => {
    expect(formatShortcut({ key: '?', modifiers: [] })).toBe('?');
  });
});

// ─── formatChord ──────────────────────────────────────────────────────────────

describe('formatChord', () => {
  it('formats g→h as "g → H"', () => {
    const result = formatChord({ chord: 'g', key: 'h', modifiers: [] });
    expect(result).toBe('g → H');
  });

  it('formats g→s as "g → S"', () => {
    const result = formatChord({ chord: 'g', key: 's', modifiers: [] });
    expect(result).toBe('g → S');
  });

  it('falls back to formatShortcut when no chord', () => {
    const result = formatChord({ key: 'k', modifiers: ['ctrl'] });
    expect(result).toContain('K');
    expect(result).toContain(MODIFIER_LABELS.ctrl);
  });

  it('uses KEY_SYMBOLS for chord target keys', () => {
    const result = formatChord({ chord: 'g', key: 'Escape', modifiers: [] });
    expect(result).toContain('Esc');
  });
});

// ─── groupShortcuts ───────────────────────────────────────────────────────────

describe('groupShortcuts', () => {
  it('returns a Map', () => {
    const result = groupShortcuts(ALL_SHORTCUTS_DEF);
    expect(result).toBeInstanceOf(Map);
  });

  it('all shortcuts appear in some group', () => {
    const result = groupShortcuts(ALL_SHORTCUTS_DEF);
    let total = 0;
    for (const arr of result.values()) total += arr.length;
    expect(total).toBe(ALL_SHORTCUTS_DEF.length);
  });

  it('shortcuts without group appear under "General"', () => {
    const noGroup = [{ id: 'x', key: 'x', modifiers: [], description: '', scope: 'global' as const, actionId: 'x' }];
    const result = groupShortcuts(noGroup);
    expect(result.has('General')).toBe(true);
  });

  it('groups shortcuts with the same group together', () => {
    const result = groupShortcuts(DEFAULT_SHORTCUTS_DEF);
    expect(result.has('Go to')).toBe(true);
    expect((result.get('Go to') ?? []).length).toBeGreaterThanOrEqual(2);
  });
});

// ─── shortcutKey ──────────────────────────────────────────────────────────────

describe('shortcutKey', () => {
  it('returns a string', () => {
    expect(typeof shortcutKey({ key: 'k', modifiers: ['ctrl'], scope: 'global' })).toBe('string');
  });

  it('two identical shortcuts produce the same key', () => {
    const a = shortcutKey({ key: 'k', modifiers: ['ctrl'], scope: 'global' });
    const b = shortcutKey({ key: 'k', modifiers: ['ctrl'], scope: 'global' });
    expect(a).toBe(b);
  });

  it('different keys produce different fingerprints', () => {
    const a = shortcutKey({ key: 'k', modifiers: ['ctrl'], scope: 'global' });
    const b = shortcutKey({ key: 'b', modifiers: ['ctrl'], scope: 'global' });
    expect(a).not.toBe(b);
  });

  it('different scopes produce different fingerprints', () => {
    const a = shortcutKey({ key: 'k', modifiers: ['ctrl'], scope: 'global' });
    const b = shortcutKey({ key: 'k', modifiers: ['ctrl'], scope: 'default' });
    expect(a).not.toBe(b);
  });

  it('chord shortcuts include the leader in the fingerprint', () => {
    const chord = shortcutKey({ key: 'h', modifiers: [], chord: 'g', scope: 'default' });
    const plain  = shortcutKey({ key: 'h', modifiers: [], chord: undefined, scope: 'default' });
    expect(chord).not.toBe(plain);
  });

  it('modifier order does not affect fingerprint', () => {
    const a = shortcutKey({ key: 'k', modifiers: ['ctrl', 'shift'], scope: 'global' });
    const b = shortcutKey({ key: 'k', modifiers: ['shift', 'ctrl'], scope: 'global' });
    expect(a).toBe(b);
  });
});
