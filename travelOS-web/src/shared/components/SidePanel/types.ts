import type React from 'react';
import type { IconName } from '@/shared/components/Icon';

/** Panel display states */
export type PanelState = 'normal' | 'minimized' | 'maximized' | 'fullscreen';

/** How a button renders its content — icon only | text only | both */
export type ShowAs = 'icon' | 'text' | 'both';

/** Button definition for header or footer arrays */
export interface ActionButton {
  /** Unique key within the array */
  id: string;
  label?: string;
  icon?: IconName;
  /** Render mode. Defaults to 'both' when icon+label present, else icon or text */
  showAs?: ShowAs;
  /** Visual style */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  /** Associate with a form element id for submit outside the form tag */
  form?: string;
}

/** Configuration passed to useSidePanelStore.openPanel() */
export interface PanelConfig {
  id: string;
  title: string;
  /** Panel body — any React element */
  content: React.ReactNode;
  headerButtons?: ActionButton[];
  footerButtons?: ActionButton[];
  /** Panel width in 'normal' state. Default 600 */
  width?: number | string;
  /** URL opened when user clicks the "Open in new tab" window control */
  newTabUrl?: string;
  /** Remove body padding — for panels with full-bleed content */
  noPadding?: boolean;
}

/** Entry in the global panel store */
export interface PanelInstance {
  config: PanelConfig;
  state: PanelState;
  zIndex: number;
}
