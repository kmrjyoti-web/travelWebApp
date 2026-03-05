'use client';
import React from 'react';
import { CProgress, CProgressBar } from '@coreui/react';
import type { ComponentProps } from 'react';

export type ProgressProps = ComponentProps<typeof CProgress>;
export type ProgressBarProps = ComponentProps<typeof CProgressBar>;

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>((props, ref) => (
  <CProgress ref={ref} {...props} />
));
Progress.displayName = 'Progress';

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>((props, ref) => (
  <CProgressBar ref={ref} {...props} />
));
ProgressBar.displayName = 'ProgressBar';
