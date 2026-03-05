'use client';
import { CAlert, CAlertHeading, CAlertLink } from '@coreui/react';
import type { ComponentProps } from 'react';

export type AlertProps = ComponentProps<typeof CAlert>;

// Re-export directly — CoreUI polymorphic type incompatible with ComponentProps wrapper
export const Alert = CAlert;
export const AlertHeading = CAlertHeading;
export const AlertLink = CAlertLink;
