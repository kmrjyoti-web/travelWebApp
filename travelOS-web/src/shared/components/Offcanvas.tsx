'use client';
import React from 'react';
import { COffcanvas, COffcanvasHeader, COffcanvasTitle, COffcanvasBody } from '@coreui/react';
import type { ComponentProps } from 'react';

export type OffcanvasProps = ComponentProps<typeof COffcanvas>;

export const Offcanvas = React.forwardRef<HTMLDivElement, OffcanvasProps>((props, ref) => <COffcanvas ref={ref} {...props} />);
Offcanvas.displayName = 'Offcanvas';

// Re-export sub-components directly
export const OffcanvasHeader = COffcanvasHeader;
export const OffcanvasTitle = COffcanvasTitle;
export const OffcanvasBody = COffcanvasBody;
