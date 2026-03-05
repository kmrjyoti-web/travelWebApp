'use client';

/**
 * @file src/components/common/ErrorBoundary/ErrorBoundary.tsx
 *
 * React class-based error boundary wrapping AppError for typed error handling.
 * Supports custom fallback via render-prop, static element, or built-in UI.
 *
 * Usage:
 *   <ErrorBoundary fallback={<p>Oops</p>}>
 *     <MyComponent />
 *   </ErrorBoundary>
 *
 *   <ErrorBoundary fallback={(error, reset) => <MyFallback error={error} onReset={reset} />}>
 *     <MyComponent />
 *   </ErrorBoundary>
 */

import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AppError, ErrorCode } from '@/lib/errors/AppError';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: AppError, reset: () => void) => ReactNode);
  onError?: (error: AppError, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: AppError | null;
}

function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof Error) {
    return new AppError(error.message, { code: ErrorCode.UNKNOWN, isOperational: false });
  }
  return new AppError('An unexpected error occurred', { code: ErrorCode.UNKNOWN, isOperational: false });
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { hasError: true, error: toAppError(error) };
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo): void {
    this.props.onError?.(toAppError(error), errorInfo);
  }

  reset(): void {
    this.setState({ hasError: false, error: null });
  }

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (!hasError || !error) return children;

    if (typeof fallback === 'function') return fallback(error, this.reset);
    if (fallback !== undefined) return fallback;

    return (
      <div className="tos-error-boundary" role="alert" aria-live="assertive">
        <div className="tos-error-boundary__content">
          <span className="tos-error-boundary__icon" aria-hidden="true">⚠</span>
          <h2 className="tos-error-boundary__title">Something went wrong</h2>
          <p className="tos-error-boundary__message">{error.message}</p>
          <button className="tos-btn tos-btn--primary" type="button" onClick={this.reset}>
            Try again
          </button>
        </div>
      </div>
    );
  }
}
