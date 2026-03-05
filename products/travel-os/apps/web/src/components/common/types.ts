/**
 * @file src/components/common/types.ts
 *
 * Shared type system for all TravelOS UI components.
 *
 * RULES — every component in src/components/common/ MUST:
 *   1. Import Size / Variant / Intent / BaseProps from this file
 *   2. Extend BaseProps (or InteractiveProps / FormFieldProps) in its own types.ts
 *   3. Support all three sizes: sm | md | lg
 *   4. Support at least three variants
 *   5. Reflect disabled/loading/error states via CSS modifiers (see utils.ts)
 *   6. Carry data-testid and aria-label on the root element
 *   7. Use --tos-* CSS custom properties — never hard-code colours
 */

import type { ComponentProps, ElementType, ReactNode } from 'react';

// ─── Size ──────────────────────────────────────────────────────────────────────

export type Size = 'sm' | 'md' | 'lg';

/** Ordered small → large for iteration / mapping. */
export const SIZES: readonly Size[] = ['sm', 'md', 'lg'] as const;

export interface SizeConfig {
  key: Size;
  label: string;
  /** Approximate rendered height in px (for documentation / Storybook). */
  heightPx: number;
  /** lucide-react icon `size` prop for this component size. */
  iconSizePx: number;
}

export const SIZE_CONFIG: Record<Size, SizeConfig> = {
  sm: { key: 'sm', label: 'Small',  heightPx: 28, iconSizePx: 14 },
  md: { key: 'md', label: 'Medium', heightPx: 36, iconSizePx: 16 },
  lg: { key: 'lg', label: 'Large',  heightPx: 44, iconSizePx: 18 },
} as const;

// ─── Variant ──────────────────────────────────────────────────────────────────

/**
 * Visual treatment variants.
 *
 * primary     — filled, brand colour CTA
 * secondary   — filled, muted / neutral
 * outline     — border only, transparent fill
 * ghost       — no border or fill; colour on hover only
 * destructive — red / danger filled; requires explicit confirm pattern
 * link        — styled as inline text link
 */
export type Variant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'link';

export const VARIANTS: readonly Variant[] = [
  'primary', 'secondary', 'outline', 'ghost', 'destructive', 'link',
] as const;

export interface VariantConfig {
  key: Variant;
  label: string;
  /** True for variants that perform irreversible / dangerous actions. */
  isDestructive: boolean;
}

export const VARIANT_CONFIG: Record<Variant, VariantConfig> = {
  primary:     { key: 'primary',     label: 'Primary',     isDestructive: false },
  secondary:   { key: 'secondary',   label: 'Secondary',   isDestructive: false },
  outline:     { key: 'outline',     label: 'Outline',     isDestructive: false },
  ghost:       { key: 'ghost',       label: 'Ghost',       isDestructive: false },
  destructive: { key: 'destructive', label: 'Destructive', isDestructive: true  },
  link:        { key: 'link',        label: 'Link',        isDestructive: false },
} as const;

// ─── Intent ───────────────────────────────────────────────────────────────────

/**
 * Semantic colour meaning — used for status/feedback components
 * (Badge, Toast, Alert, etc.)
 *
 * default — neutral / brand
 * success — green
 * warning — amber
 * error   — red
 * info    — blue
 */
export type Intent = 'default' | 'success' | 'warning' | 'error' | 'info';

export const INTENTS: readonly Intent[] = [
  'default', 'success', 'warning', 'error', 'info',
] as const;

export interface IntentConfig {
  key: Intent;
  label: string;
  /** ARIA role appropriate for this intent (used on live regions). */
  ariaRole: 'status' | 'alert' | 'log';
  /** Whether AT should interrupt the user (assertive) or wait (polite). */
  ariaLive: 'polite' | 'assertive';
}

