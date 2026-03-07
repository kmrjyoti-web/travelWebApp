'use client';
import { forwardRef } from 'react';
import { CLoadingButton } from '@coreui/react-pro';
import type { ComponentProps } from 'react';

export type LoadingButtonProps = ComponentProps<typeof CLoadingButton>;

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (props, ref) => <CLoadingButton ref={ref} {...props} />,
);
LoadingButton.displayName = 'LoadingButton';
