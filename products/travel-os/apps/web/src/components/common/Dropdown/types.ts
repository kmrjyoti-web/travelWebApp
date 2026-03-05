import type { ReactNode, KeyboardEvent } from 'react';
import type { Size, Variant, BaseProps } from '../types';

// ─── Placement ────────────────────────────────────────────────────────────────

export type DropdownPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'bottom'
  | 'top-start'
  | 'top-end'
  | 'top';

// ─── Dropdown (root) ──────────────────────────────────────────────────────────

export interface DropdownProps extends BaseProps {
  /** Whether the dropdown is open (controlled). */
  open?: boolean;
  /** Default open state (uncontrolled). */
  defaultOpen?: boolean;
  /** Called when open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Preferred placement of the menu. Auto-flips if there is not enough space. */
  placement?: DropdownPlacement;
  /** Close on selecting an item (default true). */
  closeOnSelect?: boolean;
  /** Close when clicking outside (default true). */
  closeOnOutsideClick?: boolean;
  children: ReactNode;
}

// ─── DropdownTrigger ──────────────────────────────────────────────────────────

export interface DropdownTriggerProps extends BaseProps {
  /** Render a custom trigger element (wraps in a span if not provided). */
  children: ReactNode;
  /** Forwarded aria-label for icon-only triggers. */
  'aria-label'?: string;
}

// ─── DropdownMenu ─────────────────────────────────────────────────────────────

export interface DropdownMenuProps extends BaseProps {
  children: ReactNode;
  /** Minimum width of the menu (defaults to trigger width). */
  minWidth?: number | string;
}

// ─── DropdownItem ─────────────────────────────────────────────────────────────

export interface DropdownItemProps extends BaseProps {
  children: ReactNode;
  /** Fired when the item is activated (click or Enter/Space). */
  onSelect?: () => void;
  disabled?: boolean;
  /** Icon shown to the left of the label. */
  icon?: ReactNode;
  /** Secondary text shown to the right. */
  shortcut?: string;
  /** Renders the item with a danger/destructive style. */
  destructive?: boolean;
  /** Tab index for internal keyboard management. */
  tabIndex?: number;
  size?: Size;
  variant?: Variant;
  /** Href — renders as an anchor when provided. */
  href?: string;
  target?: string;
  rel?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
}

// ─── DropdownSeparator ────────────────────────────────────────────────────────

export interface DropdownSeparatorProps extends BaseProps {
  /** Optional accessible label. */
  'aria-label'?: string;
}

// ─── DropdownLabel (section heading) ─────────────────────────────────────────

export interface DropdownLabelProps extends BaseProps {
  children: ReactNode;
}

// ─── Context value (internal) ────────────────────────────────────────────────

export interface DropdownContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  closeOnSelect: boolean;
  triggerId: string;
  menuId: string;
}
