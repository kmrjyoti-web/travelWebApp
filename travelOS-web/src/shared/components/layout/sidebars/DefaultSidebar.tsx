'use client';
import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useUIStore } from '@/shared/stores/ui.store';
import { Icon } from '@/shared/components/Icon';
import { NAVIGATION } from '@/config/navigation';
import type { NavItem } from '@/config/navigation';

// Highlight matching text in search results
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="tos-highlight">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

// Filter nav items recursively (adapted from UI-KIT Sidebar.tsx filterMenu)
function filterNav(items: NavItem[], query: string): NavItem[] {
  if (!query) return items;
  return items.reduce<NavItem[]>((acc, item) => {
    if (item.children) {
      const filtered = filterNav(item.children, query);
      if (filtered.length > 0) {
        acc.push({ ...item, children: filtered });
      } else if (item.label.toLowerCase().includes(query.toLowerCase())) {
        acc.push(item);
      }
    } else if (item.label.toLowerCase().includes(query.toLowerCase())) {
      acc.push(item);
    }
    return acc;
  }, []);
}

interface NavItemProps {
  item: NavItem;
  depth?: number;
  searchQuery: string;
  isCollapsed: boolean;
}

function NavItemRow({ item, depth = 0, searchQuery, isCollapsed }: NavItemProps) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = searchQuery ? true : expanded;

  const handleClick = useCallback(() => {
    if (hasChildren) setExpanded((e) => !e);
  }, [hasChildren]);

  const content = (
    <>
      {item.icon && depth === 0 ? (
        <Icon name={item.icon} size={16} className="tos-nav-item__icon" />
      ) : (
        <span style={{ width: 16, flexShrink: 0 }} />
      )}
      {!isCollapsed && (
        <>
          <span className="tos-nav-item__label">
            <HighlightText text={item.label} query={searchQuery} />
          </span>
          {hasChildren && (
            <Icon
              name="ChevronDown"
              size={14}
              className={`tos-nav-item__chevron ${isExpanded ? 'tos-nav-item--expanded' : ''}`}
            />
          )}
        </>
      )}
    </>
  );

  return (
    <>
      {item.href && !hasChildren ? (
        <Link href={item.href} className="tos-nav-item">
          {content}
        </Link>
      ) : (
        <button
          className="tos-nav-item"
          onClick={handleClick}
          title={isCollapsed ? item.label : undefined}
          type="button"
        >
          {content}
        </button>
      )}
      {hasChildren && isExpanded && !isCollapsed && (
        <div className="tos-nav-sub">
          {item.children!.map((child) => (
            <NavItemRow
              key={child.label}
              item={child}
              depth={depth + 1}
              searchQuery={searchQuery}
              isCollapsed={false}
            />
          ))}
        </div>
      )}
    </>
  );
}

export function DefaultSidebar() {
  const { isSidebarOpen, isSidebarHovered, setSidebarHovered } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');

  const isExpanded = isSidebarOpen || isSidebarHovered;
  const filteredNav = filterNav(NAVIGATION, searchQuery);

  return (
    <aside
      className={`tos-sidebar ${!isExpanded ? 'tos-sidebar--collapsed' : ''}`}
      onMouseEnter={() => !isSidebarOpen && setSidebarHovered(true)}
      onMouseLeave={() => setSidebarHovered(false)}
    >
      {isExpanded && (
        <div className="tos-sidebar__search">
          <div style={{ position: 'relative' }}>
            <Icon
              name="Search"
              size={14}
              style={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--tos-icon-color)',
              }}
            />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px 6px 28px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'var(--tos-border-radius-sm)',
                color: 'var(--tos-sidebar-text)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>
        </div>
      )}
      <nav className="tos-sidebar__nav">
        {filteredNav.map((item) => (
          <NavItemRow
            key={item.label}
            item={item}
            searchQuery={searchQuery}
            isCollapsed={!isExpanded}
          />
        ))}
      </nav>
    </aside>
  );
}
