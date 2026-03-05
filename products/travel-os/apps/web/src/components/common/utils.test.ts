import { describe, expect, it, beforeEach, afterEach } from 'vitest';

import {
  cls,
  bem,
  el,
  sizeClass,
  variantClass,
  intentClass,
  componentCls,
  isDarkMode,
  setDarkMode,
  getSystemColorScheme,
} from './utils';

// ─── cls ──────────────────────────────────────────────────────────────────────

describe('cls', () => {
  it('joins two strings with a space', () => {
    expect(cls('a', 'b')).toBe('a b');
  });

  it('drops falsy values: false', () => {
    expect(cls('a', false, 'b')).toBe('a b');
  });

  it('drops falsy values: null', () => {
    expect(cls('a', null, 'b')).toBe('a b');
  });

  it('drops falsy values: undefined', () => {
    expect(cls('a', undefined, 'b')).toBe('a b');
  });

  it('drops empty strings', () => {
    expect(cls('a', '', 'b')).toBe('a b');
  });

  it('drops whitespace-only strings', () => {
    expect(cls('a', '   ', 'b')).toBe('a b');
  });

  it('flattens nested arrays', () => {
    expect(cls(['a', 'b'], 'c')).toBe('a b c');
  });

  it('flattens deeply nested arrays', () => {
    expect(cls([['a', ['b']], 'c'])).toBe('a b c');
  });

  it('handles conditional boolean pattern', () => {
    const loading = true;
    const disabled = false;
    expect(cls('tos-btn', loading && 'tos-btn--loading', disabled && 'tos-btn--disabled'))
      .toBe('tos-btn tos-btn--loading');
  });

  it('returns empty string when all parts are falsy', () => {
    expect(cls(false, null, undefined)).toBe('');
  });

  it('trims leading and trailing whitespace on individual parts', () => {
    expect(cls(' a ', ' b ')).toBe('a b');
  });

  it('single string returns that string', () => {
    expect(cls('tos-btn')).toBe('tos-btn');
  });

  it('no arguments returns empty string', () => {
    expect(cls()).toBe('');
  });

  it('works with multiple classes in a single string', () => {
    // Multi-word strings are passed through as-is (not split)
    expect(cls('foo bar', 'baz')).toBe('foo bar baz');
  });
});

// ─── bem ──────────────────────────────────────────────────────────────────────

describe('bem', () => {
  it('returns just the block when no modifiers', () => {
    expect(bem('tos-btn')).toBe('tos-btn');
  });

  it('returns just the block when modifiers is empty object', () => {
    expect(bem('tos-btn', {})).toBe('tos-btn');
  });

  it('adds block--key for boolean true modifier', () => {
    expect(bem('tos-btn', { loading: true })).toBe('tos-btn tos-btn--loading');
  });

  it('skips boolean false modifier', () => {
    expect(bem('tos-btn', { disabled: false })).toBe('tos-btn');
  });

  it('adds block--value for string modifier', () => {
    expect(bem('tos-btn', { size: 'sm' })).toBe('tos-btn tos-btn--sm');
  });

  it('skips null modifier value', () => {
    expect(bem('tos-btn', { size: null })).toBe('tos-btn');
  });

  it('skips undefined modifier value', () => {
    expect(bem('tos-btn', { variant: undefined })).toBe('tos-btn');
  });

  it('applies multiple modifiers', () => {
    const result = bem('tos-btn', { primary: true, lg: true, loading: false });
    expect(result).toBe('tos-btn tos-btn--primary tos-btn--lg');
  });

  it('string value takes precedence over key name', () => {
    // { size: 'sm' } → block--sm (uses the value, not the key "size")
    const result = bem('tos-card', { size: 'lg' });
    expect(result).toContain('tos-card--lg');
    expect(result).not.toContain('tos-card--size');
  });
});

// ─── el ───────────────────────────────────────────────────────────────────────

describe('el', () => {
  it('returns block__element', () => {
    expect(el('tos-btn', 'icon')).toBe('tos-btn__icon');
  });

  it('works with multi-word block', () => {
    expect(el('tos-data-table', 'header')).toBe('tos-data-table__header');
  });

  it('works with multi-word element', () => {
    expect(el('tos-card', 'action-bar')).toBe('tos-card__action-bar');
  });
});

// ─── sizeClass ────────────────────────────────────────────────────────────────

describe('sizeClass', () => {
  it('returns block--sm for sm', () => {
    expect(sizeClass('tos-btn', 'sm')).toBe('tos-btn--sm');
  });

  it('returns block--md for md', () => {
    expect(sizeClass('tos-btn', 'md')).toBe('tos-btn--md');
  });

  it('returns block--lg for lg', () => {
    expect(sizeClass('tos-btn', 'lg')).toBe('tos-btn--lg');
  });

  it('works with any block name', () => {
    expect(sizeClass('tos-input', 'sm')).toBe('tos-input--sm');
  });
});

// ─── variantClass ─────────────────────────────────────────────────────────────

describe('variantClass', () => {
  it('returns block--primary', () => {
    expect(variantClass('tos-btn', 'primary')).toBe('tos-btn--primary');
  });

  it('returns block--destructive', () => {
    expect(variantClass('tos-btn', 'destructive')).toBe('tos-btn--destructive');
  });

  it('returns block--ghost', () => {
    expect(variantClass('tos-btn', 'ghost')).toBe('tos-btn--ghost');
  });

  it('returns block--outline', () => {
    expect(variantClass('tos-btn', 'outline')).toBe('tos-btn--outline');
  });

  it('returns block--link', () => {
    expect(variantClass('tos-btn', 'link')).toBe('tos-btn--link');
  });
});

