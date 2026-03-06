'use client';
import React from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from './Modal';
import { Button } from './Button';
import { Icon } from './Icon';
import type { IconName } from './Icon';

const TYPE_CONFIG: Record<string, { icon: IconName; iconColor: string; iconBg: string; btnColor: string }> = {
  danger:  { icon: 'TriangleAlert', iconColor: '#dc2626', iconBg: '#fee2e2', btnColor: 'danger' },
  warning: { icon: 'TriangleAlert', iconColor: '#d97706', iconBg: '#fef9c3', btnColor: 'warning' },
  success: { icon: 'CircleCheck',   iconColor: '#16a34a', iconBg: '#dcfce7', btnColor: 'success' },
  info:    { icon: 'Info',          iconColor: '#0369a1', iconBg: '#e0f2fe', btnColor: 'primary' },
};

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  type?: 'danger' | 'warning' | 'success' | 'info';
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Accessible confirmation modal with 4 types: danger / warning / success / info.
 *
 * @example
 * <ConfirmDialog
 *   isOpen={open}
 *   type="danger"
 *   title="Delete record"
 *   message="This action cannot be undone."
 *   onConfirm={handleDelete}
 *   onCancel={() => setOpen(false)}
 * />
 */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  type = 'info',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cfg = TYPE_CONFIG[type];

  return (
    <Modal visible={isOpen} onClose={onCancel} alignment="center" size="sm">
      <ModalHeader>
        <div className="tos-confirm__header">
          <span
            className="tos-confirm__icon"
            style={{ background: cfg.iconBg }}
            aria-hidden
          >
            <Icon name={cfg.icon} size={20} style={{ color: cfg.iconColor }} aria-hidden />
          </span>
          <ModalTitle>{title}</ModalTitle>
        </div>
      </ModalHeader>

      <ModalBody>
        <p className="tos-confirm__message">{message}</p>
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" variant="outline" onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          color={cfg.btnColor as React.ComponentProps<typeof Button>['color']}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
