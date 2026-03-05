'use client';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface MinimalProgressProps {
  /** Current step — 1-based. */
  step: number;
  /** Total number of steps. Must be ≥ 2 to render. */
  totalSteps: number;
  /** Optional per-step labels rendered below the track. */
  labels?: string[];
  className?: string;
  'data-testid'?: string;
}

// ─── MinimalProgress ──────────────────────────────────────────────────────────

/**
 * Segmented pill progress bar for multi-step flows.
 *
 * Visual:  ●●●○○  (filled = done or current, empty = future)
 *
 * Accessibility:
 *   - role="progressbar" with aria-valuenow / aria-valuemin / aria-valuemax
 *   - aria-label "Step N of M[ : Label]"
 *   - Screen-reader-only text announcing current position
 *   - All visual segments are aria-hidden; SR reads only the summary text
 */
export function MinimalProgress({
  step,
  totalSteps,
  labels,
  className,
  'data-testid': testId = 'minimal-progress',
}: MinimalProgressProps) {
  if (totalSteps < 2) return null;

  const clamped     = Math.max(1, Math.min(step, totalSteps));
  const currentLabel = labels?.[clamped - 1];
  const srLabel     = currentLabel
    ? `Step ${clamped} of ${totalSteps}: ${currentLabel}`
    : `Step ${clamped} of ${totalSteps}`;

  return (
    <div
      className={['tos-min-progress', className].filter(Boolean).join(' ')}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={srLabel}
      data-testid={testId}
    >
      {/* Segmented track */}
      <div
        className="tos-min-progress__track"
        aria-hidden="true"
        data-testid="minimal-progress-track"
      >
        {Array.from({ length: totalSteps }, (_, i) => {
          const segStep = i + 1;
          const isDone    = segStep < clamped;
          const isCurrent = segStep === clamped;
          const cls = [
            'tos-min-progress__segment',
            isDone    ? 'tos-min-progress__segment--done'    : '',
            isCurrent ? 'tos-min-progress__segment--current' : '',
          ].filter(Boolean).join(' ');

          return (
            <div
              key={i}
              className={cls}
              data-testid={`progress-segment-${segStep}`}
            />
          );
        })}
      </div>

      {/* Optional step labels */}
      {labels && labels.length > 0 && (
        <div
          className="tos-min-progress__labels"
          aria-hidden="true"
          data-testid="minimal-progress-labels"
        >
          {labels.map((label, i) => {
            const isCurrent = i + 1 === clamped;
            return (
              <span
                key={i}
                className={[
                  'tos-min-progress__label',
                  isCurrent ? 'tos-min-progress__label--current' : '',
                ].filter(Boolean).join(' ')}
                data-testid={`progress-label-${i + 1}`}
              >
                {label}
              </span>
            );
          })}
        </div>
      )}

      {/* Screen-reader summary — not aria-hidden */}
      <span className="tos-sr-only">
        {srLabel}
      </span>
    </div>
  );
}
