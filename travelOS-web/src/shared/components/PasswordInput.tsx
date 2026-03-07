'use client';
import { forwardRef } from 'react';
import { CPasswordInput } from '@coreui/react-pro';
import type { ComponentProps } from 'react';

export type PasswordInputProps = ComponentProps<typeof CPasswordInput>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => <CPasswordInput ref={ref} {...props} />,
);
PasswordInput.displayName = 'PasswordInput';
