'use client';

/**
 * @file src/components/forms/TextField/TextField.tsx
 *
 * Floating-label text input / textarea component.
 * Migrated from UI-KIT-main/components/ui/TextField.tsx — all Tailwind CSS
 * replaced with tos-* BEM classes defined in styles/components/overrides.css.
 *
 * Props follow the same shape as the UI-KIT original but:
 *   - No cn() / clsx / tailwind-merge dependency
 *   - Uses --tos-* custom properties via BEM modifier classes
 *   - Fully accessible: labelled via htmlFor + useId
 *   - Strict TypeScript — no `any` casts
 */

import React, { forwardRef, useId, type ComponentPropsWithoutRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type InputProps = Omit<ComponentPropsWithoutRef<'input'>, 'size'>;
type TextareaProps = Omit<ComponentPropsWithoutRef<'textarea'>, 'size'>;

export interface TextFieldProps extends InputProps {
  /** Floating label text */
  label?: string;
  /** 'outlined' (default) is the only supported variant; reserved for future expansion */
  variant?: 'outlined';
  /** 'medium' (default) or 'small' */
  size?: 'medium' | 'small';
  /** Show error state */
  error?: boolean;
  /** Helper / validation text shown below input */
  helperText?: string;
  /** Icon / element placed at the left of the input */
  startAdornment?: React.ReactNode;
  /** Icon / element placed at the right of the input */
  endAdornment?: React.ReactNode;
  /** Render a <textarea> instead of <input> */
  multiline?: boolean;
  /** Number of textarea rows (only when multiline=true) */
  rows?: number;
  /** Stretch to fill container width */
  fullWidth?: boolean;
  /** Extra className on the outermost container */
  containerClassName?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

function buildContainerClass(
  fullWidth: boolean,
  size: 'medium' | 'small',
  error: boolean,
  multiline: boolean,
  hasStart: boolean,
  containerClassName?: string,
): string {
  const cls = [
    'tos-text-field',
    'tos-text-field--outlined',
    fullWidth ? 'tos-text-field--full-width' : '',
    size === 'small' ? 'tos-text-field--small' : '',
    error ? 'tos-text-field--error' : '',
    multiline ? 'tos-text-field--multiline' : '',
    hasStart ? 'tos-text-field--has-start' : '',
    containerClassName ?? '',
  ]
    .filter(Boolean)
    .join(' ');
  return cls;
}

export const TextField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextFieldProps
>((props, ref) => {
  const {
    label,
    variant = 'outlined',
    size = 'medium',
    error = false,
    helperText,
    startAdornment,
    endAdornment,
    multiline = false,
    rows = 4,
    fullWidth = false,
    className,
    disabled,
    required,
    id: providedId,
    containerClassName,
    ...rest
  } = props;

  const generatedId = useId();
  const id = providedId ?? generatedId;
  const hasStart = Boolean(startAdornment);
  const hasEnd = Boolean(endAdornment);

  const containerCls = buildContainerClass(
    fullWidth,
    size,
    error,
    multiline,
    hasStart,
    containerClassName,
  );

  const inputCls = ['tos-text-field__input', className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerCls}>
      <div className="tos-text-field__wrapper">
        {/* Start adornment */}
        {hasStart && (
          <span
            className="tos-text-field__adornment tos-text-field__adornment--start"
            aria-hidden
          >
            {startAdornment}
          </span>
        )}

        {/* Input element */}
        {multiline ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={id}
            disabled={disabled}
            required={required}
            className={inputCls}
            placeholder=" "
            rows={rows}
            {...(rest as TextareaProps)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            id={id}
            disabled={disabled}
            required={required}
            className={inputCls}
            placeholder=" "
            {...(rest as InputProps)}
          />
        )}

        {/* Floating label */}
        {label && (
          <label htmlFor={id} className="tos-text-field__label">
            {label}
            {required && <span aria-hidden> *</span>}
          </label>
        )}

        {/* End adornment */}
        {hasEnd && (
          <span
            className={[
              'tos-text-field__adornment tos-text-field__adornment--end',
              hasEnd ? 'tos-text-field--has-end' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-hidden
          >
            {endAdornment}
          </span>
        )}
      </div>

      {/* Helper text */}
      {helperText && (
        <p
          className="tos-text-field__helper"
          role={error ? 'alert' : undefined}
          aria-live={error ? 'polite' : undefined}
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

TextField.displayName = 'TextField';
