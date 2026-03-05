'use client';

/**
 * @file src/components/common/Button/Button.tsx
 *
 * TravelOS Button component.
 *
 * Supports:
 *   • 6 variants: primary | secondary | outline | ghost | destructive | link
 *   • 3 sizes:    sm | md | lg
 *   • States:     disabled, loading (both block interaction + add BEM modifiers)
 *   • Icons:      leftIcon / rightIcon slots (aria-hidden wrappers)
 *   • Polymorphic: as="a" for link-buttons (href, target, rel)
 *   • Dark mode:   via --tos-btn-* CSS custom properties
 *
 * Class anatomy: tos-btn  tos-btn--{variant}  tos-btn--{size}  tos-btn--loading  tos-btn--disabled
 * Element classes: tos-btn__label  tos-btn__icon  tos-btn__icon--left  tos-btn__icon--right  tos-btn__spinner
 */

import React from 'react';

import { componentCls } from '../utils';
import type { ButtonProps } from './types';

const BLOCK = 'tos-btn';

export function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  className,
  id,
  style,
  type = 'button',
  href,
  target,
  rel,
  form,
  name,
  value,
  onClick,
  tabIndex,
  'data-testid': testId,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-controls': ariaControls,
  'aria-expanded': ariaExpanded,
  'aria-pressed': ariaPressed,
  'aria-haspopup': ariaHasPopup,
}: ButtonProps) {
  // Loading implies disabled for interaction purposes (both classes rendered independently)
  const isDisabled = disabled || loading;

  const rootCls = componentCls(BLOCK, {
    size,
    variant,
    disabled: isDisabled,
    loading,
    extra: className,
  });

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (isDisabled) return;
    onClick?.(e);
  };

  // Attributes shared by every rendered element type
  const sharedProps = {
    id,
    style,
    className: rootCls,
    'data-testid': testId,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-controls': ariaControls,
    'aria-expanded': ariaExpanded,
    'aria-pressed': ariaPressed,
    'aria-haspopup': ariaHasPopup,
    // aria-busy signals a loading state to assistive technologies
    'aria-busy': loading || undefined,
    // aria-disabled supplements native disabled for AT when native disabled isn't applicable
    'aria-disabled': isDisabled || undefined,
    // Remove from tab order when disabled so keyboard users skip the control
    tabIndex: isDisabled ? -1 : tabIndex,
  };

  const inner = (
    <>
      {leftIcon != null && (
        <span className="tos-btn__icon tos-btn__icon--left" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {loading && <span className="tos-btn__spinner" aria-hidden="true" />}
      {children != null && (
        <span className="tos-btn__label">{children}</span>
      )}
      {rightIcon != null && (
        <span className="tos-btn__icon tos-btn__icon--right" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </>
  );

  // Anchor-style button (as="a")
  if (Tag === 'a') {
    return (
      <a
        {...sharedProps}
        href={href}
        target={target}
        rel={rel}
        onClick={handleClick as React.MouseEventHandler<HTMLAnchorElement>}
      >
        {inner}
      </a>
    );
  }

  // Default: native <button> (or other element types — button-specific attrs only for button)
  return (
    <button
      {...sharedProps}
      type={type}
      disabled={isDisabled}
      form={form}
      name={name}
      value={value}
      onClick={handleClick as React.MouseEventHandler<HTMLButtonElement>}
    >
      {inner}
    </button>
  );
}
