'use client';
import React from 'react';
import { icons } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

export type IconName = keyof typeof icons;

export interface IconProps extends LucideProps {
  name: IconName;
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(({ name, ...props }, ref) => {
  const LucideIcon = icons[name];
  if (!LucideIcon) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Icon] "${name}" not found in lucide-react`);
    }
    return null;
  }
  return <LucideIcon ref={ref} {...props} />;
});

Icon.displayName = 'Icon';
