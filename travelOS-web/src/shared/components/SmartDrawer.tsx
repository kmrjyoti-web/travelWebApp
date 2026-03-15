'use client';
import React, { useState, useCallback } from 'react';
import { Offcanvas, OffcanvasHeader, OffcanvasTitle, OffcanvasBody } from './Offcanvas';
import { Button } from './Button';

export interface SmartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Async-safe save handler */
  onSave?: () => void | Promise<void>;
  /** Return true if form has unsaved changes — will prompt before closing */
  isDirty?: boolean;
  dirtyMessage?: string;
  saveText?: string;
  cancelText?: string;
  /** Hide footer buttons */
  hideFooter?: boolean;
  saveDisabled?: boolean;
  placement?: 'start' | 'end' | 'top' | 'bottom';
  size?: string;
  className?: string;
}

/**
 * Smart drawer with form integration and dirty-check close guard.
 *
 * Wraps the shared Offcanvas with an async-safe save handler that shows
 * a loading spinner, and a dirty-check guard that prompts the user before
 * closing when there are unsaved changes.
 *
 * @example
 * <SmartDrawer
 *   isOpen={drawerOpen}
 *   onClose={() => setDrawerOpen(false)}
 *   title="Edit Booking"
 *   onSave={async () => { await updateBooking(formData); }}
 *   isDirty={formDirty}
 *   size="480px"
 * >
 *   <BookingForm />
 * </SmartDrawer>
 */
export function SmartDrawer({
  isOpen,
  onClose,
  title,
  children,
  onSave,
  isDirty = false,
  dirtyMessage = 'You have unsaved changes. Are you sure you want to close?',
  saveText = 'Save',
  cancelText = 'Cancel',
  hideFooter = false,
  saveDisabled = false,
  placement = 'end',
  size,
  className = '',
}: SmartDrawerProps): React.ReactElement {
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    if (saving) return;
    if (isDirty) {
      // eslint-disable-next-line no-restricted-globals
      const confirmed = confirm(dirtyMessage);
      if (!confirmed) return;
    }
    onClose();
  };

  const handleSave = useCallback(async () => {
    if (!onSave) return;
    const result = onSave();
    if (result instanceof Promise) {
      setSaving(true);
      try {
        await result;
      } finally {
        setSaving(false);
      }
    }
  }, [onSave]);

  return (
    <Offcanvas
      visible={isOpen}
      onHide={handleClose}
      placement={placement}
      backdrop={saving ? 'static' : true}
      className={`tos-smart-drawer ${className}`.trim()}
      style={size ? { width: size } : undefined}
    >
      <OffcanvasHeader>
        <OffcanvasTitle>{title}</OffcanvasTitle>
      </OffcanvasHeader>
      <OffcanvasBody>
        <div className="tos-smart-drawer__content">{children}</div>
        {!hideFooter && (
          <div className="tos-smart-drawer__footer">
            <Button color="secondary" variant="outline" onClick={handleClose} disabled={saving}>
              {cancelText}
            </Button>
            {onSave && (
              <Button color="primary" onClick={handleSave} loading={saving} disabled={saveDisabled}>
                {saveText}
              </Button>
            )}
          </div>
        )}
      </OffcanvasBody>
    </Offcanvas>
  );
}
