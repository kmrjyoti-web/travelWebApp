'use client';
import React, { useState, useCallback } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from './Modal';
import { Button } from './Button';
import type { IconName } from './Icon';

export interface SmartDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  /** Body content */
  children: React.ReactNode;
  /** Async-safe confirm handler — dialog shows loading until promise resolves */
  onConfirm?: () => void | Promise<void>;
  /** Called on cancel (defaults to onClose) */
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'danger' | 'warning' | 'success';
  confirmIcon?: IconName;
  /** Hide cancel button (e.g. for info-only dialogs) */
  hideCancel?: boolean;
  /** Hide entire footer */
  hideFooter?: boolean;
  /** Disable confirm button */
  confirmDisabled?: boolean;
  size?: 'sm' | 'lg' | 'xl';
  className?: string;
}

/**
 * Smart dialog with async-safe confirm handler and auto-loading state.
 *
 * Unlike ConfirmDialog (which accepts a message string), SmartDialog accepts
 * children for custom body content and supports async confirm handlers that
 * automatically show a loading spinner until the promise resolves.
 *
 * @example
 * <SmartDialog
 *   isOpen={open}
 *   onClose={() => setOpen(false)}
 *   title="Publish Itinerary"
 *   onConfirm={async () => { await publishItinerary(id); }}
 *   confirmText="Publish"
 *   confirmColor="success"
 *   confirmIcon="Send"
 * >
 *   <p>This will make the itinerary visible to all agents.</p>
 * </SmartDialog>
 */
export function SmartDialog({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'primary',
  confirmIcon,
  hideCancel = false,
  hideFooter = false,
  confirmDisabled = false,
  size,
  className = '',
}: SmartDialogProps): React.ReactElement {
  const [loading, setLoading] = useState(false);

  const handleConfirm = useCallback(async () => {
    if (!onConfirm) return;
    const result = onConfirm();
    if (result instanceof Promise) {
      setLoading(true);
      try {
        await result;
      } finally {
        setLoading(false);
      }
    }
  }, [onConfirm]);

  const handleCancel = () => {
    if (loading) return;
    (onCancel ?? onClose)();
  };

  return (
    <Modal
      visible={isOpen}
      onClose={loading ? undefined : onClose}
      alignment="center"
      size={size}
      className={`tos-smart-dialog ${className}`.trim()}
      backdrop={loading ? 'static' : true}
    >
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
      </ModalHeader>
      <ModalBody>{children}</ModalBody>
      {!hideFooter && (
        <ModalFooter>
          {!hideCancel && (
            <Button color="secondary" variant="outline" onClick={handleCancel} disabled={loading}>
              {cancelText}
            </Button>
          )}
          {onConfirm && (
            <Button
              color={confirmColor}
              onClick={handleConfirm}
              loading={loading}
              disabled={confirmDisabled}
              leftIcon={confirmIcon}
            >
              {confirmText}
            </Button>
          )}
        </ModalFooter>
      )}
    </Modal>
  );
}
