'use client';
import React from 'react';
import { Checkbox } from './Checkbox';
import type { CheckboxProps } from './Checkbox';

export interface CheckboxGroupOption extends Omit<CheckboxProps, 'onChange' | 'checked'> {
  value: string;
  label: string;
}

export interface CheckboxGroupProps {
  legend?: string;
  options: CheckboxGroupOption[];
  values?: string[];
  defaultValues?: string[];
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  onChange?: (values: string[]) => void;
}

export function CheckboxGroup({
  legend,
  options,
  values,
  defaultValues,
  orientation = 'vertical',
  disabled,
  error,
  errorMessage,
  className = '',
  onChange,
}: CheckboxGroupProps) {
  const [internal, setInternal] = React.useState<string[]>(defaultValues ?? []);
  const selected = values !== undefined ? values : internal;

  const handleChange = (optValue: string, checked: boolean) => {
    const next = checked
      ? [...selected, optValue]
      : selected.filter((v) => v !== optValue);
    if (values === undefined) setInternal(next);
    onChange?.(next);
  };

  const groupCls = [
    'tos-check-group',
    orientation === 'horizontal' ? 'tos-check-group--horizontal' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
      {legend && <legend className="tos-check-group__legend">{legend}</legend>}
      <div className={groupCls} role="group" aria-label={legend}>
        {options.map((opt) => (
          <Checkbox
            key={opt.value}
            value={opt.value}
            label={opt.label}
            description={opt.description}
            checked={selected.includes(opt.value)}
            disabled={disabled || opt.disabled}
            error={error}
            onChange={(e) => handleChange(opt.value, e.target.checked)}
          />
        ))}
      </div>
      {errorMessage && (
        <span className="tos-check-group__error" role="alert">{errorMessage}</span>
      )}
    </fieldset>
  );
}
