'use client';
import React, { useState, useId, forwardRef } from 'react';
import { Icon } from '@/shared/components/Icon';
import type { IconName } from '@/shared/components/Icon';
import './TextField.css';

export type TextFieldVariant = 'outlined' | 'filled' | 'standard';

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Floating label text */
  label?: string;
  /** Helper / hint text below the field */
  helperText?: string;
  /** Error state — turns label + border red */
  error?: boolean;
  /** Visual variant */
  variant?: TextFieldVariant;
  /** Lucide icon shown at the start (inside the field) */
  startIcon?: IconName;
  /** Lucide icon shown at the end (inside the field) */
  endIcon?: IconName;
  /** Field size */
  size?: 'xs' | 'sm' | 'md';
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      label,
      helperText,
      error = false,
      variant = 'outlined',
      startIcon,
      endIcon,
      size = 'md',
      className = '',
      required,
      disabled,
      readOnly,
      id,
      value,
      defaultValue,
      placeholder,
      onFocus,
      onBlur,
      onChange,
      ...rest
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const [focused, setFocused] = useState(false);
    const [internalValue, setInternalValue] = useState<string>(
      String(defaultValue ?? ''),
    );

    const isControlled = value !== undefined;
    const currentValue = isControlled ? String(value ?? '') : internalValue;
    // Date/time inputs always show format text (dd/mm/yyyy) — label must always be floated
    const isDateType = ['date', 'time', 'datetime-local', 'month', 'week'].includes(rest.type as string ?? '');
    // Float the label if: has value, has placeholder, or is a date/time type
    const hasValue = currentValue.length > 0 || (!!placeholder && placeholder.length > 0) || isDateType;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(e);
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur?.(e);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(e.target.value);
      onChange?.(e);
    };

    const rootClass = [
      'tos-tf',
      `tos-tf--${variant}`,
      size === 'xs'  ? 'tos-tf--xs'             :
      size === 'sm'  ? 'tos-tf--sm'             : '',
      focused        ? 'tos-tf--focused'         : '',
      hasValue       ? 'tos-tf--has-value'       : '',
      error          ? 'tos-tf--error'           : '',
      disabled       ? 'tos-tf--disabled'        : '',
      readOnly       ? 'tos-tf--readonly'        : '',
      !label         ? 'tos-tf--no-label'        : '',
      startIcon      ? 'tos-tf--has-start-icon'  : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <div className={rootClass}>
        <div className="tos-tf__wrapper">

          {startIcon && (
            <span className="tos-tf__icon tos-tf__icon--start">
              <Icon name={startIcon} size={18} aria-hidden />
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className="tos-tf__input"
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            value={isControlled ? value : internalValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={placeholder ?? ''}
            aria-required={required}
            aria-invalid={error}
            aria-describedby={helperText ? `${inputId}-helper` : undefined}
            {...rest}
          />

          {label && (
            <label className="tos-tf__label" htmlFor={inputId}>
              {label}
              {required && <span className="tos-tf__required" aria-hidden="true">*</span>}
            </label>
          )}

          {endIcon && (
            <span className="tos-tf__icon tos-tf__icon--end">
              <Icon name={endIcon} size={18} aria-hidden />
            </span>
          )}
        </div>

        {helperText && (
          <p
            id={`${inputId}-helper`}
            className="tos-tf__helper"
            role={error ? 'alert' : undefined}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

TextField.displayName = 'TextField';
