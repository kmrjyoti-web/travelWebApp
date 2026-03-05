import type { ElementType, CSSProperties, ReactNode } from 'react';

import type { Size, Variant, InteractiveProps } from '../types';

/**
 * Props for the Button component.
 *
 * Extends InteractiveProps (which includes disabled, loading, aria-*, onClick,
 * className, data-testid, id, tabIndex) with button-specific additions.
 */
export interface ButtonProps extends InteractiveProps {
  /** Visual treatment variant. @default 'primary' */
  variant?: Variant;
  /** Component size. @default 'md' */
  size?: Size;
  /** Icon rendered before the label text. Wrapped in aria-hidden span. */
  leftIcon?: ReactNode;
  /** Icon rendered after the label text. Wrapped in aria-hidden span. */
  rightIcon?: ReactNode;
  /**
   * Polymorphic element tag.
   * Use 'a' for link-buttons (provide `href` alongside).
   * @default 'button'
   */
  as?: ElementType;
  /**
   * Native button type attribute. Only applied when `as='button'`.
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
  /** Href for anchor-style usage (`as="a"`). */
  href?: string;
  /** Link target for anchor-style usage. */
  target?: string;
  /** Rel attribute for anchor-style usage. */
  rel?: string;
  /** Form id for submit/reset buttons. */
  form?: string;
  /** Button name attribute (form submission). */
  name?: string;
  /** Button value attribute (form submission). */
  value?: string;
  /** Inline styles (use sparingly — prefer CSS variables). */
  style?: CSSProperties;
  children?: ReactNode;
}
