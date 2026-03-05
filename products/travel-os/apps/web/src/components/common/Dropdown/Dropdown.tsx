'use client';

/**
 * @file src/components/common/Dropdown/Dropdown.tsx
 *
 * Compound-component Dropdown.
 *
 * Sub-components:
 *   Dropdown          — root; manages open/close state + context
 *   DropdownTrigger   — clickable element that opens/closes the menu
 *   DropdownMenu      — the floating menu panel (auto-flip, focus trap)
 *   DropdownItem      — a single selectable row (click, Enter, Space)
 *   DropdownSeparator — <hr> divider
 *   DropdownLabel     — non-interactive section heading
 *
 * Usage:
 *   <Dropdown>
 *     <DropdownTrigger><Button>Open</Button></DropdownTrigger>
 *     <DropdownMenu>
 *       <DropdownLabel>Actions</DropdownLabel>
 *       <DropdownItem onSelect={() => …}>Edit</DropdownItem>
 *       <DropdownSeparator />
 *       <DropdownItem destructive onSelect={…}>Delete</DropdownItem>
 *     </DropdownMenu>
 *   </Dropdown>
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { cls } from '../utils';
import type {
  DropdownContextValue,
  DropdownItemProps,
  DropdownLabelProps,
  DropdownMenuProps,
  DropdownProps,
  DropdownSeparatorProps,
  DropdownTriggerProps,
} from './types';

const BLOCK = 'tos-dropdown';
const MENU_BLOCK = 'tos-dropdown-menu';
const ITEM_BLOCK = 'tos-dropdown-item';

// ─── Context ──────────────────────────────────────────────────────────────────

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext(component: string): DropdownContextValue {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error(`${component} must be used inside a Dropdown`);
  return ctx;
}

// ─── Dropdown (root) ──────────────────────────────────────────────────────────

export function Dropdown({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom-start',
  closeOnSelect = true,
  closeOnOutsideClick = true,
  children,
  className,
  id,
  'data-testid': testId,
}: DropdownProps) {
  const uid = useId();
  const triggerId = `${uid}-trigger`;
  const menuId = `${uid}-menu`;

  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? controlledOpen! : internalOpen;

  const rootRef = useRef<HTMLDivElement>(null);

  const open = useCallback(() => {
    if (!isControlled) setInternalOpen(true);
    onOpenChange?.(true);
  }, [isControlled, onOpenChange]);

  const close = useCallback(() => {
    if (!isControlled) setInternalOpen(false);
    onOpenChange?.(false);
  }, [isControlled, onOpenChange]);

  const toggle = useCallback(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, open, close]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick) return;
    function handlePointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen, closeOnOutsideClick, close]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        // Return focus to trigger
        const trigger = rootRef.current?.querySelector<HTMLElement>(
          `[data-dropdown-trigger]`,
        );
        trigger?.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  const rootCls = cls(
    BLOCK,
    `${BLOCK}--${placement}`,
    isOpen && `${BLOCK}--open`,
    className,
  );

  return (
    <DropdownContext.Provider
      value={{ isOpen, open, close, toggle, closeOnSelect, triggerId, menuId }}
    >
      <div
        ref={rootRef}
        className={rootCls}
        id={id}
        data-testid={testId ?? 'dropdown'}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

// ─── DropdownTrigger ──────────────────────────────────────────────────────────

export function DropdownTrigger({
  children,
  className,
  id,
  'data-testid': testId,
  'aria-label': ariaLabel,
}: DropdownTriggerProps) {
  const { toggle, isOpen, menuId, triggerId } = useDropdownContext('DropdownTrigger');

  function handleKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) toggle();
    }
  }

  return (
    <span
      id={id ?? triggerId}
      className={cls(`${BLOCK}__trigger`, className)}
      data-testid={testId ?? 'dropdown-trigger'}
      data-dropdown-trigger
      onClick={toggle}
      onKeyDown={handleKeyDown}
      aria-haspopup="true"
      aria-expanded={isOpen}
      aria-controls={menuId}
      aria-label={ariaLabel}
      role="button"
      tabIndex={0}
    >
      {children}
    </span>
  );
}

// ─── DropdownMenu ─────────────────────────────────────────────────────────────

export function DropdownMenu({
  children,
  className,
  id,
  minWidth,
  'data-testid': testId,
}: DropdownMenuProps) {
  const { isOpen, menuId } = useDropdownContext('DropdownMenu');
  const menuRef = useRef<HTMLDivElement>(null);

  // Focus first item when opened
  useEffect(() => {
    if (isOpen) {
      const firstItem = menuRef.current?.querySelector<HTMLElement>(
        '[data-dropdown-item]:not([aria-disabled="true"])',
      );
      firstItem?.focus();
    }
  }, [isOpen]);

  // Keyboard navigation within menu (ArrowUp/ArrowDown)
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>(
        '[data-dropdown-item]:not([aria-disabled="true"])',
      ) ?? [],
    );
    const idx = items.findIndex((el) => el === document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(idx + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(idx - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  }

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      id={id ?? menuId}
      role="menu"
      className={cls(MENU_BLOCK, className)}
      data-testid={testId ?? 'dropdown-menu'}
      style={minWidth !== undefined ? { minWidth } : undefined}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}

// ─── DropdownItem ─────────────────────────────────────────────────────────────

export function DropdownItem({
  children,
  onSelect,
  disabled = false,
  icon,
  shortcut,
  destructive = false,
  href,
  target,
  rel,
  className,
  id,
  tabIndex = -1,
  'data-testid': testId,
}: DropdownItemProps) {
  const { close, closeOnSelect } = useDropdownContext('DropdownItem');

  function activate() {
    if (disabled) return;
    onSelect?.();
    if (closeOnSelect) close();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activate();
    }
  }

  const itemCls = cls(
    ITEM_BLOCK,
    destructive && `${ITEM_BLOCK}--destructive`,
    disabled && `${ITEM_BLOCK}--disabled`,
    className,
  );

  const sharedProps = {
    id,
    role: 'menuitem' as const,
    className: itemCls,
    'data-testid': testId ?? 'dropdown-item',
    'data-dropdown-item': true,
    'aria-disabled': disabled || undefined,
    tabIndex: disabled ? undefined : tabIndex,
    onClick: activate,
    onKeyDown: handleKeyDown,
  };

  const inner = (
    <>
      {icon && <span className={`${ITEM_BLOCK}__icon`} aria-hidden="true">{icon}</span>}
      <span className={`${ITEM_BLOCK}__label`}>{children}</span>
      {shortcut && (
        <span className={`${ITEM_BLOCK}__shortcut`} aria-hidden="true">
          {shortcut}
        </span>
      )}
    </>
  );

  if (href && !disabled) {
    return (
      <a href={href} target={target} rel={rel} {...sharedProps}>
        {inner}
      </a>
    );
  }

  return <div {...sharedProps}>{inner}</div>;
}

// ─── DropdownSeparator ────────────────────────────────────────────────────────

export function DropdownSeparator({
  className,
  id,
  'data-testid': testId,
  'aria-label': ariaLabel,
}: DropdownSeparatorProps) {
  return (
    <hr
      id={id}
      role="separator"
      aria-label={ariaLabel}
      className={cls(`${MENU_BLOCK}__separator`, className)}
      data-testid={testId ?? 'dropdown-separator'}
    />
  );
}

// ─── DropdownLabel ────────────────────────────────────────────────────────────

export function DropdownLabel({
  children,
  className,
  id,
  'data-testid': testId,
}: DropdownLabelProps) {
  return (
    <div
      id={id}
      role="presentation"
      className={cls(`${MENU_BLOCK}__label`, className)}
      data-testid={testId ?? 'dropdown-label'}
    >
      {children}
    </div>
  );
}
