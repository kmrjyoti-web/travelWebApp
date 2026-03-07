'use client';
import { CVirtualScroller } from '@coreui/react-pro';
import type { ComponentProps } from 'react';

export type VirtualScrollerProps = ComponentProps<typeof CVirtualScroller>;

export function VirtualScroller(props: VirtualScrollerProps) {
  return <CVirtualScroller {...props} />;
}
