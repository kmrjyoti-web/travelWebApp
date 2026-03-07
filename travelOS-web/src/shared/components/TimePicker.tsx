'use client';
import { forwardRef } from 'react';
import { CTimePicker } from '@coreui/react-pro';
import type { ComponentProps } from 'react';

export type TimePickerProps = ComponentProps<typeof CTimePicker>;

export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
  (props, ref) => <CTimePicker ref={ref} {...props} />,
);
TimePicker.displayName = 'TimePicker';
