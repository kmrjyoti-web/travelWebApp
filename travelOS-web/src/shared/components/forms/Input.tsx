'use client';
import React, { useId, useState } from 'react';
import { CFormInput, CFormLabel, CFormFloating, CFormFeedback, CFormText } from '@coreui/react';
import type { ComponentProps } from 'react';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';

export type InputVariant = 'outlined' | 'filled' | 'underlined';
export type InputSize    = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<ComponentProps<typeof CFormInput>, 'size'> {
  /** Floating label text (floats on focus / value) */
  label?: string;
  /**
   * true  → floating label using `label` prop
   * string → floating label with this text (backward-compat with CoreUI API)
   * false → static label
   */
  floatingLabel?: boolean | string;
  /** Helper text below the field */
  helperText?: string;
  /** Error message — turns field red */
  errorMessage?: string;
  /** Extra className on the outer wrapper */
  wrapperClassName?: string;
  /** Left icon */
  icon?: IconName;
  /** Right icon (decorative) */
  iconRight?: IconName;
  /** Text prefix e.g. "$" */
  prefix?: string;
  /** Text suffix e.g. "kg" */
  suffix?: string;
  /** Visual variant */
  variant?: InputVariant;
  /** Field size */
  inputSize?: InputSize;
  /** Show ✕ clear button when field has value */
  clearable?: boolean;
  /** Show character count (requires maxLength) */
  showCharCount?: boolean;
  /** type="password" fields get eye toggle automatically */
  showPasswordToggle?: boolean;
  /** Called when clear button is clicked */
  onClear?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      floatingLabel,
      helperText,
      errorMessage,
      wrapperClassName = '',
      icon,
      iconRight,
      prefix,
      suffix,
      variant = 'outlined',
      inputSize = 'md',
      clearable,
      showCharCount,
      showPasswordToggle,
      onClear,
      onChange,
      value,
      defaultValue,
      type,
      id,
      required,
      disabled,
      maxLength,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    // floatingLabel can be: boolean | string (legacy CoreUI API where it was the label text)
    const floatLabelText = typeof floatingLabel === 'string' ? floatingLabel : undefined;
    const resolvedLabel  = floatLabelText ?? label;
    const isFloating     = floatingLabel !== false && !!resolvedLabel;
    const isPassword  = type === 'password';
    const [showPwd, setShowPwd] = useState(false);
    const [internalVal, setInternalVal] = useState('');

    // Track value for char count + clear button visibility
    const currentVal = value !== undefined ? String(value ?? '') : internalVal;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) setInternalVal(e.target.value);
      onChange?.(e);
    };

    // CSS classes
    const wrapCls = [
      'tos-field',
      `tos-field--${variant}`,
      `tos-field--${inputSize}`,
      icon                    ? 'tos-field--icon-left'  : '',
      iconRight || clearable || isPassword
                              ? 'tos-field--icon-right' : '',
      clearable               ? 'tos-field--has-clear'  : '',
      (isPassword || showPasswordToggle) ? 'tos-field--has-eye' : '',
      errorMessage            ? 'tos-field--error'      : '',
      disabled                ? 'tos-field--disabled'   : '',
      wrapperClassName,
    ].filter(Boolean).join(' ');

    const iconSize = inputSize === 'sm' ? 14 : inputSize === 'lg' ? 18 : 16;

    // Padding-right accounts for: clear + eye buttons
    const paddingRight = (() => {
      let r = 0;
      if (clearable && currentVal) r += 28;
      if (isPassword || showPasswordToggle) r += 28;
      if (iconRight && !clearable && !isPassword) r += 28;
      return r > 0 ? r + 8 : undefined;
    })();

    const inputProps = {
      ref,
      id: inputId,
      type: isPassword ? (showPwd ? 'text' : 'password') : type,
      disabled,
      required,
      maxLength,
      invalid: !!errorMessage,
      placeholder: isFloating ? ' ' : rest.placeholder,
      style: {
        paddingRight: paddingRight ? `${paddingRight}px` : undefined,
        ...rest.style,
      },
      onChange: handleChange,
      value,
      defaultValue,
      ...rest,
    };

    // Right-side action buttons
    const actions: React.ReactNode[] = [];
    let actionRight = 8;

    if (clearable && currentVal && !disabled) {
      actions.push(
        <button
          key="clear"
          type="button"
          className="tos-field__action tos-field__action--clear"
          style={{ right: `${actionRight}px` }}
          onClick={() => {
            setInternalVal('');
            onClear?.();
          }}
          aria-label="Clear"
          tabIndex={-1}
        >
          <Icon name="X" size={12} />
        </button>,
      );
      actionRight += 28;
    }

    if (isPassword || showPasswordToggle) {
      actions.push(
        <button
          key="eye"
          type="button"
          className="tos-field__action tos-field__action--eye"
          style={{ right: `${actionRight}px` }}
          onClick={() => setShowPwd((p) => !p)}
          aria-label={showPwd ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          <Icon name={showPwd ? 'EyeOff' : 'Eye'} size={iconSize} />
        </button>,
      );
    } else if (iconRight) {
      actions.push(
        <span key="icon-r" className="tos-field__icon tos-field__icon--right" aria-hidden>
          <Icon name={iconRight} size={iconSize} />
        </span>,
      );
    }

    const feedbackEl = (
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

    // ── With prefix / suffix ─────────────────────────────────────────────
    if (prefix || suffix) {
      return (
        <div className={wrapCls}>
          {!isFloating && resolvedLabel && (
            <label htmlFor={inputId} className={`tos-field__label${required ? ' tos-field__label--required' : ''}`}>
              {resolvedLabel}
            </label>
          )}
          <div className="tos-field__affix-row">
            {prefix && <span className="tos-field__prefix">{prefix}</span>}
            <CFormInput {...inputProps} style={{ borderRadius: 0, ...inputProps.style }} />
            {suffix && <span className="tos-field__suffix">{suffix}</span>}
          </div>
          {(errorMessage || helperText || showCharCount) && feedbackEl}
        </div>
      );
    }

    // ── Floating label ───────────────────────────────────────────────────
    if (isFloating) {
      return (
        <div className={wrapCls}>
          {icon && (
            <span className="tos-field__icon tos-field__icon--left" aria-hidden>
              <Icon name={icon} size={iconSize} />
            </span>
          )}
          <CFormFloating>
            <CFormInput {...inputProps} />
            <CFormLabel htmlFor={inputId}>
              {resolvedLabel}{required && <span style={{ color: 'var(--tos-danger)' }}> *</span>}
            </CFormLabel>
          </CFormFloating>
          {actions}
          {(errorMessage || helperText || showCharCount) && feedbackEl}
        </div>
      );
    }

    // ── Static label ─────────────────────────────────────────────────────
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
        <CFormInput {...inputProps} />
        {actions}
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
Input.displayName = 'Input';
