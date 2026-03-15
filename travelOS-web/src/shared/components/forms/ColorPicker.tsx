'use client';
import React, { useId } from 'react';
import { CFormLabel } from '@coreui/react';

export interface ColorPickerProps {
  label?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  showHexValue?: boolean;
  id?: string;
  name?: string;
  className?: string;
  onChange?: (color: string) => void;
}

export const ColorPicker = React.forwardRef<HTMLInputElement, ColorPickerProps>(
  (
    {
      label,
      value,
      defaultValue = '#000000',
      disabled,
      required,
      showHexValue = true,
      id,
      name,
      className = '',
      onChange,
    },
    ref,
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const [internal, setInternal] = React.useState(defaultValue);
    const current = value !== undefined ? value : internal;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const c = e.target.value;
      if (value === undefined) setInternal(c);
      onChange?.(c);
    };

    return (
      <div className={`tos-color-picker ${className}`.trim()}>
        {label && (
          <CFormLabel htmlFor={inputId} className={required ? 'tos-field__label--required' : ''}>
            {label}
          </CFormLabel>
        )}
        <div className="tos-color-picker__row">
          <input
            ref={ref}
            id={inputId}
            name={name}
            type="color"
            value={current}
            disabled={disabled}
            required={required}
            onChange={handleChange}
            className="tos-color-picker__input"
          />
          {showHexValue && (
            <span className="tos-color-picker__hex">{current.toUpperCase()}</span>
          )}
        </div>
      </div>
    );
  },
);
ColorPicker.displayName = 'ColorPicker';
