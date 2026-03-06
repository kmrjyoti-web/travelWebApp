'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Icon } from './Icon';
import { Spinner } from './Spinner';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Debounce delay in ms (default 300) */
  debounceMs?: number;
  /** Shows spinner inside input while true */
  loading?: boolean;
  disabled?: boolean;
  /** Input size */
  inputSize?: 'sm' | 'md' | 'lg';
  className?: string;
  autoFocus?: boolean;
  'aria-label'?: string;
}

/**
 * Debounced search input with search icon, clear button, and optional loading indicator.
 * Calls onChange with the debounced value — NOT on every keystroke.
 *
 * @example
 * const [query, setQuery] = useState('');
 * <SearchInput value={query} onChange={setQuery} placeholder="Search itineraries…" />
 */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  debounceMs = 300,
  loading = false,
  disabled = false,
  inputSize = 'md',
  className = '',
  autoFocus = false,
  'aria-label': ariaLabel = 'Search',
}: SearchInputProps) {
  const [draft, setDraft] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Sync external value → draft (e.g. on reset)
  useEffect(() => { setDraft(value); }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setDraft(next);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(next), debounceMs);
  }, [onChange, debounceMs]);

  const handleClear = useCallback(() => {
    clearTimeout(timerRef.current);
    setDraft('');
    onChange('');
  }, [onChange]);

  // Cleanup on unmount
  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div className={`tos-search-input tos-search-input--${inputSize}${disabled ? ' tos-search-input--disabled' : ''}${className ? ` ${className}` : ''}`}>
      <span className="tos-search-input__icon" aria-hidden>
        <Icon name="Search" size={inputSize === 'sm' ? 14 : 16} />
      </span>

      <input
        type="search"
        className="tos-search-input__field"
        value={draft}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        aria-label={ariaLabel}
        autoComplete="off"
        spellCheck={false}
      />

      <span className="tos-search-input__end">
        {loading
          ? <Spinner size="sm" component="span" aria-hidden />
          : draft && (
              <button
                type="button"
                className="tos-search-input__clear"
                onClick={handleClear}
                aria-label="Clear search"
                tabIndex={0}
              >
                <Icon name="X" size={14} aria-hidden />
              </button>
            )}
      </span>
    </div>
  );
}
