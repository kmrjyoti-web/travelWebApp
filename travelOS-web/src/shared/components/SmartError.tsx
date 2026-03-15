'use client';
import React from 'react';
import { Alert } from './Alert';
import { Button } from './Button';
import { Icon } from './Icon';

export interface SmartErrorProps {
  /** Error object, string, or error code */
  error: Error | string | { code?: string; message?: string } | null | undefined;
  /** Retry handler -- shows retry button when provided */
  onRetry?: () => void;
  /** Custom title (defaults to "Something went wrong") */
  title?: string;
  /** Show full error details in dev mode */
  showDetails?: boolean;
  /** Compact inline mode vs full block mode */
  inline?: boolean;
  className?: string;
}

const ERROR_CODE_MAP: Record<string, string> = {
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  ACCOUNT_UNDER_REVIEW: 'Your account is under review. Please wait for verification.',
  ACCOUNT_SUSPENDED: 'Your account has been suspended. Contact support for help.',
  ACCOUNT_BANNED: 'Your account has been banned.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'An internal server error occurred. Please try again later.',
};

function resolveMessage(error: SmartErrorProps['error']): string {
  if (!error) return 'An unknown error occurred.';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (error.code && ERROR_CODE_MAP[error.code]) return ERROR_CODE_MAP[error.code];
  return error.message ?? 'An unknown error occurred.';
}

export function SmartError({
  error,
  onRetry,
  title = 'Something went wrong',
  showDetails = process.env.NODE_ENV === 'development',
  inline = false,
  className = '',
}: SmartErrorProps) {
  if (!error) return null;

  const message = resolveMessage(error);

  if (inline) {
    return (
      <div className={`tos-smart-error tos-smart-error--inline ${className}`.trim()}>
        <Icon name="CircleX" size={16} style={{ color: 'var(--tos-danger, #dc2626)' }} />
        <span className="tos-smart-error__msg">{message}</span>
        {onRetry && (
          <Button color="primary" variant="ghost" size="sm" leftIcon="RefreshCw" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <Alert color="danger" className={`tos-smart-error ${className}`.trim()}>
      <div className="tos-smart-error__header">
        <Icon name="TriangleAlert" size={20} style={{ color: 'var(--tos-danger, #dc2626)' }} />
        <strong>{title}</strong>
      </div>
      <p className="tos-smart-error__message">{message}</p>
      {showDetails && error instanceof Error && error.stack && (
        <pre className="tos-smart-error__stack">{error.stack}</pre>
      )}
      {onRetry && (
        <Button color="danger" variant="outline" size="sm" leftIcon="RefreshCw" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Alert>
  );
}
