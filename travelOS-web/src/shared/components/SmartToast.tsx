'use client';
import React from 'react';
import { create } from 'zustand';
import { Toast, ToastBody, ToastClose, Toaster } from './Toast';
import { Icon } from './Icon';
import type { IconName } from './Icon';

/* ── Types ─────────────────────────────────────────────────────────────────── */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

interface ToastStoreState {
  toasts: ToastItem[];
  show: (type: ToastType, message: string, options?: { title?: string; duration?: number }) => void;
  success: (message: string, options?: { title?: string; duration?: number }) => void;
  error: (message: string, options?: { title?: string; duration?: number }) => void;
  warning: (message: string, options?: { title?: string; duration?: number }) => void;
  info: (message: string, options?: { title?: string; duration?: number }) => void;
  dismiss: (id: string) => void;
  clear: () => void;
}

let counter = 0;

export const useToastStore = create<ToastStoreState>((set) => {
  const addToast = (type: ToastType, message: string, options?: { title?: string; duration?: number }) => {
    const id = `toast-${++counter}`;
    const item: ToastItem = { id, type, message, ...options };
    set((s) => ({ toasts: [...s.toasts, item] }));
    // Auto-dismiss
    const ms = options?.duration ?? 4000;
    if (ms > 0) {
      setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), ms);
    }
  };

  return {
    toasts: [],
    show: addToast,
    success: (msg, opts) => addToast('success', msg, opts),
    error: (msg, opts) => addToast('error', msg, opts),
    warning: (msg, opts) => addToast('warning', msg, opts),
    info: (msg, opts) => addToast('info', msg, opts),
    dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    clear: () => set({ toasts: [] }),
  };
});

/* ── Config ─────────────────────────────────────────────────────────────────── */
const TYPE_CONFIG: Record<ToastType, { icon: IconName; color: string; bg: string }> = {
  success: { icon: 'CircleCheck',    color: 'var(--tos-success, #16a34a)', bg: 'var(--tos-success-bg, #dcfce7)' },
  error:   { icon: 'CircleX',       color: 'var(--tos-danger, #dc2626)',  bg: 'var(--tos-danger-bg, #fee2e2)' },
  warning: { icon: 'TriangleAlert',  color: 'var(--tos-warning, #d97706)', bg: 'var(--tos-warning-bg, #fef9c3)' },
  info:    { icon: 'Info',          color: 'var(--tos-info, #0369a1)',    bg: 'var(--tos-info-bg, #e0f2fe)' },
};

/* ── Renderer (mount once in layout) ───────────────────────────────────────── */
export function SmartToastRenderer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <Toaster>
      {toasts.map((t) => {
        const cfg = TYPE_CONFIG[t.type];
        return (
          <Toast
            key={t.id}
            visible
            autohide
            delay={t.duration ?? 4000}
            onClose={() => dismiss(t.id)}
            style={{ borderLeft: `4px solid ${cfg.color}` }}
          >
            <ToastBody className="d-flex align-items-center gap-2">
              <Icon name={cfg.icon} size={18} style={{ color: cfg.color, flexShrink: 0 }} />
              <div className="flex-grow-1">
                {t.title && <strong className="d-block">{t.title}</strong>}
                <span>{t.message}</span>
              </div>
              <ToastClose onClick={() => dismiss(t.id)} />
            </ToastBody>
          </Toast>
        );
      })}
    </Toaster>
  );
}
