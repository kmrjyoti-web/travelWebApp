import { describe, expect, it } from 'vitest';

import {
  SIZES,
  VARIANTS,
  INTENTS,
  COMPONENT_STATES,
  SIZE_CONFIG,
  VARIANT_CONFIG,
  INTENT_CONFIG,
  isSize,
  isVariant,
  isIntent,
  isComponentState,
} from './types';
import type {
  Size,
  Variant,
  Intent,
  ComponentState,
} from './types';

// ─── SIZES ────────────────────────────────────────────────────────────────────

describe('SIZES', () => {
  it('contains exactly sm, md, lg', () => {
    expect([...SIZES].sort()).toEqual(['lg', 'md', 'sm']);
  });

  it('is ordered sm → md → lg', () => {
    expect(SIZES[0]).toBe('sm');
    expect(SIZES[1]).toBe('md');
    expect(SIZES[2]).toBe('lg');
  });

  it('has 3 entries', () => {
    expect(SIZES).toHaveLength(3);
  });

  it('contains no duplicates', () => {
    expect(new Set(SIZES).size).toBe(SIZES.length);
  });
});

// ─── VARIANTS ─────────────────────────────────────────────────────────────────

describe('VARIANTS', () => {
  it('has 6 entries', () => {
    expect(VARIANTS).toHaveLength(6);
  });

  it('contains no duplicates', () => {
    expect(new Set(VARIANTS).size).toBe(VARIANTS.length);
  });

  it('includes primary', () => {
    expect(VARIANTS).toContain('primary');
  });

  it('includes secondary', () => {
    expect(VARIANTS).toContain('secondary');
  });

  it('includes outline', () => {
    expect(VARIANTS).toContain('outline');
  });

  it('includes ghost', () => {
    expect(VARIANTS).toContain('ghost');
  });

  it('includes destructive', () => {
    expect(VARIANTS).toContain('destructive');
  });

  it('includes link', () => {
    expect(VARIANTS).toContain('link');
  });
});

// ─── INTENTS ──────────────────────────────────────────────────────────────────

describe('INTENTS', () => {
  it('has 5 entries', () => {
    expect(INTENTS).toHaveLength(5);
  });

  it('contains no duplicates', () => {
    expect(new Set(INTENTS).size).toBe(INTENTS.length);
  });

  it('includes default', () => {
    expect(INTENTS).toContain('default');
  });

  it('includes success, warning, error, info', () => {
    expect(INTENTS).toContain('success');
    expect(INTENTS).toContain('warning');
    expect(INTENTS).toContain('error');
    expect(INTENTS).toContain('info');
  });
});

// ─── COMPONENT_STATES ─────────────────────────────────────────────────────────

describe('COMPONENT_STATES', () => {
  it('has 7 entries', () => {
    expect(COMPONENT_STATES).toHaveLength(7);
  });

  it('includes all required states', () => {
    const required: ComponentState[] = [
      'default', 'hover', 'focus', 'active', 'disabled', 'loading', 'error',
    ];
    for (const state of required) {
      expect(COMPONENT_STATES).toContain(state);
    }
  });

  it('contains no duplicates', () => {
    expect(new Set(COMPONENT_STATES).size).toBe(COMPONENT_STATES.length);
  });
});

// ─── SIZE_CONFIG ──────────────────────────────────────────────────────────────

describe('SIZE_CONFIG', () => {
  it('has entries for every Size', () => {
    for (const size of SIZES) {
      expect(SIZE_CONFIG[size]).toBeDefined();
    }
  });

  it('every entry key matches its Size', () => {
    for (const size of SIZES) {
      expect(SIZE_CONFIG[size].key).toBe(size);
    }
  });

  it('every entry has a non-empty label', () => {
    for (const size of SIZES) {
      expect(SIZE_CONFIG[size].label.length).toBeGreaterThan(0);
    }
  });

  it('heights are ascending sm → md → lg', () => {
    expect(SIZE_CONFIG.sm.heightPx).toBeLessThan(SIZE_CONFIG.md.heightPx);
    expect(SIZE_CONFIG.md.heightPx).toBeLessThan(SIZE_CONFIG.lg.heightPx);
  });

  it('icon sizes are ascending sm → md → lg', () => {
    expect(SIZE_CONFIG.sm.iconSizePx).toBeLessThan(SIZE_CONFIG.md.iconSizePx);
    expect(SIZE_CONFIG.md.iconSizePx).toBeLessThan(SIZE_CONFIG.lg.iconSizePx);
  });

  it('sm height is less than 36px', () => {
    expect(SIZE_CONFIG.sm.heightPx).toBeLessThan(36);
  });

  it('lg height is at least 40px', () => {
    expect(SIZE_CONFIG.lg.heightPx).toBeGreaterThanOrEqual(40);
  });
});

// ─── VARIANT_CONFIG ───────────────────────────────────────────────────────────

