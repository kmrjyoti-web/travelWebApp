import { describe, it, expect } from 'vitest';
import { AppError, ErrorCode } from './AppError';

describe('AppError', () => {
  it('creates with default values', () => {
    const err = new AppError('Something failed');
    expect(err.message).toBe('Something failed');
    expect(err.code).toBe(ErrorCode.UNKNOWN);
    expect(err.status).toBe(500);
    expect(err.isOperational).toBe(true);
    expect(err.name).toBe('AppError');
  });

  it('creates with explicit options', () => {
    const err = new AppError('Not found', {
      code: ErrorCode.NOT_FOUND,
      status: 404,
      context: { id: '42' },
      isOperational: false,
    });
    expect(err.code).toBe(ErrorCode.NOT_FOUND);
    expect(err.status).toBe(404);
    expect(err.context).toEqual({ id: '42' });
    expect(err.isOperational).toBe(false);
  });

  it('is instanceof AppError and Error', () => {
    const err = new AppError('test');
    expect(err instanceof AppError).toBe(true);
    expect(err instanceof Error).toBe(true);
  });

  describe('fromHttpStatus', () => {
    it.each([
      [400, ErrorCode.VALIDATION_ERROR],
      [401, ErrorCode.UNAUTHORIZED],
      [403, ErrorCode.FORBIDDEN],
      [404, ErrorCode.NOT_FOUND],
      [408, ErrorCode.TIMEOUT],
      [409, ErrorCode.CONFLICT],
      [429, ErrorCode.RATE_LIMIT],
      [500, ErrorCode.SERVER_ERROR],
      [503, ErrorCode.SERVICE_UNAVAILABLE],
    ])('maps HTTP %i → %s', (status, expectedCode) => {
      const err = AppError.fromHttpStatus(status);
      expect(err.code).toBe(expectedCode);
      expect(err.status).toBe(status);
    });

    it('uses custom message when provided', () => {
      const err = AppError.fromHttpStatus(404, 'Trip not found');
      expect(err.message).toBe('Trip not found');
    });

    it('uses default message when no custom provided', () => {
      const err = AppError.fromHttpStatus(401);
      expect(err.message).toBe('Unauthorized');
    });

    it('handles unknown status codes', () => {
      const err = AppError.fromHttpStatus(418);
      expect(err.code).toBe(ErrorCode.SERVER_ERROR);
    });
  });

  describe('toJSON', () => {
    it('serialises to plain object', () => {
      const err = new AppError('Bad gateway', { code: ErrorCode.SERVER_ERROR, status: 502 });
      const json = err.toJSON();
      expect(json.name).toBe('AppError');
      expect(json.message).toBe('Bad gateway');
      expect(json.code).toBe(ErrorCode.SERVER_ERROR);
      expect(json.status).toBe(502);
    });

    it('omits context when undefined', () => {
      const err = new AppError('test');
      expect(err.toJSON()).not.toHaveProperty('context');
    });

    it('includes context when provided', () => {
      const err = new AppError('test', { context: { field: 'email' } });
      expect(err.toJSON().context).toEqual({ field: 'email' });
    });
  });
});
