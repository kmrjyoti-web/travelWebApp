'use client';
import React from 'react';
import { CBadge } from '@coreui/react';
import type { ComponentProps } from 'react';

export interface BadgeProps extends ComponentProps<typeof CBadge> {
  /**
   * Renders as a small circular dot (no text).
   * Useful for notification indicators on icons/avatars.
   */
  dot?: boolean;
  /**
   * Caps a numeric child at this value; renders "{max}+" when exceeded.
   * @example <Badge max={99}>{unreadCount}</Badge>
   */
  max?: number;
}

/**
 * CBadge wrapper with dot-mode and numeric cap.
 *
 * @example
 * <Badge color="danger" dot />                   // red dot
 * <Badge color="primary" max={99}>{count}</Badge> // "99+" when count > 99
 */
export const Badge = React.forwardRef<HTMLElement, BadgeProps>(
  ({ dot, max, children, className = '', style, color, ...props }, ref) => {
    if (dot) {
      return (
        <span
          className={`tos-badge-dot tos-badge-dot--${color ?? 'primary'}${className ? ` ${className}` : ''}`}
          style={style}
          aria-hidden
        />
      );
    }

    let content = children;
    if (max !== undefined && typeof children === 'number' && children > max) {
      content = `${max}+`;
    }

    return (
      <CBadge
        ref={ref as React.Ref<HTMLSpanElement>}
        color={color}
        className={className}
        style={style}
        {...props}
      >
        {content}
      </CBadge>
    );
  },
);
Badge.displayName = 'Badge';
