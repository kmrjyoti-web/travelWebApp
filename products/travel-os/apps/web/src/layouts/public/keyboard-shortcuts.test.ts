import { describe, expect, it } from 'vitest';

import {
  PUBLIC_KEYBOARD_SHORTCUTS,
  PUBLIC_MOBILE_MENU_EVENT,
  PUBLIC_MODIFIER_LABELS,
  formatPublicShortcut,
} from './keyboard-shortcuts';

// ─── PUBLIC_KEYBOARD_SHORTCUTS ────────────────────────────────────────────────

describe('PUBLIC_KEYBOARD_SHORTCUTS', () => {
  it('is a non-empty array', () => {
    expect(PUBLIC_KEYBOARD_SHORTCUTS.length).toBeGreaterThan(0);
  });

  it('every entry has required KeyboardShortcutDef fields', () => {
    for (const s of PUBLIC_KEYBOARD_SHORTCUTS) {
      expect(typeof s.id).toBe('string');
      expect(typeof s.key).toBe('string');
      expect(Array.isArray(s.modifiers)).toBe(true);
      expect(typeof s.description).toBe('string');
      expect(s.scope).toBeDefined();
      expect(typeof s.actionId).toBe('string');
    }
  });

  it('contains openSearch shortcut', () => {
    const s = PUBLIC_KEYBOARD_SHORTCUTS.find((x) => x.id === 'openSearch');
    expect(s).toBeDefined();
  });

  it('openSearch uses Ctrl+K', () => {
    const s = PUBLIC_KEYBOARD_SHORTCUTS.find((x) => x.id === 'openSearch');
    expect(s?.key).toBe('k');
    expect(s?.modifiers).toContain('ctrl');
  });

  it('contains closeMobileMenu shortcut', () => {
    const s = PUBLIC_KEYBOARD_SHORTCUTS.find((x) => x.id === 'closeMobileMenu');
    expect(s).toBeDefined();
  });

  it('closeMobileMenu uses Escape with no modifiers', () => {
    const s = PUBLIC_KEYBOARD_SHORTCUTS.find((x) => x.id === 'closeMobileMenu');
    expect(s?.key).toBe('Escape');
    expect(s?.modifiers).toHaveLength(0);
  });

  it('all scopes are "public"', () => {
    for (const s of PUBLIC_KEYBOARD_SHORTCUTS) {
      expect(s.scope).toBe('public');
    }
  });

  it('ids are unique', () => {
    const ids = PUBLIC_KEYBOARD_SHORTCUTS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ─── PUBLIC_MOBILE_MENU_EVENT ─────────────────────────────────────────────────

describe('PUBLIC_MOBILE_MENU_EVENT', () => {
  it('is a string', () => {
    expect(typeof PUBLIC_MOBILE_MENU_EVENT).toBe('string');
  });

  it('starts with tos:', () => {
    expect(PUBLIC_MOBILE_MENU_EVENT.startsWith('tos:')).toBe(true);
  });

  it('contains "mobile" or "menu"', () => {
    expect(PUBLIC_MOBILE_MENU_EVENT).toMatch(/mobile|menu/i);
  });
});

// ─── PUBLIC_MODIFIER_LABELS ───────────────────────────────────────────────────

describe('PUBLIC_MODIFIER_LABELS', () => {
  it('has label for ctrl', () => {
    expect(typeof PUBLIC_MODIFIER_LABELS.ctrl).toBe('string');
    expect(PUBLIC_MODIFIER_LABELS.ctrl.length).toBeGreaterThan(0);
  });

  it('has label for alt', () => {
    expect(typeof PUBLIC_MODIFIER_LABELS.alt).toBe('string');
  });

  it('has label for shift', () => {
    expect(typeof PUBLIC_MODIFIER_LABELS.shift).toBe('string');
  });

  it('has label for meta', () => {
    expect(typeof PUBLIC_MODIFIER_LABELS.meta).toBe('string');
  });
});

// ─── formatPublicShortcut ─────────────────────────────────────────────────────

describe('formatPublicShortcut', () => {
  it('formats Ctrl+K correctly', () => {
    const result = formatPublicShortcut({ key: 'k', modifiers: ['ctrl'] });
    expect(result).toContain('K');
    expect(result).toContain(PUBLIC_MODIFIER_LABELS.ctrl);
  });

  it('formats Escape (no modifier) as just "Escape"', () => {
    const result = formatPublicShortcut({ key: 'Escape', modifiers: [] });
    expect(result).toBe('Escape');
  });

  it('uppercases single-char keys', () => {
    const result = formatPublicShortcut({ key: 'k', modifiers: [] });
    expect(result).toBe('K');
  });

  it('preserves multi-char key names as-is', () => {
    const result = formatPublicShortcut({ key: 'Enter', modifiers: [] });
    expect(result).toBe('Enter');
  });

  it('includes multiple modifier labels', () => {
    const result = formatPublicShortcut({ key: 'k', modifiers: ['ctrl', 'shift'] });
    expect(result).toContain(PUBLIC_MODIFIER_LABELS.ctrl);
    expect(result).toContain(PUBLIC_MODIFIER_LABELS.shift);
  });
});
