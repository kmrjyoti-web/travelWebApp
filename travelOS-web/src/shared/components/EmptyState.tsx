'use client';
import React from 'react';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { Button } from './Button';

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  icon?: IconName;
}

export interface EmptyStateProps {
  icon?: IconName;
  title?: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
}

/**
 * Centered no-data / empty list placeholder.
 *
 * @example
 * <EmptyState
 *   icon="Map"
 *   title="No itineraries yet"
 *   description="Create your first travel package to get started."
 *   action={{ label: 'Create Itinerary', onClick: openCreate }}
 * />
 */
export function EmptyState({
  icon = 'FileText',
  title = 'No data found',
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`tos-empty${className ? ` ${className}` : ''}`} role="status">
      <span className="tos-empty__icon" aria-hidden>
        <Icon name={icon} size={48} />
      </span>
      <h3 className="tos-empty__title">{title}</h3>
      {description && <p className="tos-empty__description">{description}</p>}
      {action && (
        <Button
          color="primary"
          size="sm"
          className="tos-empty__action"
          onClick={action.onClick}
        >
          {action.icon && <Icon name={action.icon} size={14} aria-hidden />}
          {action.label}
        </Button>
      )}
    </div>
  );
}
