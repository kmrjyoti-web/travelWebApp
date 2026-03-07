'use client';
import { forwardRef } from 'react';
import { CDatePicker } from '@coreui/react-pro';
import type { ComponentProps } from 'react';

export type DatePickerProps = ComponentProps<typeof CDatePicker>;

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (props, ref) => <CDatePicker ref={ref} {...props} />,
);
DatePicker.displayName = 'DatePicker';
