/**
 * @file src/components/common/utils.ts
 *
 * Class-building utilities for TravelOS UI components.
 *
 * All components build their class strings through these helpers so that:
 *   • BEM conventions are applied consistently
 *   • State modifiers (--disabled, --loading, --error) are standard
 *   • Dark mode is toggled via a single DOM attribute (no JS class swapping)
 *
 * DO NOT import clsx or tailwind-merge directly in component files —
 * use these wrappers instead to keep the abstraction boundary clean.
 */

import type { Size, Variant, Intent } from './types';

// ─── ClassValue ───────────────────────────────────────────────────────────────

/** Accepted values for `cls()`. Mirrors the clsx API but without the dep. */
type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[];

// ─── cls ──────────────────────────────────────────────────────────────────────

/**
 * Builds a class string from one or more conditional parts.
 * Falsy values (false, null, undefined, '') are silently dropped.
 * Arrays are flattened recursively.
 *
 * @example
 *   cls('tos-btn', isLoading && 'tos-btn--loading', extraClass)
 *   // → 'tos-btn tos-btn--loading my-extra'
 */
export function cls(...parts: ClassValue[]): string {
  return flattenCls(parts).filter((v) => v !== '').join(' ');
}

function flattenCls(parts: ClassValue[]): string[] {
  const out: string[] = [];
  for (const part of parts) {
    if (!part && part !== 0) continue;
    if (Array.isArray(part)) {
      out.push(...flattenCls(part));
    } else if (typeof part === 'string' && part.trim()) {
      out.push(part.trim());
    } else if (typeof part === 'number') {
      out.push(String(part));
    }
  }
  return out;
}

// ─── bem ──────────────────────────────────────────────────────────────────────

/**
 * Builds a BEM block class with optional modifiers.
 *
 * Boolean modifier:  { loading: true }   → `block--loading`
 * String modifier:   { size: 'sm' }      → `block--sm`
 * Falsy values are skipped.
 *
 * @example
 *   bem('tos-btn', { primary: true, disabled: false, size: 'lg' })
 *   // → 'tos-btn tos-btn--primary tos-btn--lg'
 */
export function bem(
  block: string,
  modifiers?: Record<string, boolean | string | number | null | undefined>,
): string {
  if (!modifiers) return block;
  const mods = Object.entries(modifiers)
    .filter(([, val]) => Boolean(val))
    .map(([key, val]) =>
      typeof val === 'string' ? `${block}--${val}` : `${block}--${key}`,
    );
  return cls(block, ...mods);
}

// ─── el ───────────────────────────────────────────────────────────────────────

/**
 * Returns the BEM element class for a given block.
 *
 * @example el('tos-btn', 'icon') → 'tos-btn__icon'
 */
export function el(block: string, element: string): string {
  return `${block}__${element}`;
}

// ─── Size / variant / intent helpers ─────────────────────────────────────────

/**
 * @example sizeClass('tos-btn', 'sm') → 'tos-btn--sm'
 */
export function sizeClass(block: string, size: Size): string {
  return `${block}--${size}`;
}

/**
 * @example variantClass('tos-btn', 'primary') → 'tos-btn--primary'
 */
export function variantClass(block: string, variant: Variant): string {
  return `${block}--${variant}`;
}

/**
 * Returns an intent modifier class. Returns '' for 'default' (no modifier needed).
 *
 * @example intentClass('tos-badge', 'error')   → 'tos-badge--error'
 * @example intentClass('tos-badge', 'default') → ''
 */
export function intentClass(block: string, intent: Intent): string {
  return intent === 'default' ? '' : `${block}--${intent}`;
}

// ─── componentCls ─────────────────────────────────────────────────────────────

export interface ComponentClsOptions {
  size?: Size;
  variant?: Variant;
  intent?: Intent;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  /** Extra classes passed via `className` prop — appended last. */
  extra?: ClassValue;
}

/**
 * Primary class-builder for every TOS component.
 *
 * Composes: block + size + variant + intent + state modifiers + extra.
 * Use this at the top of every component render function.
 *
 * @example
 *   componentCls('tos-btn', { size: 'lg', variant: 'primary', loading: true })
 *   // → 'tos-btn tos-btn--lg tos-btn--primary tos-btn--loading'
 *
 *   componentCls('tos-btn', { variant: 'ghost', extra: props.className })
 *   // → 'tos-btn tos-btn--ghost my-override'
 */
export function componentCls(block: string, opts?: ComponentClsOptions): string {
  return cls(
    block,
    opts?.size      ? sizeClass(block, opts.size)       : null,
    opts?.variant   ? variantClass(block, opts.variant) : null,
    opts?.intent    ? intentClass(block, opts.intent)   : null,
    opts?.disabled  ? `${block}--disabled`              : null,
    opts?.loading   ? `${block}--loading`               : null,
    opts?.error     ? `${block}--error`                 : null,
    opts?.extra,
  );
}

// ─── Dark mode ────────────────────────────────────────────────────────────────

/**
 * Returns true when the document root carries `data-theme="dark"`.
 * Safe during SSR — returns false when `document` is unavailable.
 */
export function isDarkMode(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

/**
 * Applies or removes `data-theme="dark"` on `document.documentElement`.
 * All `--tos-*` tokens switch via CSS `[data-theme="dark"]` selectors —
 * no additional JS is needed after this call.
 */
export function setDarkMode(dark: boolean): void {
  if (typeof document === 'undefined') return;
  if (dark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

/**
 * Returns the preferred colour scheme from `prefers-color-scheme`.
 * Falls back to 'light' during SSR.
 */
export function getSystemColorScheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
