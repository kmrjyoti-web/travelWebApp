'use client';

/**
 * @file src/components/common/Tabs/Tabs.tsx
 *
 * TravelOS Tabs component.
 *
 * Features:
 *   • Controlled (activeTab) and uncontrolled (defaultTab) modes
 *   • Horizontal (ArrowLeft/Right) and vertical (ArrowUp/Down) keyboard navigation
 *   • Home/End jump to first/last enabled tab
 *   • Disabled tabs (skipped by keyboard navigation)
 *   • Lazy panel rendering (mount on first activation, stay hidden after)
 *   • Icon + label in tab buttons
 *   • Full ARIA: role=tablist/tab/tabpanel, aria-selected, aria-controls, aria-labelledby
 *
 * Class anatomy:
 *   tos-tabs  tos-tabs--horizontal|vertical
 *   tos-tabs__list  tos-tabs__tab  tos-tabs__tab--active  tos-tabs__tab--disabled
 *   tos-tabs__tab-icon  tos-tabs__tab-label
 *   tos-tabs__panels  tos-tabs__panel  tos-tabs__panel--active
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { cls } from '../utils';
import type { TabsProps } from './types';

const BLOCK = 'tos-tabs';

export function Tabs({
  items,
  activeTab: controlledTab,
  defaultTab,
  onChange,
  orientation = 'horizontal',
  lazy = false,
  className,
  id,
  'data-testid': testId,
}: TabsProps) {
  const firstEnabled = items.find((item) => !item.disabled)?.id ?? '';
  const [internalTab, setInternalTab] = useState(defaultTab ?? firstEnabled);

  const isControlled = controlledTab !== undefined;
  const activeId = isControlled ? controlledTab : internalTab;

  // Track which panels have been activated at least once (for lazy rendering)
  const [activated, setActivated] = useState<Set<string>>(() => new Set([activeId]));

  // When controlled, keep activated set in sync
  useEffect(() => {
    if (isControlled && controlledTab) {
      setActivated((prev) => new Set([...prev, controlledTab]));
    }
  }, [isControlled, controlledTab]);

  // Refs for focus management
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectTab = useCallback(
    (tabId: string) => {
      if (!isControlled) setInternalTab(tabId);
      setActivated((prev) => new Set([...prev, tabId]));
      onChange?.(tabId);
    },
    [isControlled, onChange],
  );

  // Indices of non-disabled tabs (for keyboard wrap-around)
  const enabledIndexes = items
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => !item.disabled)
    .map(({ idx }) => idx);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, currentIdx: number) => {
      const isH = orientation === 'horizontal';
      const prevKey = isH ? 'ArrowLeft' : 'ArrowUp';
      const nextKey = isH ? 'ArrowRight' : 'ArrowDown';

      const pos = enabledIndexes.indexOf(currentIdx);
      let target: number | null = null;

      if (e.key === nextKey) {
        e.preventDefault();
        target = enabledIndexes[(pos + 1) % enabledIndexes.length];
      } else if (e.key === prevKey) {
        e.preventDefault();
        target = enabledIndexes[(pos - 1 + enabledIndexes.length) % enabledIndexes.length];
      } else if (e.key === 'Home') {
        e.preventDefault();
        target = enabledIndexes[0];
      } else if (e.key === 'End') {
        e.preventDefault();
        target = enabledIndexes[enabledIndexes.length - 1];
      }

      if (target !== null) {
        tabRefs.current[target]?.focus();
      }
    },
    [orientation, enabledIndexes],
  );

  return (
    <div
      className={cls(BLOCK, `${BLOCK}--${orientation}`, className)}
      id={id}
      data-testid={testId}
    >
      <div
        role="tablist"
        aria-orientation={orientation}
        className={`${BLOCK}__list`}
      >
        {items.map((item, idx) => {
          const isActive = item.id === activeId;
          const tabId = `${BLOCK}-tab-${item.id}`;
          const panelId = `${BLOCK}-panel-${item.id}`;

          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              role="tab"
              id={tabId}
              aria-controls={panelId}
              aria-selected={isActive}
              aria-disabled={item.disabled || undefined}
              tabIndex={isActive ? 0 : -1}
              disabled={item.disabled}
              className={cls(
                `${BLOCK}__tab`,
                isActive && `${BLOCK}__tab--active`,
                item.disabled && `${BLOCK}__tab--disabled`,
              )}
              onClick={() => !item.disabled && selectTab(item.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              data-testid={testId ? `${testId}-tab-${item.id}` : undefined}
            >
              {item.icon != null && (
                <span className={`${BLOCK}__tab-icon`} aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <span className={`${BLOCK}__tab-label`}>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className={`${BLOCK}__panels`}>
        {items.map((item) => {
          const isActive = item.id === activeId;
          const shouldRender = !lazy || activated.has(item.id);

          return (
            <div
              key={item.id}
              role="tabpanel"
              id={`${BLOCK}-panel-${item.id}`}
              aria-labelledby={`${BLOCK}-tab-${item.id}`}
              hidden={!isActive}
              tabIndex={0}
              className={cls(`${BLOCK}__panel`, isActive && `${BLOCK}__panel--active`)}
              data-testid={testId ? `${testId}-panel-${item.id}` : undefined}
            >
              {shouldRender ? item.content : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
