'use client';
import React from 'react';
import { CFormInput, CFormLabel, CFormFeedback, CFormText } from '@coreui/react';
import type { ComponentProps } from 'react';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';

type CFormInputProps = ComponentProps<typeof CFormInput>;

export type InputVariant = 'outlined' | 'filled' | 'underlined';
export type InputSize = 'sm' | 'md';

export interface InputProps extends CFormInputProps {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  wrapperClassName?: string;
  icon?: IconName;
  variant?: InputVariant;
  inputSize?: InputSize;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, errorMessage, wrapperClassName, icon, floatingLabel, variant = 'outlined', inputSize = 'md', ...props }, ref) => {
    const labelText = typeof floatingLabel === 'string' ? floatingLabel : label;
    const inputId = props.id || (labelText ? labelText.toLowerCase().replace(/\s+/g, '-') : undefined);
    const variantCls = `tos-input--${variant}${inputSize === 'sm' ? ' tos-input--sm' : ''}`;
    const iconSize = inputSize === 'sm' ? 14 : 16;

    const inputEl = (
      <CFormInput
        ref={ref}
        id={inputId}
        invalid={!!errorMessage}
        floatingLabel={floatingLabel}
        placeholder={floatingLabel ? (props.placeholder || ' ') : props.placeholder}
        size={inputSize === 'sm' ? 'sm' : undefined}
        {...props}
      />
    );

    const feedback = (
      <>
        {errorMessage && <CFormFeedback invalid>{errorMessage}</CFormFeedback>}
        {helperText && !errorMessage && <CFormText>{helperText}</CFormText>}
      </>
    );

    if (icon) {
      return (
        <div className={`tos-icon-field ${variantCls} ${wrapperClassName || ''}`}>
          <span className="tos-icon-field__icon" aria-hidden="true">
            <Icon name={icon} size={iconSize} />
          </span>
          <div className="tos-icon-field__input">
            {!floatingLabel && label && <CFormLabel htmlFor={inputId}>{label}</CFormLabel>}
            {inputEl}
            {feedback}
          </div>
        </div>
      );
    }

    return (
      <div className={`${variantCls} ${wrapperClassName || ''}`}>
        {!floatingLabel && label && <CFormLabel htmlFor={inputId}>{label}</CFormLabel>}
        {inputEl}
        {feedback}
      </div>
    );
  }
);
Input.displayName = 'Input';
