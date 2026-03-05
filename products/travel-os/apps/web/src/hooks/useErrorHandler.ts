import { useState, useCallback } from 'react';
import { AppError } from '@/lib/errors/AppError';
import { normalizeError } from '@/utils/error-handler';

export interface UseErrorHandlerReturn {
  error: AppError | null;
  hasError: boolean;
  captureError: (error: unknown) => void;
  clearError: () => void;
}

/**
 * Captures any thrown value as a typed AppError and exposes it to the component.
 *
 * @param onError  Optional side-effect callback (e.g. analytics/logging)
 *
 * Usage:
 *   const { error, captureError, clearError } = useErrorHandler();
 *   try { await apiCall(); } catch (err) { captureError(err); }
 */
export function useErrorHandler(onError?: (error: AppError) => void): UseErrorHandlerReturn {
  const [error, setError] = useState<AppError | null>(null);

  const captureError = useCallback((err: unknown): void => {
    const appError = normalizeError(err);
    setError(appError);
    onError?.(appError);
  }, [onError]);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  return { error, hasError: error !== null, captureError, clearError };
}
