'use client';
import React, { useId, useRef, useState } from 'react';

export interface OTPInputProps {
  length?: number;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  inputSize?: 'sm' | 'md' | 'lg';
  /** Show separator dot after this index (e.g. 2 = after box 3) */
  separatorAfter?: number;
  autoFocus?: boolean;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
}

export function OTPInput({
  length = 6,
  value,
  defaultValue = '',
  disabled,
  error,
  errorMessage,
  inputSize = 'md',
  separatorAfter,
  autoFocus,
  onChange,
  onComplete,
}: OTPInputProps) {
  const autoId = useId();
  const [internal, setInternal] = useState(defaultValue.slice(0, length).padEnd(length, ''));
  const otp = value !== undefined ? value.slice(0, length).padEnd(length, '') : internal;
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const set = (next: string) => {
    const padded = next.slice(0, length).padEnd(length, '');
    if (value === undefined) setInternal(padded);
    onChange?.(padded.trimEnd());
    if (padded.trimEnd().length === length) onComplete?.(padded.trimEnd());
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (otp[idx]) {
        const next = otp.slice(0, idx) + '' + otp.slice(idx + 1);
        set(next);
      } else if (idx > 0) {
        const next = otp.slice(0, idx - 1) + '' + otp.slice(idx);
        set(next);
        refs.current[idx - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      refs.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < length - 1) {
      refs.current[idx + 1]?.focus();
    }
  };

  const handleChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const next = otp.slice(0, idx) + (char || ' ') + otp.slice(idx + 1);
    set(next);
    if (char && idx < length - 1) refs.current[idx + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    set(pasted.padEnd(length, ''));
    const nextFocus = Math.min(pasted.length, length - 1);
    refs.current[nextFocus]?.focus();
  };

  const otpCls = [
    'tos-otp',
    `tos-otp--${inputSize}`,
    error ? 'tos-otp--error' : '',
  ].filter(Boolean).join(' ');

  return (
    <div>
      <div className={otpCls} role="group" aria-label="One-time password">
        {Array.from({ length }).map((_, idx) => (
          <React.Fragment key={idx}>
            <input
              ref={(el) => { refs.current[idx] = el; }}
              className="tos-otp__box"
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otp[idx]?.trim() || ''}
              disabled={disabled}
              autoFocus={autoFocus && idx === 0}
              aria-label={`Digit ${idx + 1}`}
              onChange={(e) => handleChange(idx, e)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
            />
            {separatorAfter === idx && (
              <span className="tos-otp__sep" aria-hidden>·</span>
            )}
          </React.Fragment>
        ))}
      </div>
      {errorMessage && (
        <div className="tos-field__meta">
          <span className="tos-field__error-msg" role="alert">{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
