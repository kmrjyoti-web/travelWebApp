'use client';
import React from 'react';
import { useUIStore } from '@/shared/stores/ui.store';
import { DefaultLayout } from './layouts/DefaultLayout';
import { HorizontalLayout } from './layouts/HorizontalLayout';
import { BoxedLayout } from './layouts/BoxedLayout';
import { MinimalLayout } from './layouts/MinimalLayout';
import type { LayoutVariant } from '@/shared/types/theme.types';

const LAYOUTS: Record<LayoutVariant, React.ComponentType<{ children: React.ReactNode }>> = {
  default: DefaultLayout,
  horizontal: HorizontalLayout,
  boxed: BoxedLayout,
  minimal: MinimalLayout,
};

export function LayoutSelector({ children }: { children: React.ReactNode }) {
  const { activeLayout, menuOrientation, layoutWidth } = useUIStore();

  // Derive effective layout from theme settings (compatible with UI-KIT orientation/width logic)
  let effectiveLayout: LayoutVariant = activeLayout;
  if (menuOrientation === 'horizontal') {
    effectiveLayout = 'horizontal';
  } else if (layoutWidth === 'boxed') {
    effectiveLayout = 'boxed';
  }

  const Layout = LAYOUTS[effectiveLayout] ?? DefaultLayout;
  return <Layout>{children}</Layout>;
}
