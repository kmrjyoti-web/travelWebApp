import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useErrorHandler } from './useErrorHandler';
import { AppError, ErrorCode } from '@/lib/errors/AppError';

describe('useErrorHandler', () => {
  it('starts with no error', () => {
    const { result } = renderHook(() => useErrorHandler());
    expect(result.current.error).toBeNull();
    expect(result.current.hasError).toBe(false);
  });

  it('captures a plain Error', () => {
    const { result } = renderHook(() => useErrorHandler());
    act(() => {
      result.current.captureError(new Error('boom'));
    });
    expect(result.current.hasError).toBe(true);
    expect(result.current.error).toBeInstanceOf(AppError);
    expect(result.current.error?.message).toBe('boom');
  });

  it('captures an AppError preserving its code', () => {
    const { result } = renderHook(() => useErrorHandler());
    act(() => {
      result.current.captureError(new AppError('not found', { code: ErrorCode.NOT_FOUND }));
    });
    expect(result.current.error?.code).toBe(ErrorCode.NOT_FOUND);
  });

  it('captures a string error', () => {
    const { result } = renderHook(() => useErrorHandler());
    act(() => {
      result.current.captureError('string error');
    });
    expect(result.current.error?.message).toBe('string error');
  });

  it('clears error after clearError()', () => {
    const { result } = renderHook(() => useErrorHandler());
    act(() => {
      result.current.captureError(new Error('boom'));
    });
    expect(result.current.hasError).toBe(true);

    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
    expect(result.current.hasError).toBe(false);
  });

  it('calls onError callback when error is captured', () => {
    const onError = vi.fn();
    const { result } = renderHook(() => useErrorHandler(onError));
    act(() => {
      result.current.captureError(new Error('side-effect'));
    });
    expect(onError).toHaveBeenCalledOnce();
    expect(onError.mock.calls[0][0]).toBeInstanceOf(AppError);
  });
});
