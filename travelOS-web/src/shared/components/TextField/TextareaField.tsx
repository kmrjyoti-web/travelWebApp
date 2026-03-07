'use client';
import React, { useState, useId, forwardRef } from 'react';
import './TextField.css';

export type TextareaFieldVariant = 'outlined' | 'filled' | 'standard';

export interface TextareaFieldProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  variant?: TextareaFieldVariant;
  minRows?: number;
  size?: 'sm' | 'md';
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  function TextareaField(
    {
      label,
      helperText,
      error = false,
      variant = 'outlined',
      minRows = 3,
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
    const [internalValue, setInternalValue] = useState(String(defaultValue ?? ''));

    const isControlled = value !== undefined;
    const currentValue = isControlled ? String(value ?? '') : internalValue;
    // Float the label if there's a value OR a placeholder (so they don't overlap)
    const hasValue = currentValue.length > 0 || (!!placeholder && placeholder.length > 0);

    const rootClass = [
      'tos-tf',
      `tos-tf--${variant}`,
      'tos-tf--textarea',
      size === 'sm' ? 'tos-tf--sm' : '',
      focused   ? 'tos-tf--focused'   : '',
      hasValue  ? 'tos-tf--has-value' : '',
      error     ? 'tos-tf--error'     : '',
      disabled  ? 'tos-tf--disabled'  : '',
      readOnly  ? 'tos-tf--readonly'  : '',
      !label    ? 'tos-tf--no-label'  : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <div className={rootClass}>
        <div className="tos-tf__wrapper" style={{ alignItems: 'flex-start', height: 'auto', minHeight: minRows * 24 + 28 }}>
          <textarea
            ref={ref}
            id={inputId}
            className="tos-tf__input"
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            value={isControlled ? value : internalValue}
            onFocus={(e) => { setFocused(true); onFocus?.(e); }}
            onBlur={(e)  => { setFocused(false); onBlur?.(e); }}
            onChange={(e) => {
              if (!isControlled) setInternalValue(e.target.value);
              onChange?.(e);
            }}
            placeholder={placeholder ?? ''}
            aria-required={required}
            aria-invalid={error}
            aria-describedby={helperText ? `${inputId}-helper` : undefined}
            style={{
              resize: 'vertical',
              fontSize: '0.9rem',
              paddingTop: label ? 16 : 8,
              paddingBottom: 8,
              lineHeight: 1.5,
              minHeight: minRows * 24 + 16,
            }}
            {...rest}
          />

          {label && (
            <label className="tos-tf__label" htmlFor={inputId} style={{ top: label ? undefined : '10px' }}>
              {label}
              {required && <span className="tos-tf__required" aria-hidden="true">*</span>}
            </label>
          )}
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

TextareaField.displayName = 'TextareaField';
