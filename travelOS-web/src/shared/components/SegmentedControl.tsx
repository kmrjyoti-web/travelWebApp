'use client';
import React from 'react';

export interface SegmentedControlOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  name?: string;
  className?: string;
}

export function SegmentedControl({
  options,
  value,
  defaultValue,
  onChange,
  size = 'md',
  disabled,
  fullWidth,
  name,
  className = '',
}: SegmentedControlProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? options[0]?.value ?? '');
  const current = value !== undefined ? value : internal;

  const handleSelect = (val: string) => {
    if (value === undefined) setInternal(val);
    onChange?.(val);
  };

  const cls = [
    'tos-segmented',
    `tos-segmented--${size}`,
    fullWidth ? 'tos-segmented--full' : '',
    disabled ? 'tos-segmented--disabled' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={cls} role="radiogroup" aria-label={name}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={current === opt.value}
          className={`tos-segmented__btn${current === opt.value ? ' tos-segmented__btn--active' : ''}`}
          disabled={disabled || opt.disabled}
          onClick={() => handleSelect(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
