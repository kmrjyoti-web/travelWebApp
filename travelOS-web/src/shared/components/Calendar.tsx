'use client';
import { CCalendar } from '@coreui/react-pro';
import type { ComponentProps } from 'react';

export type CalendarProps = ComponentProps<typeof CCalendar>;

export function Calendar(props: CalendarProps) {
  return <CCalendar {...props} />;
}
