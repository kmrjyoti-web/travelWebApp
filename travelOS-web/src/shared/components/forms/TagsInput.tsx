'use client';
import React, { useId, useRef, useState } from 'react';
import { Icon } from '../Icon';

export interface TagsInputProps {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  wrapperClassName?: string;
  value?: string[];
  defaultValue?: string[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  maxTags?: number;
  id?: string;
  /** Separator keys that add a tag — default: ['Enter', ','] */
  separators?: string[];
  onChange?: (tags: string[]) => void;
}

export function TagsInput({
  label,
  helperText,
  errorMessage,
  wrapperClassName = '',
  value,
  defaultValue,
  placeholder = 'Add tag…',
  disabled,
  maxTags,
  id,
  separators = ['Enter', ','],
  onChange,
}: TagsInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [internal, setInternal] = useState<string[]>(defaultValue ?? []);
  const [draft, setDraft] = useState('');
  const tags = value !== undefined ? value : internal;

  const addTag = (raw: string) => {
    const tag = raw.trim().replace(/,$/, '').trim();
    if (!tag || tags.includes(tag)) return;
    if (maxTags && tags.length >= maxTags) return;
    const next = [...tags, tag];
    if (value === undefined) setInternal(next);
    onChange?.(next);
    setDraft('');
  };

  const removeTag = (idx: number) => {
    const next = tags.filter((_, i) => i !== idx);
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (separators.includes(e.key)) { e.preventDefault(); addTag(draft); return; }
    if (e.key === 'Backspace' && !draft && tags.length) removeTag(tags.length - 1);
  };

  const wrapCls = [
    'tos-field',
    errorMessage ? 'tos-field--error' : '',
    disabled     ? 'tos-field--disabled' : '',
    wrapperClassName,
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapCls}>
      {label && (
        <label htmlFor={inputId} className="tos-field__label">
          {label}
        </label>
      )}
      <div
        className={`tos-tags${errorMessage ? ' tos-tags--error' : ''}${disabled ? ' tos-tags--disabled' : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, idx) => (
          <span key={idx} className="tos-tags__chip">
            {tag}
            <button
              type="button"
              className="tos-tags__chip-remove"
              onClick={(e) => { e.stopPropagation(); removeTag(idx); }}
              aria-label={`Remove ${tag}`}
              tabIndex={-1}
            >
              <Icon name="X" size={10} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          id={inputId}
          className="tos-tags__input"
          value={draft}
          placeholder={(!maxTags || tags.length < maxTags) ? placeholder : undefined}
          disabled={disabled || (!!maxTags && tags.length >= maxTags)}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKey}
          onBlur={() => draft && addTag(draft)}
          aria-label={label ?? 'Tags'}
        />
      </div>
      <div className="tos-field__meta">
        {errorMessage
          ? <span className="tos-field__error-msg" role="alert">{errorMessage}</span>
          : helperText
            ? <span className="tos-field__hint">{helperText}</span>
            : null}
      </div>
    </div>
  );
}
