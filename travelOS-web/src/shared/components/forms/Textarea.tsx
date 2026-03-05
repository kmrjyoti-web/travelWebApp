'use client';
import React from 'react';
import { CFormTextarea, CFormLabel, CFormFeedback } from '@coreui/react';
import type { ComponentProps } from 'react';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import type { InputVariant, InputSize } from './Input';

type CFormTextareaProps = ComponentProps<typeof CFormTextarea>;

export interface TextareaProps extends CFormTextareaProps {
  label?: string;
  errorMessage?: string;
  wrapperClassName?: string;
  icon?: IconName;
  variant?: InputVariant;
  inputSize?: InputSize;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, errorMessage, wrapperClassName, icon, floatingLabel, variant = 'outlined', inputSize = 'md', ...props }, ref) => {
    const labelText = typeof floatingLabel === 'string' ? floatingLabel : label;
    const inputId = props.id || (labelText ? labelText.toLowerCase().replace(/\s+/g, '-') : undefined);
    const variantCls = `tos-input--${variant}${inputSize === 'sm' ? ' tos-input--sm' : ''}`;
    const iconSize = inputSize === 'sm' ? 14 : 16;

    const textareaEl = (
      <CFormTextarea
        ref={ref}
        id={inputId}
        invalid={!!errorMessage}
        floatingLabel={floatingLabel}
        placeholder={floatingLabel ? (props.placeholder || ' ') : props.placeholder}
        rows={3}
        {...props}
      />
    );

    const feedback = errorMessage ? <CFormFeedback invalid>{errorMessage}</CFormFeedback> : null;

    if (icon) {
      return (
        <div className={`tos-icon-field ${variantCls} ${wrapperClassName || ''}`}>
          <span className="tos-icon-field__icon" aria-hidden="true">
            <Icon name={icon} size={iconSize} />
          </span>
          <div className="tos-icon-field__input">
            {!floatingLabel && label && <CFormLabel htmlFor={inputId}>{label}</CFormLabel>}
            {textareaEl}
            {feedback}
          </div>
        </div>
      );
    }

    return (
      <div className={`${variantCls} ${wrapperClassName || ''}`}>
        {!floatingLabel && label && <CFormLabel htmlFor={inputId}>{label}</CFormLabel>}
        {textareaEl}
        {feedback}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
