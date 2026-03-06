'use client';
import React, { useId, useState } from 'react';
import { CFormInput, CFormLabel, CFormFeedback, CFormText } from '@coreui/react';
import type { InputVariant, InputSize } from './Input';

export interface NumberInputProps {
  label?: string;
  floatingLabel?: boolean;
  helperText?: string;
  errorMessage?: string;
  wrapperClassName?: string;
  variant?: InputVariant;
  inputSize?: InputSize;
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  placeholder?: string;
  onChange?: (value: number | null) => void;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      label,
      floatingLabel,
      helperText,
      errorMessage,
      wrapperClassName = '',
      variant = 'outlined',
      inputSize = 'md',
      value,
      defaultValue,
      min,
      max,
      step = 1,
      disabled,
      required,
      id,
      name,
      placeholder,
      onChange,
    },
    ref,
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const [internal, setInternal] = useState<number | ''>(defaultValue ?? '');
    const current = value !== undefined ? value : internal;

    const update = (next: number) => {
      const clamped = min !== undefined && next < min ? min
                    : max !== undefined && next > max ? max
                    : next;
      if (value === undefined) setInternal(clamped);
      onChange?.(clamped);
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      if (v === '') { if (value === undefined) setInternal(''); onChange?.(null as unknown as number); return; }
      const n = parseFloat(v);
      if (!isNaN(n)) update(n);
    };

    const wrapCls = [
      'tos-field',
      `tos-field--${variant}`,
      `tos-field--${inputSize}`,
      errorMessage ? 'tos-field--error'   : '',
      disabled     ? 'tos-field--disabled': '',
      wrapperClassName,
    ].filter(Boolean).join(' ');

    return (
      <div className={wrapCls}>
        {label && !floatingLabel && (
          <CFormLabel htmlFor={inputId} className={required ? 'tos-field__label--required' : ''}>
            {label}
          </CFormLabel>
        )}
        <div className="tos-number">
          <button
            type="button"
            className="tos-number__btn tos-number__btn--dec"
            disabled={disabled || (min !== undefined && Number(current) <= min)}
            onClick={() => update(Number(current) - step)}
            aria-label="Decrease"
            tabIndex={-1}
          >
            −
          </button>
          <CFormInput
            ref={ref}
            id={inputId}
            name={name}
            type="number"
            value={current}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            required={required}
            invalid={!!errorMessage}
            placeholder={placeholder}
            onChange={handleInput}
            style={{ textAlign: 'center' }}
          />
          <button
            type="button"
            className="tos-number__btn tos-number__btn--inc"
            disabled={disabled || (max !== undefined && Number(current) >= max)}
            onClick={() => update(Number(current) + step)}
            aria-label="Increase"
            tabIndex={-1}
          >
            +
          </button>
        </div>
        {errorMessage && <CFormFeedback invalid>{errorMessage}</CFormFeedback>}
        {helperText && !errorMessage && <CFormText>{helperText}</CFormText>}
      </div>
    );
  },
);
NumberInput.displayName = 'NumberInput';
