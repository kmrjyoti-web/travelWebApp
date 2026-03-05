import { describe, expect, it, beforeEach } from 'vitest';

import {
  PUBLIC_THEME_VARS,
  PUBLIC_THEME_VALUES,
  applyPublicTheme,
} from './theme';
import type { PublicThemeVar } from './theme';

// ─── PUBLIC_THEME_VARS ────────────────────────────────────────────────────────

describe('PUBLIC_THEME_VARS', () => {
  it('is a non-empty object', () => {
    expect(Object.keys(PUBLIC_THEME_VARS).length).toBeGreaterThan(0);
  });

  it('every key starts with --tos-pub-', () => {
    for (const key of Object.keys(PUBLIC_THEME_VARS)) {
      expect(key.startsWith('--tos-pub-')).toBe(true);
    }
  });

  it('every value equals its own key (identity map)', () => {
    for (const [k, v] of Object.entries(PUBLIC_THEME_VARS)) {
      expect(v).toBe(k);
    }
  });

  it('contains --tos-pub-header-bg', () => {
    expect('--tos-pub-header-bg' in PUBLIC_THEME_VARS).toBe(true);
  });

  it('contains --tos-pub-footer-bg', () => {
    expect('--tos-pub-footer-bg' in PUBLIC_THEME_VARS).toBe(true);
  });

  it('contains --tos-pub-primary', () => {
    expect('--tos-pub-primary' in PUBLIC_THEME_VARS).toBe(true);
  });
});

// ─── PUBLIC_THEME_VALUES ──────────────────────────────────────────────────────

describe('PUBLIC_THEME_VALUES', () => {
  it('has the same keys as PUBLIC_THEME_VARS', () => {
    const varKeys = Object.keys(PUBLIC_THEME_VARS).sort();
    const valKeys = Object.keys(PUBLIC_THEME_VALUES).sort();
    expect(varKeys).toEqual(valKeys);
  });

  it('every value is a non-empty string', () => {
    for (const val of Object.values(PUBLIC_THEME_VALUES)) {
      expect(typeof val).toBe('string');
      expect(val.length).toBeGreaterThan(0);
    }
  });

  it('header-bg starts as transparent', () => {
    const val = PUBLIC_THEME_VALUES['--tos-pub-header-bg' as PublicThemeVar];
    expect(val).toBe('transparent');
  });

  it('header-bg-scrolled is a solid colour', () => {
    const val = PUBLIC_THEME_VALUES['--tos-pub-header-bg-scrolled' as PublicThemeVar];
    expect(val).toMatch(/^#/);
  });

  it('footer-bg is a dark colour', () => {
    // Dark footer: luminance < mid-range — we just verify it starts with #0
    const val = PUBLIC_THEME_VALUES['--tos-pub-footer-bg' as PublicThemeVar];
    expect(val).toMatch(/^#0/);
  });

  it('primary colour is the TravelOS blue', () => {
    const val = PUBLIC_THEME_VALUES['--tos-pub-primary' as PublicThemeVar];
    expect(val.toLowerCase()).toBe('#1b4f72');
  });

  it('font-size-base is 1rem', () => {
    const val = PUBLIC_THEME_VALUES['--tos-pub-font-size-base' as PublicThemeVar];
    expect(val).toBe('1rem');
  });

  it('header height has px unit', () => {
    const val = PUBLIC_THEME_VALUES['--tos-pub-header-height' as PublicThemeVar];
    expect(val).toMatch(/px$/);
  });
});

// ─── applyPublicTheme ─────────────────────────────────────────────────────────

describe('applyPublicTheme', () => {
  beforeEach(() => {
    // Clear any previously set properties
    const root = document.documentElement;
    for (const prop of Object.keys(PUBLIC_THEME_VARS)) {
      root.style.removeProperty(prop);
    }
  });

  it('sets CSS custom properties on document.documentElement', () => {
    applyPublicTheme();
    const root = document.documentElement;
    const val = root.style.getPropertyValue('--tos-pub-primary');
    expect(val).toBe('#1B4F72');
  });

  it('sets all theme vars', () => {
    applyPublicTheme();
    const root = document.documentElement;
    for (const prop of Object.keys(PUBLIC_THEME_VARS)) {
      const val = root.style.getPropertyValue(prop);
      expect(val.length).toBeGreaterThan(0);
    }
  });

  it('sets --tos-pub-header-bg to transparent', () => {
    applyPublicTheme();
    const val = document.documentElement.style.getPropertyValue('--tos-pub-header-bg');
    expect(val).toBe('transparent');
  });

  it('is idempotent — calling twice does not throw', () => {
    expect(() => {
      applyPublicTheme();
      applyPublicTheme();
    }).not.toThrow();
  });
});
