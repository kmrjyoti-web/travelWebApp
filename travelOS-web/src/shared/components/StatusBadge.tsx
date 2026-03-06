'use client';
import React from 'react';
import { Badge } from './Badge';

/* ── Default status → color map ─────────────────────────────────────────── */
const DEFAULT_COLORS: Record<string, string> = {
  active:       'success',
  inactive:     'secondary',
  pending:      'warning',
  draft:        'info',
  approved:     'success',
  rejected:     'danger',
  cancelled:    'danger',
  canceled:     'danger',
  completed:    'success',
  'in-progress':'primary',
  inprogress:   'primary',
  processing:   'primary',
  suspended:    'danger',
  banned:       'danger',
  blocked:      'danger',
  open:         'primary',
  closed:       'secondary',
  archived:     'secondary',
  new:          'info',
  review:       'warning',
  'under-review':'warning',
  underreview:  'warning',
};

export interface StatusBadgeProps {
  status: string;
  /** Override or extend the default color map */
  colorMap?: Record<string, string>;
  className?: string;
}

/**
 * Renders a colored Badge for a status string.
 * Keys are normalized to lowercase with spaces→hyphens.
 *
 * @example
 * <StatusBadge status="under_review" />
 * <StatusBadge status="ACTIVE" colorMap={{ active: 'primary' }} />
 */
export function StatusBadge({ status, colorMap, className }: StatusBadgeProps) {
  const key    = status.toLowerCase().replace(/[\s_]+/g, '-');
  const merged = colorMap ? { ...DEFAULT_COLORS, ...colorMap } : DEFAULT_COLORS;
  const color  = (merged[key] ?? 'secondary') as React.ComponentProps<typeof Badge>['color'];

  return (
    <Badge color={color} className={className}>
      {status.replace(/[_-]+/g, ' ')}
    </Badge>
  );
}

/* ── ColorBadge — 45-color palette mapped from value ──────────────────── */
const COLOR_PALETTE: Record<string, { bg: string; text: string }> = {
  active:         { bg: '#dcfce7', text: '#166534' },
  inactive:       { bg: '#f3f4f6', text: '#374151' },
  pending:        { bg: '#fef9c3', text: '#854d0e' },
  draft:          { bg: '#eff6ff', text: '#1d4ed8' },
  approved:       { bg: '#dcfce7', text: '#166534' },
  rejected:       { bg: '#fee2e2', text: '#991b1b' },
  cancelled:      { bg: '#fee2e2', text: '#991b1b' },
  canceled:       { bg: '#fee2e2', text: '#991b1b' },
  completed:      { bg: '#dcfce7', text: '#166534' },
  'in-progress':  { bg: '#ede9fe', text: '#5b21b6' },
  processing:     { bg: '#ede9fe', text: '#5b21b6' },
  suspended:      { bg: '#fee2e2', text: '#991b1b' },
  banned:         { bg: '#fecaca', text: '#7f1d1d' },
  open:           { bg: '#dbeafe', text: '#1e40af' },
  closed:         { bg: '#f3f4f6', text: '#374151' },
  archived:       { bg: '#f3f4f6', text: '#6b7280' },
  new:            { bg: '#e0f2fe', text: '#0369a1' },
  high:           { bg: '#fee2e2', text: '#991b1b' },
  medium:         { bg: '#fef9c3', text: '#92400e' },
  low:            { bg: '#dcfce7', text: '#166534' },
  critical:       { bg: '#fecaca', text: '#7f1d1d' },
  urgent:         { bg: '#fee2e2', text: '#991b1b' },
  normal:         { bg: '#eff6ff', text: '#1d4ed8' },
  success:        { bg: '#dcfce7', text: '#166534' },
  failed:         { bg: '#fee2e2', text: '#991b1b' },
  error:          { bg: '#fee2e2', text: '#991b1b' },
  warning:        { bg: '#fef9c3', text: '#92400e' },
  info:           { bg: '#e0f2fe', text: '#0369a1' },
  paid:           { bg: '#dcfce7', text: '#166534' },
  unpaid:         { bg: '#fee2e2', text: '#991b1b' },
  refunded:       { bg: '#ede9fe', text: '#5b21b6' },
  overdue:        { bg: '#fecaca', text: '#7f1d1d' },
  confirmed:      { bg: '#dcfce7', text: '#166534' },
  tentative:      { bg: '#fef9c3', text: '#92400e' },
  booked:         { bg: '#dbeafe', text: '#1e40af' },
};

const FALLBACK = { bg: '#f3f4f6', text: '#374151' };

export interface ColorBadgeProps {
  value: string;
  colorMap?: Record<string, { bg: string; text: string }>;
  className?: string;
}

/**
 * Badge with inline bg+text colours from a 45-colour palette.
 * Use when you need exact hex colours rather than Bootstrap variants.
 */
export function ColorBadge({ value, colorMap, className }: ColorBadgeProps) {
  const key    = value.toLowerCase().replace(/[\s_]+/g, '-');
  const merged = colorMap ? { ...COLOR_PALETTE, ...colorMap } : COLOR_PALETTE;
  const colors = merged[key] ?? FALLBACK;

  return (
    <span
      className={`tos-color-badge${className ? ` ${className}` : ''}`}
      style={{ background: colors.bg, color: colors.text }}
    >
      {value.replace(/[_-]+/g, ' ')}
    </span>
  );
}
