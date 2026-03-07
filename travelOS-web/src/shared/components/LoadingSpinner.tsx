'use client';
import React from 'react';
import { Spinner } from './Spinner';

interface LoadingSpinnerProps {
  /** Spinner size */
  size?: 'sm' | 'md' | 'lg';
  /** Fill the whole viewport — centres vertically */
  fullPage?: boolean;
  /** Accessible label */
  label?: string;
}

const SIZE_MAP = { sm: 'sm', md: undefined, lg: undefined } as const;

/**
 * Convenience wrapper that centres a Spinner either inline or full-page.
 */
export function LoadingSpinner({ size = 'md', fullPage = false, label = 'Loading…' }: LoadingSpinnerProps) {
  const spinner = (
    <Spinner
      size={SIZE_MAP[size]}
      aria-label={label}
    />
  );

  if (fullPage) {
    return (
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}
        role="status"
        aria-label={label}
      >
        {spinner}
      </div>
    );
  }

  return <span role="status" aria-label={label}>{spinner}</span>;
}
