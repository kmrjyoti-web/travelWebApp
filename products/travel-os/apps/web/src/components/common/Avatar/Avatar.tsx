'use client';

/**
 * @file src/components/common/Avatar/Avatar.tsx
 *
 * TravelOS Avatar component + AvatarGroup.
 *
 * Avatar fallback priority:  src (with error handling) → initials → icon → default silhouette
 * Status indicator:          small colored dot, bottom-right, aria-label="{status}"
 * AvatarGroup:               overlapping stack with "+N" overflow indicator
 *
 * Class anatomy: tos-avatar  tos-avatar--{size}  tos-avatar--{shape}
 * Group:  tos-avatar-group  tos-avatar-group--{size}  tos-avatar-group__overflow
 */

import React, { useState } from 'react';

import { cls, sizeClass } from '../utils';
import type { AvatarGroupProps, AvatarProps } from './types';

const BLOCK = 'tos-avatar';
const GROUP_BLOCK = 'tos-avatar-group';

/** Default user silhouette rendered when all other fallbacks are absent. */
function DefaultSilhouette() {
  return (
    <svg
      className={`${BLOCK}__default-icon`}
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      focusable="false"
    >
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

export function Avatar({
  src,
  alt = '',
  initials,
  icon,
  size = 'md',
  status,
  shape = 'circle',
  className,
  id,
  'data-testid': testId,
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const showImage = Boolean(src) && !imgError;
  const showInitials = !showImage && Boolean(initials);
  const showIcon = !showImage && !showInitials && icon != null;
  const showDefault = !showImage && !showInitials && !showIcon;

  const rootCls = cls(BLOCK, sizeClass(BLOCK, size), `${BLOCK}--${shape}`, className);

  return (
    <span
      className={rootCls}
      id={id}
      data-testid={testId}
      role="img"
      aria-label={alt || initials || 'Avatar'}
    >
      {showImage && (
        <img
          className={`${BLOCK}__img`}
          src={src}
          alt={alt}
          aria-hidden="true"
          onError={() => setImgError(true)}
        />
      )}

      {showInitials && (
        <span className={`${BLOCK}__initials`} aria-hidden="true">
          {initials!.slice(0, 2).toUpperCase()}
        </span>
      )}

      {showIcon && (
        <span className={`${BLOCK}__icon-wrap`} aria-hidden="true">
          {icon}
        </span>
      )}

      {showDefault && <DefaultSilhouette />}

      {status && (
        <span
          className={cls(`${BLOCK}__status`, `${BLOCK}__status--${status}`)}
          aria-label={status}
          data-testid={testId ? `${testId}-status` : undefined}
        />
      )}
    </span>
  );
}

// ─── AvatarGroup ──────────────────────────────────────────────────────────────

export function AvatarGroup({
  children,
  max,
  size = 'md',
  className,
  id,
  'data-testid': testId,
}: AvatarGroupProps) {
  const allAvatars = React.Children.toArray(children);
  const shown = max != null ? allAvatars.slice(0, max) : allAvatars;
  const excess = max != null ? Math.max(0, allAvatars.length - max) : 0;

  return (
    <div
      className={cls(GROUP_BLOCK, sizeClass(GROUP_BLOCK, size), className)}
      id={id}
      data-testid={testId}
      aria-label={`${allAvatars.length} avatar${allAvatars.length !== 1 ? 's' : ''}`}
    >
      {shown}
      {excess > 0 && (
        <span
          className={cls(`${GROUP_BLOCK}__overflow`, sizeClass(BLOCK, size))}
          aria-label={`${excess} more`}
          data-testid={testId ? `${testId}-overflow` : undefined}
        >
          +{excess}
        </span>
      )}
    </div>
  );
}
