'use client';
import React, { useId } from 'react';
import { CFormSelect, CFormLabel, CFormFloating, CFormFeedback, CFormText } from '@coreui/react';
import type { ComponentProps } from 'react';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import type { InputVariant, InputSize } from './Input';

export interface SelectProps extends Omit<ComponentProps<typeof CFormSelect>, 'size'> {
  label?: string;
  floatingLabel?: boolean | string;
  helperText?: string;
  errorMessage?: string;
  wrapperClassName?: string;
  icon?: IconName;
  variant?: InputVariant;
  inputSize?: InputSize;
  required?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      floatingLabel,
      helperText,
      errorMessage,
      wrapperClassName = '',
      icon,
      variant = 'outlined',
      inputSize = 'md',
      id,
      required,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const floatLabelText = typeof floatingLabel === 'string' ? floatingLabel : undefined;
    const resolvedLabel  = floatLabelText ?? label;
    const isFloating     = floatingLabel !== false && !!resolvedLabel;

    const wrapCls = [
      'tos-field',
      `tos-field--${variant}`,
      `tos-field--${inputSize}`,
      icon         ? 'tos-field--icon-left' : '',
      errorMessage ? 'tos-field--error'     : '',
      disabled     ? 'tos-field--disabled'  : '',
      wrapperClassName,
    ].filter(Boolean).join(' ');

    const iconSize = inputSize === 'sm' ? 14 : inputSize === 'lg' ? 18 : 16;

    const selectEl = (
      <CFormSelect
        ref={ref}
        id={inputId}
        invalid={!!errorMessage}
        disabled={disabled}
        required={required}
        {...rest}
      />
    );

    if (isFloating) {
      return (
        <div className={wrapCls}>
          {icon && (
            <span className="tos-field__icon tos-field__icon--left" aria-hidden>
              <Icon name={icon} size={iconSize} />
            </span>
          )}
          <CFormFloating>
            {selectEl}
            <CFormLabel htmlFor={inputId}>
              {resolvedLabel}{required && <span style={{ color: 'var(--tos-danger)' }}> *</span>}
            </CFormLabel>
          </CFormFloating>
          {errorMessage && <span className="tos-field__error-msg" role="alert">{errorMessage}</span>}
          {helperText && !errorMessage && <span className="tos-field__hint">{helperText}</span>}
        </div>
      );
    }

    return (
      <div className={wrapCls}>
        {resolvedLabel && (
          <CFormLabel htmlFor={inputId} className={required ? 'tos-field__label--required' : ''}>
            {resolvedLabel}
          </CFormLabel>
        )}
        {icon && (
          <span className="tos-field__icon tos-field__icon--left" aria-hidden>
            <Icon name={icon} size={iconSize} />
          </span>
        )}
        {selectEl}
        {errorMessage && <CFormFeedback invalid>{errorMessage}</CFormFeedback>}
        {helperText && !errorMessage && <CFormText>{helperText}</CFormText>}
      </div>
    );
  },
);
Select.displayName = 'Select';
