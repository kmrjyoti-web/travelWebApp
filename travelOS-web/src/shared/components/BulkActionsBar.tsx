'use client';
import React from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';
import { Icon } from './Icon';
import type { IconName } from './Icon';

export interface BulkAction {
  id: string;
  label: string;
  icon?: IconName;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  onClick: () => void;
}

export interface BulkActionsBarProps {
  /** Number of selected rows; bar is hidden when 0 */
  count: number;
  /** Entity name for label, e.g. "booking" → "3 bookings selected" */
  entityName?: string;
  actions: BulkAction[];
  onClearSelection: () => void;
  /** Loading state — disables all action buttons */
  loading?: boolean;
}

/**
 * Fixed bottom bar that appears when rows are selected in a DataTable.
 * Rendered via portal so it overlays the page regardless of stacking context.
 *
 * @example
 * <BulkActionsBar
 *   count={selectedIds.length}
 *   entityName="booking"
 *   actions={[
 *     { id: 'delete', label: 'Delete', icon: 'Trash2', variant: 'danger', onClick: handleBulkDelete },
 *   ]}
 *   onClearSelection={() => setSelectedIds([])}
 * />
 */
export function BulkActionsBar({
  count,
  entityName = 'item',
  actions,
  onClearSelection,
  loading = false,
}: BulkActionsBarProps) {
  if (count === 0 || typeof window === 'undefined') return null;

  const label = `${count} ${entityName}${count !== 1 ? 's' : ''} selected`;

  return createPortal(
    <div className="tos-bulk-bar" role="toolbar" aria-label={`Bulk actions: ${label}`}>
      <div className="tos-bulk-bar__inner">
        {/* Selection count + clear */}
        <div className="tos-bulk-bar__info">
          <span className="tos-bulk-bar__count">
            <Icon name="SquareCheck" size={15} aria-hidden />
            {label}
          </span>
          <button
            type="button"
            className="tos-bulk-bar__clear"
            onClick={onClearSelection}
            disabled={loading}
            aria-label="Clear selection"
          >
            <Icon name="X" size={13} aria-hidden />
            Clear
          </button>
        </div>

        {/* Action buttons */}
        <div className="tos-bulk-bar__actions">
          {actions.map((action) => (
            <Button
              key={action.id}
              size="sm"
              color={action.variant === 'danger' ? 'danger' : 'light'}
              variant={action.variant === 'danger' ? undefined : 'outline'}
              leftIcon={action.icon}
              disabled={action.disabled || loading}
              loading={loading && action.id === 'delete'}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
