'use client';
import React from 'react';
import { Icon } from './Icon';

export interface FormErrorsProps {
  /** react-hook-form `formState.errors` or any Record<key, { message? }> */
  errors: Record<string, { message?: string } | undefined>;
  className?: string;
}

/**
 * Renders a red alert box listing all form validation errors.
 * Returns null when there are no errors.
 *
 * @example
 * <FormErrors errors={formState.errors} />
 */
export function FormErrors({ errors, className = '' }: FormErrorsProps) {
  const messages = Object.values(errors)
    .map((e) => e?.message)
    .filter(Boolean) as string[];

  if (messages.length === 0) return null;

  return (
    <div
      className={`tos-form-errors${className ? ` ${className}` : ''}`}
      role="alert"
      aria-live="polite"
    >
      <span className="tos-form-errors__icon" aria-hidden>
        <Icon name="CircleAlert" size={14} />
      </span>
      <ul className="tos-form-errors__list">
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
