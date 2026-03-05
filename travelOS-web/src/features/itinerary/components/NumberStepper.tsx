'use client';
import React from 'react';
import { Icon } from '@/shared/components';
import type { IconName } from '@/shared/components';

interface NumberStepperProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  label: string;
  icon?: IconName;
}

export function NumberStepper({ value, onChange, min = 0, max = 20, label, icon }: NumberStepperProps) {
  return (
    <div className="tos-icon-field">
      {icon && (
        <span className="tos-icon-field__icon" aria-hidden="true">
          <Icon name={icon} size={16} />
        </span>
      )}
      <div className="tos-icon-field__input">
        <label className="tos-stepper__label">{label}</label>
        <div className="tos-number-stepper">
          <button
            type="button"
            className="tos-number-stepper__btn"
            onClick={() => onChange(Math.max(min, value - 1))}
            disabled={value <= min}
            aria-label={`Decrease ${label}`}
          >
            −
          </button>
          <span className="tos-number-stepper__value" aria-live="polite">
            {value}
          </span>
          <button
            type="button"
            className="tos-number-stepper__btn"
            onClick={() => onChange(Math.min(max, value + 1))}
            disabled={value >= max}
            aria-label={`Increase ${label}`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
