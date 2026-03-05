import type { CSSProperties } from 'react';
import * as icons from './icons';

export interface IconProps {
  name: keyof typeof icons;
  size?: number;
  className?: string;
  style?: CSSProperties;
  'aria-hidden'?: boolean | 'true' | 'false';
  'aria-label'?: string;
}

/**
 * Icon wrapper — Rule #4: never import lucide-react directly in features.
 * Always use <Icon name="ChevronRight" /> instead.
 */
export function Icon({ name, size = 16, className, style, 'aria-hidden': ariaHidden, 'aria-label': ariaLabel }: IconProps) {
  const LucideIcon = icons[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} className={className} style={style} aria-hidden={ariaHidden} aria-label={ariaLabel} />;
}
