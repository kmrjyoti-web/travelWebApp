'use client';
import React, { useId } from 'react';
import { Radio } from './Checkbox';
import type { RadioProps } from './Checkbox';

export interface RadioGroupOption extends Omit<RadioProps, 'onChange' | 'checked' | 'name'> {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  name?: string;
  legend?: string;
  options: RadioGroupOption[];
  value?: string;
  defaultValue?: string;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  className?: string;
  onChange?: (value: string) => void;
}

export function RadioGroup({
  name,
  legend,
  options,
  value,
  defaultValue,
  orientation = 'vertical',
  disabled,
  error,
  errorMessage,
  required,
  className = '',
  onChange,
}: RadioGroupProps) {
  const autoName = useId();
  const groupName = name ?? autoName;
  const [internal, setInternal] = React.useState(defaultValue ?? '');
  const selected = value !== undefined ? value : internal;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) setInternal(e.target.value);
    onChange?.(e.target.value);
  };

  const groupCls = [
    'tos-check-group',
    orientation === 'horizontal' ? 'tos-check-group--horizontal' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
      {legend && <legend className="tos-check-group__legend">{legend}</legend>}
      <div className={groupCls} role="radiogroup" aria-label={legend} aria-required={required}>
        {options.map((opt) => (
          <Radio
            key={opt.value}
            name={groupName}
            value={opt.value}
            label={opt.label}
            description={opt.description}
            checked={selected === opt.value}
            disabled={disabled || opt.disabled}
            error={error}
            required={required}
            onChange={handleChange}
          />
        ))}
      </div>
      {errorMessage && (
        <span className="tos-check-group__error" role="alert">{errorMessage}</span>
      )}
    </fieldset>
  );
}
