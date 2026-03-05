'use client';
import React from 'react';
import { CAvatar } from '@coreui/react';
import type { ComponentProps } from 'react';

export type AvatarProps = ComponentProps<typeof CAvatar>;

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>((props, ref) => (
  <CAvatar ref={ref} {...props} />
));
Avatar.displayName = 'Avatar';
