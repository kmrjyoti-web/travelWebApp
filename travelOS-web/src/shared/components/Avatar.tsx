'use client';
import React, { useState } from 'react';
import { CAvatar } from '@coreui/react';
import type { ComponentProps } from 'react';

/* ── Semantic status → CoreUI color ──────────────────────────────────────── */
const STATUS_COLOR: Record<string, string> = {
  online:  'success',
  offline: 'secondary',
  busy:    'danger',
  away:    'warning',
};

function getInitials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

export interface AvatarProps extends Omit<ComponentProps<typeof CAvatar>, 'status'> {
  /** Image src — falls back to initials on error */
  src?: string;
  /** Used to derive initials when no src (or on img error) */
  name?: string;
  /** Explicit initials override */
  initials?: string;
  /** Presence indicator: maps to CoreUI status colors */
  status?: 'online' | 'offline' | 'busy' | 'away' | (string & {});
}

/**
 * CAvatar wrapper with semantic status, initials fallback, and img error recovery.
 *
 * @example
 * <Avatar src={user.avatar} name="John Doe" status="online" size="md" />
 * <Avatar initials="AB" color="primary" />
 */
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, name, initials, status, children, ...props }, ref) => {
    const [imgError, setImgError] = useState(false);

    const resolvedInitials = initials ?? (name ? getInitials(name) : undefined);
    const resolvedSrc      = src && !imgError ? src : undefined;
    const coreUiStatus     = status ? (STATUS_COLOR[status] ?? status) : undefined;

    return (
      <CAvatar
        ref={ref}
        src={resolvedSrc}
        status={coreUiStatus as ComponentProps<typeof CAvatar>['status']}
        {...props}
      >
        {src && !imgError && (
          <img
            src={src}
            alt=""
            style={{ display: 'none' }}
            onError={() => setImgError(true)}
          />
        )}
        {!resolvedSrc && resolvedInitials ? resolvedInitials : children}
      </CAvatar>
    );
  },
);
Avatar.displayName = 'Avatar';

/* ── AvatarGroup ─────────────────────────────────────────────────────────── */
export interface AvatarGroupProps {
  /** Max avatars to show; excess becomes "+N" overflow badge */
  max?: number;
  /** Passed down to each Avatar child */
  size?: ComponentProps<typeof CAvatar>['size'];
  className?: string;
  children: React.ReactNode;
}

/**
 * Stacked avatar group with overflow indicator.
 *
 * @example
 * <AvatarGroup max={4}>
 *   {members.map(m => <Avatar key={m.id} src={m.avatar} name={m.name} />)}
 * </AvatarGroup>
 */
export function AvatarGroup({ max, size, className = '', children }: AvatarGroupProps) {
  const avatars  = React.Children.toArray(children);
  const visible  = max !== undefined ? avatars.slice(0, max) : avatars;
  const overflow = max !== undefined ? avatars.length - max : 0;

  return (
    <div className={`tos-avatar-group${className ? ` ${className}` : ''}`}>
      {visible.map((child, i) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<AvatarProps>, { key: i, size })
          : child,
      )}
      {overflow > 0 && (
        <span className="tos-avatar-group__overflow" aria-label={`${overflow} more`}>
          +{overflow}
        </span>
      )}
    </div>
  );
}
