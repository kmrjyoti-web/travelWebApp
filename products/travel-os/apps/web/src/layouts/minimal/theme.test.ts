import { describe, expect, it, beforeEach } from 'vitest';

import {
  MINIMAL_THEME_VARS,
  MINIMAL_THEME_VALUES,
  applyMinimalTheme,
} from './theme';
import type { MinimalThemeVar } from './theme';

// ─── MINIMAL_THEME_VARS ───────────────────────────────────────────────────────

describe('MINIMAL_THEME_VARS', () => {
  it('is a non-empty object', () => {
    expect(Object.keys(MINIMAL_THEME_VARS).length).toBeGreaterThan(0);
  });

  it('every key starts with --tos-min-', () => {
    for (const key of Object.keys(MINIMAL_THEME_VARS)) {
      expect(key.startsWith('--tos-min-')).toBe(true);
    }
  });

  it('every value equals its own key (identity map)', () => {
    for (const [k, v] of Object.entries(MINIMAL_THEME_VARS)) {
      expect(v).toBe(k);
    }
  });

  it('contains --tos-min-bg', () => {
    expect('--tos-min-bg' in MINIMAL_THEME_VARS).toBe(true);
  });

  it('contains --tos-min-header-height', () => {
    expect('--tos-min-header-height' in MINIMAL_THEME_VARS).toBe(true);
  });

  it('contains --tos-min-content-max-width', () => {
    expect('--tos-min-content-max-width' in MINIMAL_THEME_VARS).toBe(true);
  });

  it('contains --tos-min-progress-fill', () => {
    expect('--tos-min-progress-fill' in MINIMAL_THEME_VARS).toBe(true);
  });
});

// ─── MINIMAL_THEME_VALUES ─────────────────────────────────────────────────────

describe('MINIMAL_THEME_VALUES', () => {
  it('has the same keys as MINIMAL_THEME_VARS', () => {
    expect(Object.keys(MINIMAL_THEME_VALUES).sort()).toEqual(
      Object.keys(MINIMAL_THEME_VARS).sort(),
    );
  });

  it('every value is a non-empty string', () => {
    for (const val of Object.values(MINIMAL_THEME_VALUES)) {
      expect(typeof val).toBe('string');
      expect(val.length).toBeGreaterThan(0);
    }
  });

  it('header-height has px unit', () => {
    const val = MINIMAL_THEME_VALUES['--tos-min-header-height' as MinimalThemeVar];
    expect(val).toMatch(/px$/);
  });

  it('content-max-width has px unit', () => {
    const val = MINIMAL_THEME_VALUES['--tos-min-content-max-width' as MinimalThemeVar];
    expect(val).toMatch(/px$/);
  });

  it('content-max-width is ≤ 640px (narrow centred)', () => {
    const val = MINIMAL_THEME_VALUES['--tos-min-content-max-width' as MinimalThemeVar];
    const px = parseInt(val, 10);
    expect(px).toBeLessThanOrEqual(640);
  });

  it('primary colour is the TravelOS blue', () => {
    const val = MINIMAL_THEME_VALUES['--tos-min-primary' as MinimalThemeVar];
    expect(val.toLowerCase()).toBe('#1b4f72');
  });

  it('progress-fill is a hex colour', () => {
    const val = MINIMAL_THEME_VALUES['--tos-min-progress-fill' as MinimalThemeVar];
    expect(val).toMatch(/^#[0-9a-fA-F]{3,6}$/);
  });

  it('progress-track-bg is lighter than progress-fill (track ≠ fill)', () => {
    const track = MINIMAL_THEME_VALUES['--tos-min-progress-track-bg' as MinimalThemeVar];
    const fill  = MINIMAL_THEME_VALUES['--tos-min-progress-fill' as MinimalThemeVar];
    expect(track).not.toBe(fill);
  });

  it('font-size-base is 1rem', () => {
    const val = MINIMAL_THEME_VALUES['--tos-min-font-size-base' as MinimalThemeVar];
    expect(val).toBe('1rem');
  });

  it('progress-height is smaller than header-height', () => {
    const headerVal   = MINIMAL_THEME_VALUES['--tos-min-header-height' as MinimalThemeVar];
    const progressVal = MINIMAL_THEME_VALUES['--tos-min-progress-height' as MinimalThemeVar];
    expect(parseInt(progressVal, 10)).toBeLessThan(parseInt(headerVal, 10));
  });
});

// ─── applyMinimalTheme ────────────────────────────────────────────────────────

describe('applyMinimalTheme', () => {
  beforeEach(() => {
    const root = document.documentElement;
    for (const prop of Object.keys(MINIMAL_THEME_VARS)) {
      root.style.removeProperty(prop);
    }
  });

  it('sets CSS custom properties on document.documentElement', () => {
    applyMinimalTheme();
    const val = document.documentElement.style.getPropertyValue('--tos-min-primary');
    expect(val).toBe('#1B4F72');
  });

  it('sets all theme vars', () => {
    applyMinimalTheme();
    const root = document.documentElement;
    for (const prop of Object.keys(MINIMAL_THEME_VARS)) {
      const val = root.style.getPropertyValue(prop);
      expect(val.length).toBeGreaterThan(0);
    }
  });

  it('sets --tos-min-content-max-width', () => {
    applyMinimalTheme();
    const val = document.documentElement.style.getPropertyValue('--tos-min-content-max-width');
    expect(val).toContain('px');
  });

  it('is idempotent — calling twice does not throw', () => {
    expect(() => {
      applyMinimalTheme();
      applyMinimalTheme();
    }).not.toThrow();
  });
});
