'use client';
import React from 'react';
import { CCollapse } from '@coreui/react';
import type { ComponentProps } from 'react';

export type CollapseProps = ComponentProps<typeof CCollapse>;

export const Collapse = React.forwardRef<HTMLDivElement, CollapseProps>((props, ref) => (
  <CCollapse ref={ref} {...props} />
));
Collapse.displayName = 'Collapse';
