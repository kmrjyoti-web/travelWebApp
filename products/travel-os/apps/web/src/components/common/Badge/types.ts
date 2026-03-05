import type { ReactNode } from 'react';

import type { Size, Intent, BaseProps } from '../types';

/** Visual treatment for Badge. */
export type BadgeVariant = 'solid' | 'outline' | 'soft';

export interface BadgeProps extends BaseProps {
  /** Visual treatment. @default 'solid' */
  variant?: BadgeVariant;
  /** Component size. @default 'md' */
  size?: Size;
  /** Semantic color intent. @default 'default' */
  intent?: Intent;
  /** Render as a small colored dot — suppresses children and count. */
  dot?: boolean;
  /** Show a remove (×) button after the label. */
  removable?: boolean;
  /** Called when the remove button is clicked. */
  onRemove?: () => void;
  /** Numeric count to display instead of children. */
  count?: number;
  /** Cap for count display — values above this render as `{maxCount}+`. @default 99 */
  maxCount?: number;
  /** Label text / content. Ignored when `count` is set. */
  children?: ReactNode;
  /** Accessible label for the remove button. @default 'Remove' */
  removeLabel?: string;
  /** Accessible name for the badge (especially useful for dot badges). */
  'aria-label'?: string;
}
