/**
 * @file src/utils/error-handler.ts
 *
 * Utility functions for normalising unknown thrown values into AppError.
 * Used by useErrorHandler, ErrorBoundary, and API service layer.
 */

import { AppError, ErrorCode } from '@/lib/errors/AppError';

/** Coerce any thrown value into a typed AppError. */
export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof Error) {
    return new AppError(error.message, {
      code: ErrorCode.UNKNOWN,
      isOperational: false,
      cause: error,
    });
  }
  if (typeof error === 'string' && error.length > 0) {
    return new AppError(error, { code: ErrorCode.UNKNOWN });
  }
  return new AppError('An unexpected error occurred', { code: ErrorCode.UNKNOWN });
}

/** Returns true when an error is expected/handled (not a programming bug). */
export function isOperationalError(error: unknown): boolean {
  return error instanceof AppError ? error.isOperational : false;
}

type AxiosLikeError = {
  response?: { status: number; data?: { message?: string; error?: string } };
  request?: unknown;
  message?: string;
  code?: string;
};

function isAxiosLikeError(err: unknown): err is AxiosLikeError {
  return (
    typeof err === 'object' &&
    err !== null &&
    ('response' in err || 'request' in err || 'code' in err)
  );
}

/**
 * Maps an Axios (or Axios-like) error to a typed AppError.
 * Handles response errors, request errors (no response), and config errors.
 */
export function handleApiError(error: unknown): AppError {
  if (isAxiosLikeError(error)) {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message ?? data?.error;
      return AppError.fromHttpStatus(status, message);
    }
    if (error.request) {
      return new AppError('Network error — no response received', {
        code: ErrorCode.NETWORK_ERROR,
        status: 0,
        isOperational: true,
      });
    }
    if (error.code === 'ECONNABORTED') {
      return new AppError('Request timed out', { code: ErrorCode.TIMEOUT, status: 408 });
    }
  }
  return normalizeError(error);
}
