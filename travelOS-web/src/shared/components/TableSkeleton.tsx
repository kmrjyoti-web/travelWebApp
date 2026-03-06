'use client';
import React from 'react';

export interface TableSkeletonProps {
  /** Number of columns (default: 6) */
  columns?: number;
  /** Number of data rows (default: 10) */
  rows?: number;
  /** Optional title shown in the toolbar area */
  title?: string;
  className?: string;
}

/**
 * Animated loading skeleton that matches a data table layout.
 * Use while data is being fetched.
 *
 * @example
 * {isLoading ? <TableSkeleton columns={5} rows={8} title="Itineraries" /> : <DataTable ... />}
 */
export function TableSkeleton({ columns = 6, rows = 10, title, className = '' }: TableSkeletonProps) {
  return (
    <div className={`tos-table-skeleton${className ? ` ${className}` : ''}`} aria-busy="true" aria-label="Loading table data">
      {/* Toolbar */}
      <div className="tos-table-skeleton__toolbar">
        {title
          ? <span className="tos-table-skeleton__toolbar-title">{title}</span>
          : <SkeletonBar width={160} height={20} />}
        <div className="tos-table-skeleton__toolbar-actions">
          <SkeletonBar width={80} height={32} radius={6} />
          <SkeletonBar width={32} height={32} radius={6} />
          <SkeletonBar width={32} height={32} radius={6} />
        </div>
      </div>

      {/* Table */}
      <div className="tos-table-skeleton__table">
        {/* Header row */}
        <div className="tos-table-skeleton__row tos-table-skeleton__row--header">
          {Array.from({ length: columns }).map((_, c) => (
            <div key={c} className="tos-table-skeleton__cell">
              <SkeletonBar width={c === 0 ? 120 : 80} height={14} />
            </div>
          ))}
        </div>

        {/* Data rows */}
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="tos-table-skeleton__row"
            style={{ animationDelay: `${r * 0.04}s` }}
          >
            {Array.from({ length: columns }).map((_, c) => (
              <div key={c} className="tos-table-skeleton__cell">
                <SkeletonBar
                  width={c === columns - 1 ? 60 : c === 0 ? 140 : 90 + (r + c) % 3 * 20}
                  height={14}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Footer / pager */}
      <div className="tos-table-skeleton__footer">
        <SkeletonBar width={120} height={14} />
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonBar key={i} width={32} height={32} radius={4} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Internal skeleton bar ──────────────────────────────────────────────── */
function SkeletonBar({ width, height, radius = 4 }: { width: number; height: number; radius?: number }) {
  return (
    <span
      className="tos-skeleton-bar"
      style={{ width, height, borderRadius: radius }}
      aria-hidden
    />
  );
}
