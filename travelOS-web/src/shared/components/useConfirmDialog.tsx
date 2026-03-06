'use client';
import React, { useState, useRef, useCallback } from 'react';
import { ConfirmDialog } from './ConfirmDialog';
import type { ConfirmDialogProps } from './ConfirmDialog';

type ConfirmOptions = Omit<ConfirmDialogProps, 'isOpen' | 'onConfirm' | 'onCancel' | 'loading'>;

/**
 * Promise-based confirm dialog hook.
 * Render <ConfirmDialogPortal /> once in your component tree,
 * then call confirm({...}) anywhere to await a boolean result.
 *
 * @example
 * const { confirm, ConfirmDialogPortal } = useConfirmDialog();
 *
 * const handleDelete = async () => {
 *   const ok = await confirm({ type: 'danger', title: 'Delete?', message: 'Are you sure?' });
 *   if (ok) await deleteItem();
 * };
 *
 * return (
 *   <>
 *     <Button onClick={handleDelete}>Delete</Button>
 *     <ConfirmDialogPortal />
 *   </>
 * );
 */
export function useConfirmDialog() {
  const [open, setOpen]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [opts, setOpts]         = useState<ConfirmOptions>({ title: '', message: '' });
  const resolverRef = useRef<(value: boolean) => void>();

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> =>
    new Promise((resolve) => {
      resolverRef.current = resolve;
      setOpts(options);
      setLoading(false);
      setOpen(true);
    }),
  []);

  const handleConfirm = useCallback(() => {
    setOpen(false);
    resolverRef.current?.(true);
  }, []);

  const handleCancel = useCallback(() => {
    setOpen(false);
    resolverRef.current?.(false);
  }, []);

  function ConfirmDialogPortal() {
    return (
      <ConfirmDialog
        isOpen={open}
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        {...opts}
      />
    );
  }

  return { confirm, ConfirmDialogPortal, setLoading };
}
