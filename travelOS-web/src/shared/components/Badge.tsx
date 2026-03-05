'use client';
import React from 'react';
import { CBadge } from '@coreui/react';
import type { ComponentProps } from 'react';

export type BadgeProps = ComponentProps<typeof CBadge>;

export const Badge = React.forwardRef<HTMLElement, BadgeProps>((props, ref) => (
  <CBadge ref={ref as React.Ref<HTMLSpanElement>} {...props} />
));
Badge.displayName = 'Badge';
