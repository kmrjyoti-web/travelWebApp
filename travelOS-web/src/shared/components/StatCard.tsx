'use client';
import React from 'react';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { Spinner } from './Spinner';

export interface StatCardProps {
  /** Metric label shown below the value */
  title: string;
  /** Primary metric value (number or pre-formatted string) */
  value: string | number;
  /** Icon rendered in the card icon slot */
  icon?: IconName;
  /** Icon background color (CSS value) — defaults to --tos-primary */
  iconColor?: string;
  /**
   * Percentage delta vs previous period.
   * Positive → green ▲, negative → red ▼
   */
  delta?: number;
  /** Context label next to delta, e.g. "vs last month" */
  deltaLabel?: string;
  loading?: boolean;
  className?: string;
  /** Makes the card interactive (hover + pointer) */
  onClick?: () => void;
}

/**
 * KPI / metric card for dashboards.
 *
 * @example
 * <StatCard
 *   title="Total Bookings"
 *   value={1_284}
 *   icon="CalendarCheck"
 *   delta={12.5}
 *   deltaLabel="vs last month"
 * />
 */
export function StatCard({
  title,
  value,
  icon,
  iconColor,
  delta,
  deltaLabel,
  loading = false,
  className = '',
  onClick,
}: StatCardProps) {
  const isPositive = delta !== undefined && delta >= 0;
  const isNegative = delta !== undefined && delta < 0;

  return (
    <div
      className={[
        'tos-stat-card',
        onClick ? 'tos-stat-card--clickable' : '',
        className,
      ].filter(Boolean).join(' ')}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {loading ? (
        <div className="tos-stat-card__loading">
          <Spinner size="sm" />
        </div>
      ) : (
        <>
          <div className="tos-stat-card__top">
            <div className="tos-stat-card__value">{value}</div>
            {icon && (
              <span
                className="tos-stat-card__icon"
                style={iconColor ? { background: iconColor } : undefined}
                aria-hidden
              >
                <Icon name={icon} size={20} />
              </span>
            )}
          </div>

          <div className="tos-stat-card__title">{title}</div>

          {delta !== undefined && (
            <div className={[
              'tos-stat-card__delta',
              isPositive ? 'tos-stat-card__delta--up'   : '',
              isNegative ? 'tos-stat-card__delta--down' : '',
            ].filter(Boolean).join(' ')}>
              <Icon
                name={isPositive ? 'TrendingUp' : 'TrendingDown'}
                size={13}
                aria-hidden
              />
              <span>{Math.abs(delta).toFixed(1)}%</span>
              {deltaLabel && <span className="tos-stat-card__delta-label">{deltaLabel}</span>}
            </div>
          )}
        </>
      )}
    </div>
  );
}
