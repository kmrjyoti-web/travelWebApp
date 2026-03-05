import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';
import { AppError, ErrorCode } from '@/lib/errors/AppError';

// Suppress React's error boundary console.error during tests
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

function Bomb({ shouldThrow = false }: { shouldThrow?: boolean }) {
  if (shouldThrow) throw new Error('Explosion!');
  return <div>Safe content</div>;
}

function AppErrorBomb({ shouldThrow = false }: { shouldThrow?: boolean }) {
  if (shouldThrow) throw new AppError('Typed error', { code: ErrorCode.SERVER_ERROR });
  return <div>Safe content</div>;
}

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Safe content')).toBeDefined();
  });

  it('renders default fallback UI on error', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByRole('alert')).toBeDefined();
    expect(screen.getByText('Something went wrong')).toBeDefined();
    expect(screen.getByText('Explosion!')).toBeDefined();
  });

  it('renders static fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<p>Custom fallback</p>}>
        <Bomb shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByText('Custom fallback')).toBeDefined();
  });

  it('renders render-prop fallback with error and reset', () => {
    render(
      <ErrorBoundary fallback={(err, reset) => (
        <div>
          <p>Error: {err.message}</p>
          <button onClick={reset}>Reset</button>
        </div>
      )}>
        <Bomb shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByText('Error: Explosion!')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeDefined();
  });

  it('resets to children after "Try again" click', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <Bomb shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeDefined();

    // Update children to non-throwing version first (boundary still shows error)
    rerender(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>
    );

    // Reset clears hasError — triggers re-render of the updated (safe) children
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(screen.getByText('Safe content')).toBeDefined();
  });

  it('calls onError callback with typed AppError', () => {
    const onError = vi.fn();
    render(
      <ErrorBoundary onError={onError}>
        <Bomb shouldThrow />
      </ErrorBoundary>
    );
    expect(onError).toHaveBeenCalledOnce();
    const [appError] = onError.mock.calls[0];
    expect(appError).toBeInstanceOf(AppError);
    expect(appError.message).toBe('Explosion!');
  });

  it('preserves AppError code when thrown directly', () => {
    const onError = vi.fn();
    render(
      <ErrorBoundary onError={onError}>
        <AppErrorBomb shouldThrow />
      </ErrorBoundary>
    );
    const [appError] = onError.mock.calls[0];
    expect(appError.code).toBe(ErrorCode.SERVER_ERROR);
  });
});
