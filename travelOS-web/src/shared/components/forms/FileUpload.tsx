'use client';
import React, { useId, useRef, useState } from 'react';
import { Icon } from '../Icon';

export interface FileUploadFile {
  file: File;
  id: string;
}

export interface FileUploadProps {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  wrapperClassName?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  maxSize?: number; // bytes
  maxFiles?: number;
  /** Hint shown in dropzone, e.g. "PNG, JPG up to 5 MB" */
  hint?: string;
  onChange?: (files: File[]) => void;
  onError?: (message: string) => void;
}

export function FileUpload({
  label,
  helperText,
  errorMessage,
  wrapperClassName = '',
  accept,
  multiple = false,
  disabled,
  maxSize,
  maxFiles,
  hint,
  onChange,
  onError,
}: FileUploadProps) {
  const autoId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileUploadFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const arr = Array.from(incoming);
    const errs: string[] = [];

    const valid = arr.filter((f) => {
      if (maxSize && f.size > maxSize) {
        errs.push(`"${f.name}" exceeds the ${formatBytes(maxSize)} limit.`);
        return false;
      }
      return true;
    });

    const next = [...files, ...valid.map((f) => ({ file: f, id: Math.random().toString(36).slice(2) }))];
    const capped = maxFiles ? next.slice(0, maxFiles) : next;

    setFiles(capped);
    setLocalError(errs.length ? errs[0] : null);
    if (errs.length) onError?.(errs.join(' '));
    onChange?.(capped.map((x) => x.file));
  };

  const remove = (id: string) => {
    const next = files.filter((f) => f.id !== id);
    setFiles(next);
    onChange?.(next.map((x) => x.file));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    addFiles(e.dataTransfer.files);
  };

  const displayError = errorMessage ?? localError;

  return (
    <div className={['tos-field', wrapperClassName].filter(Boolean).join(' ')}>
      {label && <label className="tos-field__label">{label}</label>}

      <div
        className={[
          'tos-file__zone',
          dragging ? 'tos-file__zone--dragging' : '',
          disabled ? 'tos-file__zone--disabled' : '',
        ].filter(Boolean).join(' ')}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload files"
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          style={{ display: 'none' }}
          onChange={(e) => addFiles(e.target.files)}
          aria-hidden
        />
        <span className="tos-file__zone-icon">
          <Icon name="Upload" size={28} />
        </span>
        <span className="tos-file__zone-label">
          {dragging ? 'Drop files here' : 'Click or drag & drop to upload'}
        </span>
        {hint && <span className="tos-file__zone-hint">{hint}</span>}
      </div>

      {files.length > 0 && (
        <div className="tos-file__list">
          {files.map(({ file, id }) => (
            <div key={id} className="tos-file__item">
              <Icon name="File" size={14} style={{ flexShrink: 0, color: 'var(--tos-text-muted)' }} />
              <span className="tos-file__item-name">{file.name}</span>
              <span className="tos-file__item-size">{formatBytes(file.size)}</span>
              <button type="button" className="tos-file__item-remove" onClick={() => remove(id)} aria-label={`Remove ${file.name}`}>
                <Icon name="X" size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="tos-field__meta">
        {displayError
          ? <span className="tos-field__error-msg" role="alert">{displayError}</span>
          : helperText
            ? <span className="tos-field__hint">{helperText}</span>
            : null}
      </div>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
