'use client';
import React from 'react';

export interface FieldsetProps {
  legend?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Fieldset({ legend, description, disabled, className = '', children }: FieldsetProps) {
  return (
    <fieldset className={`tos-fieldset ${className}`.trim()} disabled={disabled}>
      {legend && <legend className="tos-fieldset__legend">{legend}</legend>}
      {description && <p className="tos-fieldset__description">{description}</p>}
      <div className="tos-fieldset__content">{children}</div>
    </fieldset>
  );
}
