import type { ReactNode } from 'react';

import type { BaseProps } from '../types';

/** A single tab definition — id, label, icon, content, disabled state. */
export interface TabItem {
  /** Unique identifier used for ARIA and controlled state. */
  id: string;
  /** Visible tab label. */
  label: string;
  /** Optional icon rendered before the label. */
  icon?: ReactNode;
  /** Panel content rendered when this tab is active. */
  content: ReactNode;
  /** When true the tab button is disabled and cannot be selected. */
  disabled?: boolean;
}

export type TabsOrientation = 'horizontal' | 'vertical';

export interface TabsProps extends BaseProps {
  /** Tab definitions (label, content, icon, disabled). */
  items: TabItem[];
  /** Controlled active tab id. */
  activeTab?: string;
  /** Initial active tab id for uncontrolled usage. */
  defaultTab?: string;
  /** Called when the active tab changes. */
  onChange?: (tabId: string) => void;
  /**
   * Layout direction.
   * horizontal — tabs above content (ArrowLeft/Right navigation)
   * vertical   — tabs beside content (ArrowUp/Down navigation)
   * @default 'horizontal'
   */
  orientation?: TabsOrientation;
  /**
   * When true, tab panels are only mounted the first time they become active
   * (then stay in DOM, hidden). Prevents re-mounting on tab switch.
   * @default false
   */
  lazy?: boolean;
}
