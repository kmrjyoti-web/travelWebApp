import type { ReactNode } from 'react';

import type { Size, BaseProps } from '../types';

/** Online presence / availability status shown as a colored dot. */
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

/** Shape of the avatar container. */
export type AvatarShape = 'circle' | 'square';

export interface AvatarProps extends BaseProps {
  /**
   * Image URL. When provided, renders an <img> element.
   * Falls back to `initials` → `icon` → default silhouette on error.
   */
  src?: string;
  /** Alt text for the image (also used as accessible label). */
  alt?: string;
  /** Fallback text (up to 2 chars, auto-uppercased). Shown when no valid image. */
  initials?: string;
  /** Fallback icon node. Shown when no valid image and no initials. */
  icon?: ReactNode;
  /** Component size. @default 'md' */
  size?: Size;
  /** Status indicator dot in the bottom-right corner. */
  status?: AvatarStatus;
  /** Shape of the avatar. @default 'circle' */
  shape?: AvatarShape;
}

export interface AvatarGroupProps extends BaseProps {
  /** Avatar children to stack. */
  children: ReactNode;
  /** Maximum number of avatars to show. Excess shown as "+N". */
  max?: number;
  /** Size applied to the overflow indicator (should match child Avatar sizes). @default 'md' */
  size?: Size;
}
