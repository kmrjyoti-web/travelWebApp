'use client';
import React, { useId } from 'react';

export interface FormFieldProps {
  /** Label text */
  label?: string;
  /** ID linking label → input (auto-generated if omitted) */
  htmlFor?: string;
  /** Required asterisk on label */
  required?: boolean;
  /** Helper text below */
  helperText?: string;
  /** Error message (red) */
  errorMessage?: string;
  /** Extra wrapper className */
  className?: string;
  children: React.ReactNode;
}

/**
 * Universal form field wrapper.
 * Provides label + helper/error text for any custom control
 * that doesn't fit Input/Select/Textarea.
 *
 * @example
 * <FormField label="Tags" htmlFor="tags-input" required errorMessage={errors.tags?.message}>
 *   <TagsInput id="tags-input" ... />
 * </FormField>
 */
export function FormField({
  label,
  htmlFor,
  required,
  helperText,
  errorMessage,
  className = '',
  children,
}: FormFieldProps) {
  const autoId = useId();
  const id = htmlFor ?? autoId;

  return (
    <div className={`tos-form-field${className ? ` ${className}` : ''}`}>
      {label && (
        <label
          htmlFor={id}
          className={`tos-field__label${required ? ' tos-field__label--required' : ''}`}
        >
          {label}
        </label>
      )}
      {children}
      {(errorMessage || helperText) && (
        <div className="tos-field__meta" style={{ marginTop: 4 }}>
          {errorMessage
            ? <span className="tos-field__error-msg" role="alert">{errorMessage}</span>
            : <span className="tos-field__hint">{helperText}</span>}
        </div>
      )}
    </div>
  );
}
