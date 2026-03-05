/**
 * @file src/lib/errors/AppError.ts
 *
 * Typed application error class with error codes, HTTP status mapping, and
 * isOperational flag to distinguish expected errors from programming bugs.
 */

export enum ErrorCode {
  // Network
  NETWORK_ERROR  = 'NETWORK_ERROR',
  TIMEOUT        = 'TIMEOUT',
  RATE_LIMIT     = 'RATE_LIMIT',
  // Auth
  UNAUTHORIZED   = 'UNAUTHORIZED',
  FORBIDDEN      = 'FORBIDDEN',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  // Data
  NOT_FOUND      = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONFLICT       = 'CONFLICT',
  // Server
  SERVER_ERROR   = 'SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  // Client
  UNKNOWN        = 'UNKNOWN',
}

export interface AppErrorOptions {
  code?: ErrorCode;
  status?: number;
  context?: Record<string, unknown>;
  isOperational?: boolean;
  cause?: unknown;
}

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly context?: Record<string, unknown>;
  readonly isOperational: boolean;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message);
    this.name = 'AppError';
    this.code = options.code ?? ErrorCode.UNKNOWN;
    this.status = options.status ?? 500;
    this.context = options.context;
    this.isOperational = options.isOperational ?? true;
    if (options.cause !== undefined) this.cause = options.cause;
    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static fromHttpStatus(status: number, message?: string): AppError {
    const defaults: Record<number, { code: ErrorCode; msg: string }> = {
      400: { code: ErrorCode.VALIDATION_ERROR,    msg: 'Bad request'          },
      401: { code: ErrorCode.UNAUTHORIZED,        msg: 'Unauthorized'         },
      403: { code: ErrorCode.FORBIDDEN,           msg: 'Forbidden'            },
      404: { code: ErrorCode.NOT_FOUND,           msg: 'Not found'            },
      408: { code: ErrorCode.TIMEOUT,             msg: 'Request timed out'    },
      409: { code: ErrorCode.CONFLICT,            msg: 'Conflict'             },
      429: { code: ErrorCode.RATE_LIMIT,          msg: 'Too many requests'    },
      500: { code: ErrorCode.SERVER_ERROR,        msg: 'Internal server error'},
      503: { code: ErrorCode.SERVICE_UNAVAILABLE, msg: 'Service unavailable'  },
    };
    const found = defaults[status] ?? { code: ErrorCode.SERVER_ERROR, msg: 'Server error' };
    return new AppError(message ?? found.msg, { code: found.code, status });
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      ...(this.context ? { context: this.context } : {}),
    };
  }
}
