'use client';
import React from 'react';
import { CButton } from '@coreui/react';
import type { ComponentProps } from 'react';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { Spinner } from './Spinner';

export interface ButtonProps extends ComponentProps<typeof CButton> {
  /** Shows spinner and disables the button while true */
  loading?: boolean;
  /** Icon rendered before children */
  leftIcon?: IconName;
  /** Icon rendered after children */
  rightIcon?: IconName;
}

/**
 * CButton wrapper with loading state and icon shortcuts.
 *
 * @example
 * <Button color="primary" loading={isSaving}>Save</Button>
 * <Button variant="outline" leftIcon="Plus" onClick={add}>Add Item</Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading, leftIcon, rightIcon, disabled, children, ...props }, ref) => (
    <CButton ref={ref} disabled={disabled || loading} {...props}>
      {loading
        ? <Spinner component="span" size="sm" aria-hidden className="me-1" />
        : leftIcon && <Icon name={leftIcon} size={14} className="me-1" aria-hidden />}
      {children}
      {!loading && rightIcon && <Icon name={rightIcon} size={14} className="ms-1" aria-hidden />}
    </CButton>
  ),
);
Button.displayName = 'Button';
