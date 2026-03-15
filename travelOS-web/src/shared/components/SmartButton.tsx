'use client';
import React, { useState, useCallback, useRef } from 'react';
import { Button } from './Button';
import type { ButtonProps } from './Button';

export interface SmartButtonProps extends Omit<ButtonProps, 'onClick' | 'loading'> {
  /** Async-safe click handler — shows loading until promise resolves */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  /** Debounce delay in ms to prevent double-clicks (default: 300) */
  debounceMs?: number;
  /** Manual loading override (if provided, auto-loading is disabled) */
  loading?: boolean;
}

/**
 * Smart button with debounce protection and async handler support.
 *
 * Wraps the shared Button with automatic loading state management for
 * async click handlers and debounce protection against double-clicks.
 *
 * @example
 * <SmartButton
 *   color="primary"
 *   onClick={async () => { await submitForm(); }}
 *   leftIcon="Save"
 * >
 *   Save Changes
 * </SmartButton>
 */
export const SmartButton = React.forwardRef<HTMLButtonElement, SmartButtonProps>(
  ({ onClick, debounceMs = 300, loading: manualLoading, disabled, ...rest }, ref) => {
    const [autoLoading, setAutoLoading] = useState(false);
    const lastClickRef = useRef(0);

    const isLoading = manualLoading !== undefined ? manualLoading : autoLoading;

    const handleClick = useCallback(
      async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!onClick) return;

        // Debounce guard
        const now = Date.now();
        if (now - lastClickRef.current < debounceMs) return;
        lastClickRef.current = now;

        const result = onClick(e);
        if (result instanceof Promise && manualLoading === undefined) {
          setAutoLoading(true);
          try {
            await result;
          } finally {
            setAutoLoading(false);
          }
        }
      },
      [onClick, debounceMs, manualLoading],
    );

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        loading={isLoading}
        disabled={disabled || isLoading}
        {...rest}
      />
    );
  },
);
SmartButton.displayName = 'SmartButton';
