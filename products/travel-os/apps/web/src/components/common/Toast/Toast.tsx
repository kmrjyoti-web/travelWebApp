'use client';

/**
 * @file src/components/common/Toast/Toast.tsx
 *
 * TravelOS Toast notification system.
 *
 * Exports:
 *   Toast          — single notification item (can be used standalone)
 *   ToastProvider  — context provider; wraps the app and renders the container
 *   useToast       — hook that returns { show, dismiss, dismissAll, toasts, position }
 *
 * Usage:
 *   <ToastProvider position="top-right">
 *     <App />
 *   </ToastProvider>
 *
 *   const { show } = useToast();
 *   show({ title: 'Saved!', intent: 'success', duration: 3000 });
 *
 * Class anatomy:
 *   tos-toast  tos-toast--{intent}
 *   tos-toast__body  tos-toast__title  tos-toast__message
 *   tos-toast__action  tos-toast__dismiss
 *   tos-toast-container  tos-toast-container--{position}
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { cls, intentClass } from '../utils';
import type {
  ToastContextValue,
  ToastItemData,
  ToastProps,
  ToastProviderProps,
} from './types';

const BLOCK = 'tos-toast';
const CONTAINER_BLOCK = 'tos-toast-container';
const DEFAULT_DURATION = 4000;

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

// ─── Toast (single item) ──────────────────────────────────────────────────────

export function Toast({
  toast,
  onDismiss,
  className,
  'data-testid': testId,
}: ToastProps) {
  const { id, intent = 'default', title, message, action } = toast;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const duration = toast.duration !== undefined ? toast.duration : DEFAULT_DURATION;

  useEffect(() => {
    if (duration > 0) {
      timerRef.current = setTimeout(() => onDismiss(id), duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [id, duration, onDismiss]);

  const rootCls = cls(BLOCK, intentClass(BLOCK, intent), className);

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={rootCls}
      data-testid={testId ?? `toast-${id}`}
    >
      <div className={`${BLOCK}__body`}>
        <strong className={`${BLOCK}__title`}>{title}</strong>
        {message && <p className={`${BLOCK}__message`}>{message}</p>}
      </div>

      {action && (
        <button
          type="button"
          className={`${BLOCK}__action`}
          onClick={() => {
            action.onClick();
            onDismiss(id);
          }}
        >
          {action.label}
        </button>
      )}

      <button
        type="button"
        className={`${BLOCK}__dismiss`}
        aria-label="Dismiss notification"
        onClick={() => onDismiss(id)}
        data-testid={testId ? `${testId}-dismiss` : `toast-${id}-dismiss`}
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}

// ─── ToastContainer ───────────────────────────────────────────────────────────

function ToastContainer() {
  const { toasts, position, dismiss } = useToast();

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={cls(CONTAINER_BLOCK, `${CONTAINER_BLOCK}--${position}`)}
      aria-label="Notifications"
      data-testid="toast-container"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>,
    document.body,
  );
}

// ─── ToastProvider ────────────────────────────────────────────────────────────

export function ToastProvider({
  children,
  position = 'top-right',
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItemData[]>([]);
  const counterRef = useRef(0);

  const show = useCallback(
    (toast: Omit<ToastItemData, 'id'>): string => {
      const id = `toast-${++counterRef.current}`;
      setToasts((prev) => {
        const next = [...prev, { ...toast, id }];
        return maxToasts > 0 ? next.slice(-maxToasts) : next;
      });
      return id;
    },
    [maxToasts],
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => setToasts([]), []);

  return (
    <ToastContext.Provider value={{ show, dismiss, dismissAll, toasts, position }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}