export const INTENT_CONFIG: Record<Intent, IntentConfig> = {
  default: { key: 'default', label: 'Default', ariaRole: 'status', ariaLive: 'polite'     },
  success: { key: 'success', label: 'Success', ariaRole: 'status', ariaLive: 'polite'     },
  warning: { key: 'warning', label: 'Warning', ariaRole: 'alert',  ariaLive: 'assertive'  },
  error:   { key: 'error',   label: 'Error',   ariaRole: 'alert',  ariaLive: 'assertive'  },
  info:    { key: 'info',    label: 'Info',    ariaRole: 'status', ariaLive: 'polite'     },
} as const;

// ─── Component states ─────────────────────────────────────────────────────────

/**
 * All possible runtime states a component can be in.
 * Used for documentation, visual regression tests, and Storybook stories.
 */
export type ComponentState =
  | 'default'
  | 'hover'
  | 'focus'
  | 'active'
  | 'disabled'
  | 'loading'
  | 'error';

export const COMPONENT_STATES: readonly ComponentState[] = [
  'default', 'hover', 'focus', 'active', 'disabled', 'loading', 'error',
] as const;

// ─── Color scheme ─────────────────────────────────────────────────────────────

export type ColorScheme = 'light' | 'dark' | 'system';

// ─── Base component props ─────────────────────────────────────────────────────

/**
 * Minimum props every TOS component accepts.
 * Extend this in each component's own types.ts.
 */
export interface BaseProps {
  /** Append extra CSS classes to the root element. */
  className?: string;
  /** For automated tests. Maps to the `data-testid` attribute. */
  'data-testid'?: string;
  /** HTML id for label association and skip links. */
  id?: string;
}

// ─── Interactive component props ──────────────────────────────────────────────

/**
 * Base props for clickable / focusable components: Button, IconButton, Link, etc.
 * Extends BaseProps with the full ARIA set needed for interactive elements.
 */
export interface InteractiveProps extends BaseProps {
  disabled?: boolean;
  loading?: boolean;
  /** Accessible name when no visible text label is present. */
  'aria-label'?: string;
  /** ID of an element that provides a longer description. */
  'aria-describedby'?: string;
  /** ID of the panel/element this control expands/collapses. */
  'aria-controls'?: string;
  'aria-expanded'?: boolean;
  'aria-pressed'?: boolean;
  'aria-haspopup'?: boolean | 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid';
  tabIndex?: number;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

// ─── Form field props ─────────────────────────────────────────────────────────

/**
 * Base props for all form-field components: Input, Select, Textarea, Checkbox, etc.
 * Extend this in each field component's own types.ts.
 */
export interface FormFieldProps extends BaseProps {
  name?: string;
  /** Visible label text. If omitted, aria-label is required. */
  label?: string;
  /** Helper text displayed below the field. */
  hint?: string;
  /** Validation error message. Triggers the --error modifier. */
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
  onChange?: React.ChangeEventHandler<HTMLElement>;
  onBlur?: React.FocusEventHandler<HTMLElement>;
  onFocus?: React.FocusEventHandler<HTMLElement>;
}

// ─── Polymorphic component support ───────────────────────────────────────────

/**
 * `as` prop for polymorphic components.
 * Merges the target element's own props with the component's custom props.
 *
 * @example
 *   <Button as="a" href="/dashboard">Go to dashboard</Button>
 */
export type PolymorphicProps<
  E extends ElementType,
  P extends object = Record<string, never>,
> = P & Omit<ComponentProps<E>, keyof P> & { as?: E; children?: ReactNode };

// ─── Type guards ──────────────────────────────────────────────────────────────

/** Returns true if `value` is a valid Size. */
export function isSize(value: unknown): value is Size {
  return typeof value === 'string' && (SIZES as readonly string[]).includes(value);
}

/** Returns true if `value` is a valid Variant. */
export function isVariant(value: unknown): value is Variant {
  return typeof value === 'string' && (VARIANTS as readonly string[]).includes(value);
}

/** Returns true if `value` is a valid Intent. */
export function isIntent(value: unknown): value is Intent {
  return typeof value === 'string' && (INTENTS as readonly string[]).includes(value);
}

/** Returns true if `value` is a valid ComponentState. */
export function isComponentState(value: unknown): value is ComponentState {
  return typeof value === 'string' && (COMPONENT_STATES as readonly string[]).includes(value);
}
