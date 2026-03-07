'use client';
import { forwardRef } from 'react';
import { CDateRangePicker } from '@coreui/react-pro';
import type { ComponentProps } from 'react';

export type DateRangePickerProps = ComponentProps<typeof CDateRangePicker>;

export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(
  (props, ref) => <CDateRangePicker ref={ref} {...props} />,
);
DateRangePicker.displayName = 'DateRangePicker';
