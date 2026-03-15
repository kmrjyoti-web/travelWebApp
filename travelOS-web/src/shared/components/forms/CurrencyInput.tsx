'use client';
import React, { useId } from 'react';
import { CFormInput, CFormLabel, CFormFeedback, CFormText } from '@coreui/react';
import { InputGroup, InputGroupText } from '../InputGroup';
import type { InputVariant, InputSize } from './Input';

export interface CurrencyInputProps {
  label?: string;
  currency?: string;      // e.g. "USD", "INR", "EUR"
  currencySymbol?: string; // e.g. "$", "₹", "€" — shown as prefix
  helperText?: string;
  errorMessage?: string;
  wrapperClassName?: string;
  variant?: InputVariant;
  inputSize?: InputSize;
  value?: number | string;
  defaultValue?: number | string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      label,
      currency,
      currencySymbol = '$',
      helperText,
      errorMessage,
      wrapperClassName = '',
      variant = 'outlined',
      inputSize = 'md',
      value,
      defaultValue,
      min,
      max,
      step = 0.01,
      disabled,
      required,
      id,
      name,
      placeholder = '0.00',
      onChange,
    },
    ref,
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    const wrapCls = [
      'tos-field',
      `tos-field--${variant}`,
      `tos-field--${inputSize}`,
      errorMessage ? 'tos-field--error' : '',
      disabled ? 'tos-field--disabled' : '',
      wrapperClassName,
    ].filter(Boolean).join(' ');

    return (
      <div className={wrapCls}>
        {label && (
          <CFormLabel htmlFor={inputId} className={required ? 'tos-field__label--required' : ''}>
            {label}
          </CFormLabel>
        )}
        <InputGroup>
          <InputGroupText>{currency || currencySymbol}</InputGroupText>
          <CFormInput
            ref={ref}
            id={inputId}
            name={name}
            type="number"
            value={value}
            defaultValue={defaultValue}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            required={required}
            invalid={!!errorMessage}
            placeholder={placeholder}
            onChange={onChange}
          />
        </InputGroup>
        {errorMessage && <CFormFeedback invalid>{errorMessage}</CFormFeedback>}
        {helperText && !errorMessage && <CFormText>{helperText}</CFormText>}
      </div>
    );
  },
);
CurrencyInput.displayName = 'CurrencyInput';
