'use client';
import { forwardRef } from 'react';
import { CMultiSelect } from '@coreui/react-pro';
import type { ComponentProps } from 'react';

export type MultiSelectProps = ComponentProps<typeof CMultiSelect>;

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  (props, ref) => <CMultiSelect ref={ref} {...props} />,
);
MultiSelect.displayName = 'MultiSelect';
