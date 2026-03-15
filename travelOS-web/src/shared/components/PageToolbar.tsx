'use client';
import React from 'react';
import { Icon } from './Icon';
import type { IconName } from './Icon';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToolbarButtonVariant =
  | 'primary'
  | 'success'
  | 'purple'
  | 'danger'
  | 'warning'
  | 'info'
  | 'secondary';

export interface ToolbarButton {
  label: string;
  icon?: IconName;
  onClick: () => void;
  variant?: ToolbarButtonVariant;
  disabled?: boolean;
}

export type ToolbarItem = ToolbarButton | 'divider';

export interface PageToolbarProps {
  /** Page / section title shown on the left */
  title: string;
  /** Optional muted label before the action buttons: e.g. "Add Itinerary:" */
  actionLabel?: string;
  /** Buttons + dividers on the right */
  actions?: ToolbarItem[];
  /** Optional tabs / extra content below the toolbar row */
  children?: React.ReactNode;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function PageToolbar({
  title,
  actionLabel,
  actions = [],
  children,
  className = '',
}: PageToolbarProps) {
  return (
    <div className={`tos-page-toolbar ${className}`}>
      <div className="tos-page-toolbar__row">
        {/* Left — title */}
        <h1 className="tos-page-toolbar__title">{title}</h1>

        {/* Right — action buttons */}
        {actions.length > 0 && (
          <div className="tos-page-toolbar__actions">
            {actionLabel && (
              <span className="tos-page-toolbar__action-label">{actionLabel}</span>
            )}
            {actions.map((item, i) =>
              item === 'divider' ? (
                <span key={`divider-${i}`} className="tos-page-toolbar__divider" />
              ) : (
                <button
                  key={item.label}
                  type="button"
                  className={`tos-page-toolbar__btn tos-page-toolbar__btn--${item.variant ?? 'primary'}`}
                  onClick={item.onClick}
                  disabled={item.disabled}
                  aria-label={item.label}
                >
                  {item.icon && <Icon name={item.icon} size={14} />}
                  <span>{item.label}</span>
                </button>
              ),
            )}
          </div>
        )}
      </div>

      {/* Optional tabs / sub-content */}
      {children && <div className="tos-page-toolbar__sub">{children}</div>}
    </div>
  );
}
