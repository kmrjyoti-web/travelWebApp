'use client';

/**
 * @file src/hooks/useIsMobile.ts
 *
 * Returns true when the viewport width is below the mobile breakpoint (768px).
 * Migrated from UI-KIT-main/hooks/use-mobile.ts — refactored to use useMediaQuery.
 */

import { useMediaQuery } from './useMediaQuery';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
}