describe('VARIANT_CONFIG', () => {
  it('has entries for every Variant', () => {
    for (const v of VARIANTS) {
      expect(VARIANT_CONFIG[v]).toBeDefined();
    }
  });

  it('every entry key matches its Variant', () => {
    for (const v of VARIANTS) {
      expect(VARIANT_CONFIG[v].key).toBe(v);
    }
  });

  it('only destructive variant has isDestructive=true', () => {
    const destructiveOnes = VARIANTS.filter(
      (v) => VARIANT_CONFIG[v].isDestructive,
    );
    expect(destructiveOnes).toEqual(['destructive']);
  });

  it('every entry has a non-empty label', () => {
    for (const v of VARIANTS) {
      expect(VARIANT_CONFIG[v].label.length).toBeGreaterThan(0);
    }
  });
});

// ─── INTENT_CONFIG ────────────────────────────────────────────────────────────

describe('INTENT_CONFIG', () => {
  it('has entries for every Intent', () => {
    for (const i of INTENTS) {
      expect(INTENT_CONFIG[i]).toBeDefined();
    }
  });

  it('every entry key matches its Intent', () => {
    for (const i of INTENTS) {
      expect(INTENT_CONFIG[i].key).toBe(i);
    }
  });

  it('warning and error use assertive aria-live', () => {
    expect(INTENT_CONFIG.warning.ariaLive).toBe('assertive');
    expect(INTENT_CONFIG.error.ariaLive).toBe('assertive');
  });

  it('default, success, info use polite aria-live', () => {
    expect(INTENT_CONFIG.default.ariaLive).toBe('polite');
    expect(INTENT_CONFIG.success.ariaLive).toBe('polite');
    expect(INTENT_CONFIG.info.ariaLive).toBe('polite');
  });

  it('warning and error use alert role', () => {
    expect(INTENT_CONFIG.warning.ariaRole).toBe('alert');
    expect(INTENT_CONFIG.error.ariaRole).toBe('alert');
  });
});

// ─── isSize ───────────────────────────────────────────────────────────────────

describe('isSize', () => {
  it('returns true for all valid sizes', () => {
    for (const size of SIZES) {
      expect(isSize(size)).toBe(true);
    }
  });

  it('returns false for invalid strings', () => {
    expect(isSize('xl')).toBe(false);
    expect(isSize('xs')).toBe(false);
    expect(isSize('medium')).toBe(false);
    expect(isSize('')).toBe(false);
  });

  it('returns false for non-strings', () => {
    expect(isSize(1)).toBe(false);
    expect(isSize(null)).toBe(false);
    expect(isSize(undefined)).toBe(false);
    expect(isSize({})).toBe(false);
  });

  it('acts as type guard (TypeScript narrowing)', () => {
    const val: unknown = 'sm';
    if (isSize(val)) {
      // TypeScript should accept val as Size here
      const _: Size = val;
      expect(_).toBe('sm');
    }
  });
});

// ─── isVariant ────────────────────────────────────────────────────────────────

describe('isVariant', () => {
  it('returns true for all valid variants', () => {
    for (const v of VARIANTS) {
      expect(isVariant(v)).toBe(true);
    }
  });

  it('returns false for invalid strings', () => {
    expect(isVariant('danger')).toBe(false);
    expect(isVariant('default')).toBe(false);
    expect(isVariant('')).toBe(false);
  });

  it('returns false for non-strings', () => {
    expect(isVariant(null)).toBe(false);
    expect(isVariant(42)).toBe(false);
    expect(isVariant(undefined)).toBe(false);
  });

  it('acts as type guard', () => {
    const val: unknown = 'primary';
    if (isVariant(val)) {
      const _: Variant = val;
      expect(_).toBe('primary');
    }
  });
});

// ─── isIntent ─────────────────────────────────────────────────────────────────

describe('isIntent', () => {
  it('returns true for all valid intents', () => {
    for (const i of INTENTS) {
      expect(isIntent(i)).toBe(true);
    }
  });

  it('returns false for invalid strings', () => {
    expect(isIntent('danger')).toBe(false);
    expect(isIntent('neutral')).toBe(false);
    expect(isIntent('')).toBe(false);
  });

  it('acts as type guard', () => {
    const val: unknown = 'error';
    if (isIntent(val)) {
      const _: Intent = val;
      expect(_).toBe('error');
    }
  });
});

// ─── isComponentState ─────────────────────────────────────────────────────────

describe('isComponentState', () => {
  it('returns true for all valid component states', () => {
    for (const state of COMPONENT_STATES) {
      expect(isComponentState(state)).toBe(true);
    }
  });

  it('returns false for invalid strings', () => {
    expect(isComponentState('pressed')).toBe(false);
    expect(isComponentState('inactive')).toBe(false);
  });

  it('acts as type guard', () => {
    const val: unknown = 'loading';
    if (isComponentState(val)) {
      const _: ComponentState = val;
      expect(_).toBe('loading');
    }
  });
});
