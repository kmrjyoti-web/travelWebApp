'use client';
import React from 'react';
import { CFormCheck } from '@coreui/react';
import type { ComponentProps } from 'react';

type CFormCheckProps = ComponentProps<typeof CFormCheck>;

export const Checkbox = React.forwardRef<HTMLInputElement, CFormCheckProps>((props, ref) => (
  <CFormCheck ref={ref} type="checkbox" {...props} />
));
Checkbox.displayName = 'Checkbox';

// Switch uses same component — CoreUI "switch" prop with boolean
export const Switch = React.forwardRef<HTMLInputElement, CFormCheckProps>((props, ref) => (
  // @ts-expect-error CoreUI switch prop typing issue with generics
  <CFormCheck ref={ref} type="checkbox" switch {...props} />
));
Switch.displayName = 'Switch';

export const Radio = React.forwardRef<HTMLInputElement, CFormCheckProps>((props, ref) => (
  <CFormCheck ref={ref} type="radio" {...props} />
));
Radio.displayName = 'Radio';
