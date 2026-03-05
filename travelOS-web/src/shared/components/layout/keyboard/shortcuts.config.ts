import type { LayoutVariant } from '@/shared/types/theme.types';

export interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: string;
  description: string;
  layouts?: LayoutVariant[]; // Restrict to specific layouts. Omit for all.
}

export const SHORTCUTS: Shortcut[] = [
  {
    key: 'b',
    ctrl: true,
    action: 'toggle-sidebar',
    description: 'Toggle sidebar',
    layouts: ['default', 'boxed'],
  },
  {
    key: 'k',
    ctrl: true,
    action: 'open-search',
    description: 'Open global search',
  },
  {
    key: ',',
    ctrl: true,
    action: 'open-settings',
    description: 'Open theme settings',
  },
  {
    key: 'd',
    ctrl: true,
    shift: true,
    action: 'toggle-dark',
    description: 'Toggle dark mode',
  },
  {
    key: 'l',
    ctrl: true,
    shift: true,
    action: 'toggle-layout',
    description: 'Cycle layout (Default → Horizontal → Boxed)',
  },
  {
    key: '/',
    ctrl: true,
    action: 'show-shortcuts',
    description: 'Show keyboard shortcuts',
  },
  {
    key: 'Escape',
    action: 'close-panel',
    description: 'Close active panel / settings',
  },
  {
    key: 'h',
    ctrl: true,
    alt: true,
    action: 'go-home',
    description: 'Go to Dashboard',
  },
];

export const LAYOUT_CYCLE: LayoutVariant[] = ['default', 'horizontal', 'boxed'];
