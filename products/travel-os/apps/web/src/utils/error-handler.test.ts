import { describe, it, expect } from 'vitest';
import { AppError, ErrorCode } from '@/lib/errors/AppError';
import { normalizeError, isOperationalError, handleApiError } from './error-handler';

describe('normalizeError', () => {
  it('passes AppError through unchanged', () => {
    const original = new AppError('already typed', { code: ErrorCode.NOT_FOUND });
    expect(normalizeError(original)).toBe(original);
  });

  it('wraps plain Error', () => {
    const result = normalizeError(new Error('plain error'));
    expect(result).toBeInstanceOf(AppError);
    expect(result.message).toBe('plain error');
    expect(result.code).toBe(ErrorCode.UNKNOWN);
    expect(result.isOperational).toBe(false);
  });

  it('wraps string error', () => {
    const result = normalizeError('something went wrong');
    expect(result.message).toBe('something went wrong');
    expect(result).toBeInstanceOf(AppError);
  });

  it('handles null/undefined with generic message', () => {
    const result = normalizeError(null);
    expect(result.message).toBe('An unexpected error occurred');
  });

  it('handles unknown object type', () => {
    const result = normalizeError({ msg: 'weird' });
    expect(result).toBeInstanceOf(AppError);
    expect(result.message).toBe('An unexpected error occurred');
  });
});

describe('isOperationalError', () => {
  it('returns true for operational AppError', () => {
    expect(isOperationalError(new AppError('op', { isOperational: true }))).toBe(true);
  });

  it('returns false for non-operational AppError', () => {
    expect(isOperationalError(new AppError('bug', { isOperational: false }))).toBe(false);
  });

  it('returns false for plain Error', () => {
    expect(isOperationalError(new Error('plain'))).toBe(false);
  });
});

describe('handleApiError', () => {
  it('maps 401 response to UNAUTHORIZED', () => {
    const axiosErr = { response: { status: 401, data: { message: 'Token expired' } } };
    const result = handleApiError(axiosErr);
    expect(result.code).toBe(ErrorCode.UNAUTHORIZED);
    expect(result.message).toBe('Token expired');
  });

  it('maps 404 response with default message', () => {
    const axiosErr = { response: { status: 404, data: {} } };
    const result = handleApiError(axiosErr);
    expect(result.code).toBe(ErrorCode.NOT_FOUND);
  });

  it('maps network error (no response, has request)', () => {
    const axiosErr = { request: {}, message: 'Network Error' };
    const result = handleApiError(axiosErr);
    expect(result.code).toBe(ErrorCode.NETWORK_ERROR);
    expect(result.status).toBe(0);
  });

  it('maps ECONNABORTED to TIMEOUT', () => {
    const axiosErr = { code: 'ECONNABORTED', message: 'timeout' };
    const result = handleApiError(axiosErr);
    expect(result.code).toBe(ErrorCode.TIMEOUT);
    expect(result.status).toBe(408);
  });

  it('falls through to normalizeError for unknown types', () => {
    const result = handleApiError(new Error('generic'));
    expect(result).toBeInstanceOf(AppError);
    expect(result.code).toBe(ErrorCode.UNKNOWN);
  });
});
