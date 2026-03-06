'use client';
import React from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Right-aligned slot — buttons, badges, etc. */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Page-level header: title + optional subtitle + right-side actions.
 *
 * @example
 * <PageHeader
 *   title="Itineraries"
 *   subtitle="Manage your travel packages"
 *   actions={<Button onClick={openCreate}>New Itinerary</Button>}
 * />
 */
export function PageHeader({ title, subtitle, actions, className = '' }: PageHeaderProps) {
  return (
    <div className={`tos-page-header${className ? ` ${className}` : ''}`}>
      <div className="tos-page-header__text">
        <h1 className="tos-page-header__title">{title}</h1>
        {subtitle && <p className="tos-page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="tos-page-header__actions">{actions}</div>}
    </div>
  );
}
