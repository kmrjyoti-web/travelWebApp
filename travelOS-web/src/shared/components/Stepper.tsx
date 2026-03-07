'use client';
import { CStepper } from '@coreui/react-pro';
import type { ComponentProps } from 'react';

export type StepperProps = ComponentProps<typeof CStepper>;

export function Stepper(props: StepperProps) {
  return <CStepper {...props} />;
}
