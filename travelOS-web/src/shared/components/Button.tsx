'use client';
import React from 'react';
import { CButton } from '@coreui/react';
import type { ComponentProps } from 'react';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { Spinner } from './Spinner';
import './Button.css';

export interface ButtonProps extends ComponentProps<typeof CButton> {
  /** Shows spinner and disables the button while true */
  loading?: boolean;
  /** Icon rendered before children */
  leftIcon?: IconName;
  /** Icon rendered after children */
  rightIcon?: IconName;
}

/**
 * Shared button — single-line compact style across the whole app.
 *
 * @example
 * <Button color="primary" size="sm" leftIcon="Plus">Add Day</Button>
 * <Button color="secondary" variant="outline" size="sm" leftIcon="Save">Save Draft</Button>
 * <Button color="secondary" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
 * <Button color="danger" size="sm" loading={isDeleting}>Delete</Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading, leftIcon, rightIcon, disabled, children, className = '', variant, color, ...props }, ref) => {
    // Build tos-btn class string
    const ghost = variant === 'ghost';
    const outline = variant === 'outline';
    const colorKey = (color as string) ?? 'secondary';

    const tosClass = [
      'tos-btn',
      ghost   ? `btn-ghost-${colorKey}`   :
      outline ? `btn-outline-${colorKey}` :
                `btn-${colorKey}`,
      className,
    ].filter(Boolean).join(' ');

    return (
      <CButton
        ref={ref}
        color={color}
        variant={ghost || outline ? (ghost ? 'ghost' : 'outline') : undefined}
        disabled={disabled || loading}
        className={tosClass}
        {...props}
      >
        {loading
          ? <Spinner component="span" size="sm" aria-hidden className="me-1" />
          : leftIcon && <Icon name={leftIcon} size={14} aria-hidden />}
        {children}
        {!loading && rightIcon && <Icon name={rightIcon} size={14} aria-hidden />}
      </CButton>
    );
  },
);
Button.displayName = 'Button';
