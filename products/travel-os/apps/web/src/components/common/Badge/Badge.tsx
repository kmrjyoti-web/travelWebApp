'use client';

/**
 * @file src/components/common/Badge/Badge.tsx
 *
 * TravelOS Badge component.
 *
 * Supports:
 *   • 3 variants: solid | outline | soft
 *   • 3 sizes: sm | md | lg
 *   • 5 intents: default | success | warning | error | info
 *   • Dot mode (status indicator — no text)
 *   • Numeric count with maxCount cap (99+)
 *   • Removable with × button and onRemove callback
 *
 * Class anatomy: tos-badge  tos-badge--{variant}  tos-badge--{size}  tos-badge--{intent}  tos-badge--dot
 * Element classes: tos-badge__label  tos-badge__remove
 */

import React from 'react';

import { cls, sizeClass, intentClass } from '../utils';
import type { BadgeProps } from './types';

const BLOCK = 'tos-badge';

function formatCount(count: number, maxCount: number): string {
  return count > maxCount ? `${maxCount}+` : String(count);
}

export function Badge({
  variant = 'solid',
  size = 'md',
  intent = 'default',
  dot = false,
  removable = false,
  onRemove,
  count,
  maxCount = 99,
  children,
  className,
  id,
  'data-testid': testId,
  'aria-label': ariaLabel,
  removeLabel = 'Remove',
}: BadgeProps) {
  const rootCls = cls(
    BLOCK,
    `${BLOCK}--${variant}`,
    sizeClass(BLOCK, size),
    intentClass(BLOCK, intent),
    dot && `${BLOCK}--dot`,
    className,
  );

  // Determine label content; null for dot badges
  const content = dot
    ? null
    : count !== undefined
    ? formatCount(count, maxCount)
    : children ?? null;

  return (
    <span
      className={rootCls}
      id={id}
      data-testid={testId}
      aria-label={ariaLabel}
    >
      {content != null && (
        <span className={`${BLOCK}__label`}>{content}</span>
      )}
      {removable && !dot && (
        <button
          type="button"
          className={`${BLOCK}__remove`}
          aria-label={removeLabel}
          onClick={onRemove}
          tabIndex={0}
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </span>
  );
}
