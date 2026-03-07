'use client';
import { forwardRef } from 'react';
import { CFormRange } from '@coreui/react';
import type { ComponentProps } from 'react';

export type FormRangeProps = ComponentProps<typeof CFormRange>;

export const FormRange = forwardRef<HTMLInputElement, FormRangeProps>(
  (props, ref) => <CFormRange ref={ref} {...props} />,
);
FormRange.displayName = 'FormRange';
