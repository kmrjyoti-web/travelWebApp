'use client';
import React, { useId } from 'react';

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: string;
  description?: string;
  error?: boolean;
  name?: string;
  value?: string;
  id?: string;
  required?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      defaultChecked,
      indeterminate,
      disabled,
      label,
      description,
      error,
      name,
      value,
      id,
      required,
      className = '',
      onChange,
    },
    ref,
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    const wrapCls = [
      'tos-check',
      indeterminate      ? 'tos-check--indeterminate' : '',
      error              ? 'tos-check--error'         : '',
      disabled           ? 'tos-check--disabled'      : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <label className={wrapCls} htmlFor={inputId}>
        <input
          ref={ref}
          className="tos-check__native"
          type="checkbox"
          id={inputId}
          name={name}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          required={required}
          onChange={onChange}
        />
        <span className="tos-check__indicator" aria-hidden>
          {!indeterminate && (
            <span className="tos-check__indicator-icon">
              {/* checkmark svg */}
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
          {indeterminate && (
            <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
              <path d="M1 1h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </span>
        {(label || description) && (
          <span className="tos-check__content">
            {label && <span className="tos-check__label">{label}</span>}
            {description && <span className="tos-check__description">{description}</span>}
          </span>
        )}
      </label>
    );
  },
);
Checkbox.displayName = 'Checkbox';

/* ─── Switch (re-uses Checkbox structure) ─────────────────────────────────── */
export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  labelPosition?: 'left' | 'right';
  name?: string;
  value?: string;
  id?: string;
  required?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      checked,
      defaultChecked,
      disabled,
      label,
      description,
      size = 'md',
      labelPosition = 'right',
      name,
      value,
      id,
      required,
      className = '',
      onChange,
    },
    ref,
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    const wrapCls = [
      'tos-switch',
      `tos-switch--${size}`,
      labelPosition === 'left' ? 'tos-switch--label-left' : '',
      disabled ? 'tos-switch--disabled' : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <label className={wrapCls} htmlFor={inputId}>
        <input
          ref={ref}
          className="tos-switch__native"
          type="checkbox"
          role="switch"
          id={inputId}
          name={name}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          required={required}
          onChange={onChange}
        />
        <span className="tos-switch__track">
          <span className="tos-switch__thumb" />
        </span>
        {(label || description) && (
          <span className="tos-switch__content">
            {label && <span className="tos-switch__label">{label}</span>}
            {description && <span className="tos-switch__description">{description}</span>}
          </span>
        )}
      </label>
    );
  },
);
Switch.displayName = 'Switch';

/* ─── Radio ──────────────────────────────────────────────────────────────── */
export interface RadioProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  label?: string;
  description?: string;
  error?: boolean;
  name?: string;
  value?: string;
  id?: string;
  required?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    { checked, defaultChecked, disabled, label, description, error, name, value, id, required, className = '', onChange },
    ref,
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    const wrapCls = [
      'tos-check',
      'tos-check--radio',
      error    ? 'tos-check--error'   : '',
      disabled ? 'tos-check--disabled': '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <label className={wrapCls} htmlFor={inputId}>
        <input
          ref={ref}
          className="tos-check__native"
          type="radio"
          id={inputId}
          name={name}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          required={required}
          onChange={onChange}
        />
        <span className="tos-check__indicator" aria-hidden>
          <span className="tos-check__dot" />
        </span>
        {(label || description) && (
          <span className="tos-check__content">
            {label && <span className="tos-check__label">{label}</span>}
            {description && <span className="tos-check__description">{description}</span>}
          </span>
        )}
      </label>
    );
  },
);
Radio.displayName = 'Radio';
