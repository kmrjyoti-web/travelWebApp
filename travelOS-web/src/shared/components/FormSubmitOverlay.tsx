'use client';
import React from 'react';
import { Spinner } from './Spinner';

export interface FormSubmitOverlayProps {
  /** Show the overlay */
  isSubmitting: boolean;
  /** Changes text: false→"Saving…" true→"Updating…" */
  isEdit?: boolean;
  /** Custom label */
  label?: string;
}

/**
 * Absolute overlay that blocks interaction during form submission.
 * Parent must have `position: relative`.
 *
 * @example
 * <div style={{ position: 'relative' }}>
 *   <FormSubmitOverlay isSubmitting={isSubmitting} isEdit={!!editId} />
 *   <form>...</form>
 * </div>
 */
export function FormSubmitOverlay({ isSubmitting, isEdit, label }: FormSubmitOverlayProps) {
  if (!isSubmitting) return null;

  const text = label ?? (isEdit ? 'Updating…' : 'Saving…');

  return (
    <div className="tos-submit-overlay" aria-hidden>
      <div className="tos-submit-overlay__inner">
        <Spinner size="md" />
        <span className="tos-submit-overlay__label">{text}</span>
        <div className="tos-submit-overlay__lines" aria-hidden>
          {[0, 1, 2].map((i) => (
            <div key={i} className="tos-submit-overlay__line" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
