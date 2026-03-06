'use client';
import React, { useId, useState } from 'react';
import { CFormTextarea, CFormLabel, CFormFloating, CFormFeedback, CFormText } from '@coreui/react';
import type { ComponentProps } from 'react';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import type { InputVariant, InputSize } from './Input';

export interface TextareaProps extends ComponentProps<typeof CFormTextarea> {
  label?: string;
  floatingLabel?: boolean | string;
  helperText?: string;
  errorMessage?: string;
  wrapperClassName?: string;
  icon?: IconName;
  variant?: InputVariant;
  inputSize?: InputSize;
  showCharCount?: boolean;
  required?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
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
      showCharCount,
      id,
      required,
      disabled,
      maxLength,
      value,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const floatLabelText = typeof floatingLabel === 'string' ? floatingLabel : undefined;
    const resolvedLabel  = floatLabelText ?? label;
    const isFloating     = floatingLabel !== false && !!resolvedLabel;
    const [internalVal, setInternalVal] = useState('');
    const currentVal = value !== undefined ? String(value ?? '') : internalVal;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (value === undefined) setInternalVal(e.target.value);
      onChange?.(e);
    };

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

    const textareaEl = (
      <CFormTextarea
        ref={ref}
        id={inputId}
        invalid={!!errorMessage}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        value={value}
        placeholder={isFloating ? ' ' : rest.placeholder}
        onChange={handleChange}
        rows={rest.rows ?? 3}
        {...rest}
      />
    );

    const meta = (errorMessage || helperText || showCharCount) && (
      <div className="tos-field__meta">
        {errorMessage
          ? <span className="tos-field__error-msg" role="alert">{errorMessage}</span>
          : helperText
            ? <span className="tos-field__hint">{helperText}</span>
            : <span />}
        {showCharCount && maxLength && (
          <span className={[
            'tos-field__count',
            currentVal.length >= maxLength ? 'tos-field__count--full' :
            currentVal.length >= maxLength * 0.9 ? 'tos-field__count--warn' : '',
          ].filter(Boolean).join(' ')}>
            {currentVal.length}/{maxLength}
          </span>
        )}
      </div>
    );

    if (isFloating) {
      return (
        <div className={wrapCls}>
          {icon && (
            <span className="tos-field__icon tos-field__icon--left" style={{ top: 20 }} aria-hidden>
              <Icon name={icon} size={iconSize} />
            </span>
          )}
          <CFormFloating>
            {textareaEl}
            <CFormLabel htmlFor={inputId}>
              {resolvedLabel}{required && <span style={{ color: 'var(--tos-danger)' }}> *</span>}
            </CFormLabel>
          </CFormFloating>
          {meta}
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
          <span className="tos-field__icon tos-field__icon--left" style={{ top: 20 }} aria-hidden>
            <Icon name={icon} size={iconSize} />
          </span>
        )}
        {textareaEl}
        {errorMessage && <CFormFeedback invalid>{errorMessage}</CFormFeedback>}
        {helperText && !errorMessage && <CFormText>{helperText}</CFormText>}
        {showCharCount && maxLength && (
          <div className="tos-field__meta">
            <span />
            <span className="tos-field__count">{currentVal.length}/{maxLength}</span>
          </div>
        )}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';
