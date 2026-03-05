'use client';

/**
 * Next.js App Router error boundary — rendered when a route segment throws.
 * Styled with tos-* BEM classes (no inline style sheets, no Tailwind).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="tos-error-page" role="alert" aria-live="assertive">
      <div className="tos-error-page__content">
        <span className="tos-error-page__icon" aria-hidden="true">⚠</span>
        <h1 className="tos-error-page__title">Something went wrong</h1>
        <p className="tos-error-page__message">
          {error?.message ?? 'An unexpected error occurred. Please try again.'}
        </p>
        {error?.digest && (
          <p className="tos-error-page__digest" aria-label={`Error ID: ${error.digest}`}>
            Error ID: {error.digest}
          </p>
        )}
        <button
          className="tos-btn tos-btn--primary"
          type="button"
          onClick={reset}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
