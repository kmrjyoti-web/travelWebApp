'use client';
import React, { useId } from 'react';
import { CFormInput, CFormLabel, CFormFeedback, CFormText, CFormSelect } from '@coreui/react';
import { InputGroup } from '../InputGroup';
import type { InputVariant, InputSize } from './Input';

const DEFAULT_ISD_CODES = [
  { code: '+1', label: '+1 (US)' },
  { code: '+44', label: '+44 (UK)' },
  { code: '+91', label: '+91 (IN)' },
  { code: '+61', label: '+61 (AU)' },
  { code: '+81', label: '+81 (JP)' },
  { code: '+49', label: '+49 (DE)' },
  { code: '+33', label: '+33 (FR)' },
  { code: '+971', label: '+971 (AE)' },
  { code: '+65', label: '+65 (SG)' },
  { code: '+86', label: '+86 (CN)' },
];

export interface ISDOption {
  code: string;
  label: string;
}

export interface PhoneInputProps {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  wrapperClassName?: string;
  variant?: InputVariant;
  inputSize?: InputSize;
  isdCode?: string;
  phoneNumber?: string;
  defaultIsdCode?: string;
  defaultPhoneNumber?: string;
  isdOptions?: ISDOption[];
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  placeholder?: string;
  onIsdChange?: (code: string) => void;
  onPhoneChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      wrapperClassName = '',
      variant = 'outlined',
      inputSize = 'md',
      isdCode,
      phoneNumber,
      defaultIsdCode = '+1',
      defaultPhoneNumber,
      isdOptions = DEFAULT_ISD_CODES,
      disabled,
      required,
      id,
      name,
      placeholder = 'Phone number',
      onIsdChange,
      onPhoneChange,
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
          <CFormSelect
            value={isdCode}
            defaultValue={isdCode === undefined ? defaultIsdCode : undefined}
            disabled={disabled}
            onChange={(e) => onIsdChange?.(e.target.value)}
            style={{ maxWidth: '120px', flex: '0 0 auto' }}
            aria-label="Country code"
          >
            {isdOptions.map((opt) => (
              <option key={opt.code} value={opt.code}>{opt.label}</option>
            ))}
          </CFormSelect>
          <CFormInput
            ref={ref}
            id={inputId}
            name={name}
            type="tel"
            value={phoneNumber}
            defaultValue={phoneNumber === undefined ? defaultPhoneNumber : undefined}
            disabled={disabled}
            required={required}
            invalid={!!errorMessage}
            placeholder={placeholder}
            onChange={onPhoneChange}
          />
        </InputGroup>
        {errorMessage && <CFormFeedback invalid>{errorMessage}</CFormFeedback>}
        {helperText && !errorMessage && <CFormText>{helperText}</CFormText>}
      </div>
    );
  },
);
PhoneInput.displayName = 'PhoneInput';
