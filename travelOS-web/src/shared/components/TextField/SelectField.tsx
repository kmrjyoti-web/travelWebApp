'use client';
import React, { useState, useId, forwardRef } from 'react';
import './TextField.css';

export type SelectFieldVariant = 'outlined' | 'filled' | 'standard';

export interface SelectFieldProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  variant?: SelectFieldVariant;
  size?: 'xs' | 'sm' | 'md';
  children: React.ReactNode;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField(
    {
      label,
      helperText,
      error = false,
      variant = 'outlined',
      size = 'md',
      className = '',
      required,
      disabled,
      id,
      value,
      onChange,
      onFocus,
      onBlur,
      children,
      ...rest
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const [focused, setFocused] = useState(false);

    // Select always has a value (first option or controlled); label always floated
    const hasValue = true;

    const rootClass = [
      'tos-tf',
      `tos-tf--${variant}`,
      size === 'xs' ? 'tos-tf--xs'       :
      size === 'sm' ? 'tos-tf--sm'       : '',
      focused       ? 'tos-tf--focused'  : '',
      hasValue      ? 'tos-tf--has-value': '',
      error         ? 'tos-tf--error'    : '',
      disabled      ? 'tos-tf--disabled' : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <div className={rootClass}>
        <div className="tos-tf__wrapper" style={{ position: 'relative' }}>
          <select
            ref={ref}
            id={inputId}
            className="tos-tf__input"
            required={required}
            disabled={disabled}
            value={value}
            onChange={onChange}
            onFocus={(e) => { setFocused(true); onFocus?.(e); }}
            onBlur={(e)  => { setFocused(false); onBlur?.(e); }}
            aria-required={required}
            aria-invalid={error}
            aria-describedby={helperText ? `${inputId}-helper` : undefined}
            style={{ paddingRight: 28, appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}
            {...rest}
          >
            {children}
          </select>

          {label && (
            <label className="tos-tf__label" htmlFor={inputId}>
              {label}
              {required && <span className="tos-tf__required" aria-hidden="true">*</span>}
            </label>
          )}

          {/* Chevron icon */}
          <span className="tos-tf__icon tos-tf__icon--end" style={{ pointerEvents: 'none', position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>

        {helperText && (
          <p id={`${inputId}-helper`} className="tos-tf__helper" role={error ? 'alert' : undefined}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

SelectField.displayName = 'SelectField';
