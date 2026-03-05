'use client';
import React from 'react';
import { CButton } from '@coreui/react';
import type { ComponentProps } from 'react';

export type ButtonProps = ComponentProps<typeof CButton>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <CButton ref={ref} {...props} />
));
Button.displayName = 'Button';
