'use client';
import React, { useId } from 'react';
import { CFormRange, CFormLabel } from '@coreui/react';

export interface SliderProps {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  disabled?: boolean;
  showValue?: boolean;
  showMinMax?: boolean;
  formatValue?: (v: number) => string;
  id?: string;
  name?: string;
  className?: string;
  onChange?: (value: number) => void;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      label,
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue,
      disabled,
      showValue = true,
      showMinMax = false,
      formatValue = (v) => String(v),
      id,
      name,
      className = '',
      onChange,
    },
    ref,
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const [internal, setInternal] = React.useState(defaultValue ?? min);
    const current = value !== undefined ? value : internal;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Number(e.target.value);
      if (value === undefined) setInternal(v);
      onChange?.(v);
    };

    return (
      <div className={`tos-slider ${className}`.trim()}>
        {(label || showValue) && (
          <div className="tos-slider__header">
            {label && <CFormLabel htmlFor={inputId}>{label}</CFormLabel>}
            {showValue && <span className="tos-slider__value">{formatValue(current)}</span>}
          </div>
        )}
        <CFormRange
          ref={ref}
          id={inputId}
          name={name}
          min={min}
          max={max}
          step={step}
          value={current}
          disabled={disabled}
          onChange={handleChange}
        />
        {showMinMax && (
          <div className="tos-slider__minmax">
            <span>{formatValue(min)}</span>
            <span>{formatValue(max)}</span>
          </div>
        )}
      </div>
    );
  },
);
Slider.displayName = 'Slider';
