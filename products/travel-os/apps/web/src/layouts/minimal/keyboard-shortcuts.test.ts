import { describe, expect, it } from 'vitest';

import {
  MINIMAL_KEYBOARD_SHORTCUTS,
  MINIMAL_BACK_EVENT,
  MINIMAL_FORWARD_EVENT,
  MINIMAL_MODIFIER_LABELS,
  formatMinimalShortcut,
} from './keyboard-shortcuts';

// ─── MINIMAL_KEYBOARD_SHORTCUTS ───────────────────────────────────────────────

describe('MINIMAL_KEYBOARD_SHORTCUTS', () => {
  it('is a non-empty array', () => {
    expect(MINIMAL_KEYBOARD_SHORTCUTS.length).toBeGreaterThan(0);
  });

  it('every entry has required KeyboardShortcutDef fields', () => {
    for (const s of MINIMAL_KEYBOARD_SHORTCUTS) {
      expect(typeof s.id).toBe('string');
      expect(typeof s.key).toBe('string');
      expect(Array.isArray(s.modifiers)).toBe(true);
      expect(typeof s.description).toBe('string');
      expect(s.scope).toBe('minimal');
      expect(typeof s.actionId).toBe('string');
    }
  });

  it('ids are unique', () => {
    const ids = MINIMAL_KEYBOARD_SHORTCUTS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('contains a goBack shortcut using Escape', () => {
    const esc = MINIMAL_KEYBOARD_SHORTCUTS.find(
      (s) => s.key === 'Escape' && s.actionId === 'goBack',
    );
    expect(esc).toBeDefined();
  });

  it('Escape goBack has no modifiers', () => {
    const esc = MINIMAL_KEYBOARD_SHORTCUTS.find((s) => s.key === 'Escape');
    expect(esc?.modifiers).toHaveLength(0);
  });

  it('contains Alt+ArrowLeft as an alternate goBack', () => {
    const altLeft = MINIMAL_KEYBOARD_SHORTCUTS.find(
      (s) => s.key === 'ArrowLeft' && s.modifiers.includes('alt'),
    );
    expect(altLeft).toBeDefined();
    expect(altLeft?.actionId).toBe('goBack');
  });

  it('contains a goForward shortcut', () => {
    const fwd = MINIMAL_KEYBOARD_SHORTCUTS.find((s) => s.actionId === 'goForward');
    expect(fwd).toBeDefined();
  });

  it('goForward uses Alt+ArrowRight', () => {
    const fwd = MINIMAL_KEYBOARD_SHORTCUTS.find((s) => s.actionId === 'goForward');
    expect(fwd?.key).toBe('ArrowRight');
    expect(fwd?.modifiers).toContain('alt');
  });
});

// ─── Event constants ──────────────────────────────────────────────────────────

describe('MINIMAL_BACK_EVENT', () => {
  it('is a string starting with tos:', () => {
    expect(typeof MINIMAL_BACK_EVENT).toBe('string');
    expect(MINIMAL_BACK_EVENT.startsWith('tos:')).toBe(true);
  });

  it('contains "back" or "min"', () => {
    expect(MINIMAL_BACK_EVENT).toMatch(/back|min/i);
  });
});

describe('MINIMAL_FORWARD_EVENT', () => {
  it('is a string starting with tos:', () => {
    expect(typeof MINIMAL_FORWARD_EVENT).toBe('string');
    expect(MINIMAL_FORWARD_EVENT.startsWith('tos:')).toBe(true);
  });

  it('is different from MINIMAL_BACK_EVENT', () => {
    expect(MINIMAL_FORWARD_EVENT).not.toBe(MINIMAL_BACK_EVENT);
  });
});

// ─── MINIMAL_MODIFIER_LABELS ──────────────────────────────────────────────────

describe('MINIMAL_MODIFIER_LABELS', () => {
  it('has non-empty label for each modifier', () => {
    const modifiers = ['ctrl', 'alt', 'shift', 'meta'] as const;
    for (const mod of modifiers) {
      expect(typeof MINIMAL_MODIFIER_LABELS[mod]).toBe('string');
      expect(MINIMAL_MODIFIER_LABELS[mod].length).toBeGreaterThan(0);
    }
  });
});

// ─── formatMinimalShortcut ────────────────────────────────────────────────────

describe('formatMinimalShortcut', () => {
  it('formats Escape as "Esc"', () => {
    const result = formatMinimalShortcut({ key: 'Escape', modifiers: [] });
    expect(result).toBe('Esc');
  });

  it('formats Alt+ArrowLeft as ⌥← (symbol)', () => {
    const result = formatMinimalShortcut({ key: 'ArrowLeft', modifiers: ['alt'] });
    expect(result).toContain('←');
    expect(result).toContain(MINIMAL_MODIFIER_LABELS.alt);
  });

  it('formats Alt+ArrowRight with → symbol', () => {
    const result = formatMinimalShortcut({ key: 'ArrowRight', modifiers: ['alt'] });
    expect(result).toContain('→');
  });

  it('uppercases single-char keys', () => {
    const result = formatMinimalShortcut({ key: 'k', modifiers: [] });
    expect(result).toBe('K');
  });

  it('keeps multi-char key names (non-arrow) as-is when no symbol map', () => {
    const result = formatMinimalShortcut({ key: 'Tab', modifiers: [] });
    expect(result).toBe('Tab');
  });

  it('formats Enter as ↵', () => {
    const result = formatMinimalShortcut({ key: 'Enter', modifiers: [] });
    expect(result).toBe('↵');
  });

  it('includes multiple modifiers', () => {
    const result = formatMinimalShortcut({ key: 'k', modifiers: ['ctrl', 'shift'] });
    expect(result).toContain(MINIMAL_MODIFIER_LABELS.ctrl);
    expect(result).toContain(MINIMAL_MODIFIER_LABELS.shift);
  });
});
