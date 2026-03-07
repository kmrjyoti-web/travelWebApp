'use client';
import { CPopover } from '@coreui/react-pro';
import type { ComponentProps } from 'react';

export type PopoverProps = ComponentProps<typeof CPopover>;

export function Popover(props: PopoverProps) {
  return <CPopover {...props} />;
}
