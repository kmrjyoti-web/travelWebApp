'use client';
import React from 'react';
import { CToast, CToastBody, CToastClose, CToaster } from '@coreui/react';
import type { ComponentProps } from 'react';

export type ToastProps = ComponentProps<typeof CToast>;

export const Toast = (props: ToastProps) => <CToast autohide delay={4000} {...props} />;
Toast.displayName = 'Toast';

export const ToastBody = (props: ComponentProps<typeof CToastBody>) => <CToastBody {...props} />;
ToastBody.displayName = 'ToastBody';

export const ToastClose = CToastClose;

export const Toaster = (props: ComponentProps<typeof CToaster>) => <CToaster placement="top-end" {...props} />;
Toaster.displayName = 'Toaster';
