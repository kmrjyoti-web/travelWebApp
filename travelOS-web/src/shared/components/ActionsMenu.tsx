'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { Button } from './Button';

export interface ActionMenuItem {
  label: string;
  icon?: IconName;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

export interface ActionsMenuProps {
  items: ActionMenuItem[];
  /** Tooltip / aria-label for the trigger button */
  label?: string;
  className?: string;
}

/**
 * More-horizontal (⋯) trigger that opens a dropdown action list.
 *
 * @example
 * <ActionsMenu items={[
 *   { label: 'Edit',   icon: 'Pencil', onClick: openEdit },
 *   { label: 'Delete', icon: 'Trash2', onClick: confirmDelete, variant: 'danger' },
 * ]} />
 */
export function ActionsMenu({ items, label = 'More actions', className = '' }: ActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [open]);

  return (
    <div ref={wrapRef} className={`tos-actions-menu${className ? ` ${className}` : ''}`}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="tos-actions-menu__trigger"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="Ellipsis" size={16} aria-hidden />
      </Button>

      {open && (
        <div
          className="tos-actions-menu__dropdown"
          role="menu"
          aria-label={label}
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              className={[
                'tos-actions-menu__item',
                item.variant === 'danger' ? 'tos-actions-menu__item--danger' : '',
                item.disabled             ? 'tos-actions-menu__item--disabled' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => { setOpen(false); item.onClick(); }}
            >
              {item.icon && <Icon name={item.icon} size={14} aria-hidden />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
