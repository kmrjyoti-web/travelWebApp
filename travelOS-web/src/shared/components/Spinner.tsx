'use client';
import React from 'react';
import { CSpinner } from '@coreui/react';
import type { ComponentProps } from 'react';

export type SpinnerProps = ComponentProps<typeof CSpinner>;

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>((props, ref) => (
  <CSpinner ref={ref} {...props} />
));
Spinner.displayName = 'Spinner';
