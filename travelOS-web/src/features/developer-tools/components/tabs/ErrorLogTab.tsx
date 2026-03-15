'use client';
import React, { useEffect } from 'react';
import { useDevToolsStore } from '../../stores/devtools.store';

export function ErrorLogTab() {
  const errors = useDevToolsStore((s) => s.errors);
  const addError = useDevToolsStore((s) => s.addError);
  const clearErrors = useDevToolsStore((s) => s.clearErrors);

  // Subscribe to global errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      addError({
        message: event.message,
        source: `${event.filename}:${event.lineno}:${event.colno}`,
        stack: event.error?.stack,
        type: 'error',
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      addError({
        message: reason instanceof Error ? reason.message : String(reason),
        stack: reason instanceof Error ? reason.stack : undefined,
        type: 'unhandledrejection',
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [addError]);

  return (
    <div className="tos-devtools-tab tos-devtools-tab--error-log">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontWeight: 600 }}>
          {errors.length} error{errors.length !== 1 ? 's' : ''} captured
        </span>
        {errors.length > 0 && (
          <button
            onClick={clearErrors}
            style={{
              padding: '2px 8px',
              borderRadius: 4,
              border: '1px solid var(--tos-border, #dee2e6)',
              background: 'var(--tos-bg, #fff)',
              color: '#dc2626',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {errors.length === 0 && (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--tos-text-muted, #888)' }}>
          No errors captured. Errors from <code>window.onerror</code> and{' '}
          <code>unhandledrejection</code> will appear here.
        </div>
      )}

      {errors.map((err) => (
        <div
          key={err.id}
          style={{
            marginBottom: 8,
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid #fecaca',
            background: '#fef2f2',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{
              fontSize: 10,
              textTransform: 'uppercase',
              fontWeight: 600,
              color: err.type === 'error' ? '#dc2626' : '#d97706',
              background: err.type === 'error' ? '#fee2e2' : '#fef9c3',
              padding: '1px 6px',
              borderRadius: 4,
            }}>
              {err.type}
            </span>
            <span style={{ fontSize: 11, color: 'var(--tos-text-muted, #888)' }}>
              {new Date(err.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#991b1b', marginBottom: 4 }}>
            {err.message}
          </div>
          {err.source && (
            <div style={{ fontSize: 11, color: 'var(--tos-text-muted, #888)' }}>
              Source: {err.source}
            </div>
          )}
          {err.stack && (
            <details style={{ marginTop: 4 }}>
              <summary style={{ fontSize: 11, cursor: 'pointer', color: 'var(--tos-text-muted, #888)' }}>
                Stack trace
              </summary>
              <pre style={{
                fontSize: 10,
                padding: 8,
                background: '#fef2f2',
                borderRadius: 4,
                overflow: 'auto',
                maxHeight: 120,
                margin: '4px 0 0',
              }}>
                {err.stack}
              </pre>
            </details>
          )}
        </div>
      ))}
    </div>
  );
}