// ─── intentClass ─────────────────────────────────────────────────────────────

describe('intentClass', () => {
  it('returns empty string for "default"', () => {
    expect(intentClass('tos-badge', 'default')).toBe('');
  });

  it('returns block--success for success', () => {
    expect(intentClass('tos-badge', 'success')).toBe('tos-badge--success');
  });

  it('returns block--warning for warning', () => {
    expect(intentClass('tos-badge', 'warning')).toBe('tos-badge--warning');
  });

  it('returns block--error for error', () => {
    expect(intentClass('tos-badge', 'error')).toBe('tos-badge--error');
  });

  it('returns block--info for info', () => {
    expect(intentClass('tos-badge', 'info')).toBe('tos-badge--info');
  });
});

// ─── componentCls ─────────────────────────────────────────────────────────────

describe('componentCls', () => {
  it('returns just the block when no options', () => {
    expect(componentCls('tos-btn')).toBe('tos-btn');
  });

  it('returns just the block for empty options', () => {
    expect(componentCls('tos-btn', {})).toBe('tos-btn');
  });

  it('appends size modifier', () => {
    expect(componentCls('tos-btn', { size: 'lg' })).toBe('tos-btn tos-btn--lg');
  });

  it('appends variant modifier', () => {
    expect(componentCls('tos-btn', { variant: 'primary' })).toBe('tos-btn tos-btn--primary');
  });

  it('appends intent modifier (non-default)', () => {
    expect(componentCls('tos-badge', { intent: 'error' })).toBe('tos-badge tos-badge--error');
  });

  it('does NOT append intent modifier for "default"', () => {
    expect(componentCls('tos-badge', { intent: 'default' })).toBe('tos-badge');
  });

  it('appends --disabled when disabled=true', () => {
    expect(componentCls('tos-btn', { disabled: true })).toBe('tos-btn tos-btn--disabled');
  });

  it('appends --loading when loading=true', () => {
    expect(componentCls('tos-btn', { loading: true })).toBe('tos-btn tos-btn--loading');
  });

  it('appends --error when error=true', () => {
    expect(componentCls('tos-input', { error: true })).toBe('tos-input tos-input--error');
  });

  it('appends extra className at the end', () => {
    const result = componentCls('tos-btn', { extra: 'my-override' });
    expect(result).toBe('tos-btn my-override');
  });

  it('composes all modifiers in order: block size variant intent state extra', () => {
    const result = componentCls('tos-btn', {
      size:     'lg',
      variant:  'primary',
      intent:   'default',   // no class for default
      loading:  true,
      extra:    'custom',
    });
    expect(result).toBe('tos-btn tos-btn--lg tos-btn--primary tos-btn--loading custom');
  });

  it('does not add disabled class when disabled=false', () => {
    expect(componentCls('tos-btn', { disabled: false })).toBe('tos-btn');
  });

  it('handles extra as array', () => {
    const result = componentCls('tos-btn', { extra: ['a', 'b'] });
    expect(result).toContain('a');
    expect(result).toContain('b');
  });
});

// ─── isDarkMode ───────────────────────────────────────────────────────────────

describe('isDarkMode', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  it('returns false when data-theme is not set', () => {
    document.documentElement.removeAttribute('data-theme');
    expect(isDarkMode()).toBe(false);
  });

  it('returns true when data-theme="dark"', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    expect(isDarkMode()).toBe(true);
  });

  it('returns false when data-theme="light"', () => {
    document.documentElement.setAttribute('data-theme', 'light');
    expect(isDarkMode()).toBe(false);
  });
});

// ─── setDarkMode ──────────────────────────────────────────────────────────────

describe('setDarkMode', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  it('sets data-theme="dark" when called with true', () => {
    setDarkMode(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('removes data-theme when called with false', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    setDarkMode(false);
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });

  it('is idempotent — calling twice does not throw', () => {
    expect(() => {
      setDarkMode(true);
      setDarkMode(true);
    }).not.toThrow();
  });

  it('isDarkMode() reflects setDarkMode(true)', () => {
    setDarkMode(true);
    expect(isDarkMode()).toBe(true);
  });

  it('isDarkMode() reflects setDarkMode(false)', () => {
    setDarkMode(true);
    setDarkMode(false);
    expect(isDarkMode()).toBe(false);
  });
});

// ─── getSystemColorScheme ─────────────────────────────────────────────────────

describe('getSystemColorScheme', () => {
  it('returns "light" or "dark"', () => {
    const scheme = getSystemColorScheme();
    expect(['light', 'dark']).toContain(scheme);
  });

  it('returns a string', () => {
    expect(typeof getSystemColorScheme()).toBe('string');
  });
});

// ─── Integration — full component class round-trip ───────────────────────────

describe('integration — full class round-trip', () => {
  it('Button primary lg loading disabled produces correct class string', () => {
    const result = componentCls('tos-btn', {
      size:     'lg',
      variant:  'primary',
      loading:  true,
      disabled: true,
      extra:    'my-override',
    });
    expect(result).toBe('tos-btn tos-btn--lg tos-btn--primary tos-btn--loading tos-btn--disabled my-override');
  });

  it('Badge error intent produces correct class string', () => {
    const result = componentCls('tos-badge', {
      size:   'sm',
      intent: 'error',
      error:  true,
    });
    expect(result).toBe('tos-badge tos-badge--sm tos-badge--error tos-badge--error');
  });

  it('bem + el compose correctly for a card header', () => {
    const card   = bem('tos-card', { outlined: true });
    const header = el('tos-card', 'header');
    expect(card).toBe('tos-card tos-card--outlined');
    expect(header).toBe('tos-card__header');
  });
});
