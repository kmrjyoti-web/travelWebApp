'use client';
import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUIStore } from '@/shared/stores/ui.store';
import { useAuthStore } from '@/shared/stores/auth.store';
import { Input, Button } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import { Avatar } from '@/shared/components/Avatar';
import { NAVIGATION } from '@/config/navigation';
import type { NavItem } from '@/config/navigation';

// ─── Search highlight ──────────────────────────────────────────────────────────
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="tos-sidebar__highlight">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

// ─── Filter nav recursively ────────────────────────────────────────────────────
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

// ─── Nav item row ──────────────────────────────────────────────────────────────
interface NavItemRowProps {
  item: NavItem;
  depth?: number;
  searchQuery: string;
  isCollapsed: boolean;
  pathname: string;
}

function hasActiveDescendant(items: NavItem[], pathname: string): boolean {
  return items.some(
    (c) => c.href === pathname || (c.children ? hasActiveDescendant(c.children, pathname) : false),
  );
}

function NavItemRow({ item, depth = 0, searchQuery, isCollapsed, pathname }: NavItemRowProps) {
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const [expanded, setExpanded] = useState(
    () => hasChildren && hasActiveDescendant(item.children ?? [], pathname),
  );
  const isExpanded = searchQuery ? true : expanded;
  const isActive = item.href ? pathname === item.href : false;

  const handleToggle = useCallback(() => {
    if (hasChildren) setExpanded((e) => !e);
  }, [hasChildren]);

  const itemClass = [
    'tos-nav-item',
    isActive ? 'tos-nav-item--active' : '',
    isExpanded && hasChildren ? 'tos-nav-item--expanded' : '',
  ].filter(Boolean).join(' ');

  const iconSize = depth === 0 ? 16 : 13;

  const itemContent = (
    <>
      {item.icon ? (
        <Icon name={item.icon} size={iconSize} className="tos-nav-item__icon" />
      ) : depth > 0 ? (
        <span className="tos-nav-item__dot" />
      ) : (
        <span style={{ width: 16, flexShrink: 0 }} />
      )}
      {!isCollapsed && (
        <>
          <span className="tos-nav-item__label">
            <HighlightText text={item.label} query={searchQuery} />
          </span>
          {hasChildren && (
            <Icon name="ChevronDown" size={14} className="tos-nav-item__chevron" />
          )}
        </>
      )}
    </>
  );

  return (
    <>
      {item.href && !hasChildren ? (
        <Link href={item.href} className={itemClass} title={isCollapsed ? item.label : undefined}>
          {itemContent}
        </Link>
      ) : (
        <Button
          type="button"
          className={`tos-nav-item-btn ${itemClass}`}
          onClick={handleToggle}
          title={isCollapsed ? item.label : undefined}
        >
          {itemContent}
        </Button>
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
              pathname={pathname}
            />
          ))}
        </div>
      )}
    </>
  );
}

// ─── DefaultSidebar ────────────────────────────────────────────────────────────
export function DefaultSidebar() {
  const { isSidebarOpen, isSidebarHovered, setSidebarHovered } = useUIStore();
  const { user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  const isExpanded = isSidebarOpen || isSidebarHovered;
  const filteredNav = filterNav(NAVIGATION, searchQuery);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const displayName = user?.name ?? 'System Admin';
  const displayRole = user?.role ?? 'Super Admin';

  return (
    <aside
      className={`tos-sidebar ${!isExpanded ? 'tos-sidebar--collapsed' : ''}`}
      onMouseEnter={() => !isSidebarOpen && setSidebarHovered(true)}
      onMouseLeave={() => setSidebarHovered(false)}
    >
      {isExpanded ? (
        <div className="tos-sidebar__search">
          <Input
            icon="Search"
            inputSize="sm"
            placeholder="Type to search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="tos-sidebar__search-input"
            aria-label="Search navigation"
          />
        </div>
      ) : (
        <div className="tos-sidebar__search-icon">
          <Icon name="Search" size={16} style={{ color: 'var(--tos-icon-color)' }} />
        </div>
      )}

      <nav className="tos-sidebar__nav" aria-label="Main navigation">
        {filteredNav.map((item) => (
          <NavItemRow
            key={item.label}
            item={item}
            searchQuery={searchQuery}
            isCollapsed={!isExpanded}
            pathname={pathname}
          />
        ))}
      </nav>

      {/* User Profile Section (bottom) */}
      <div className="tos-sidebar__user">
        {isExpanded ? (
          <>
            <div className="tos-sidebar__user-info">
              <Avatar
                size="sm"
                color="primary"
                textColor="white"
                className="tos-sidebar__user-avatar"
              >
                {displayName[0].toUpperCase()}
              </Avatar>
              <div className="tos-sidebar__user-details">
                <div className="tos-sidebar__user-name">{displayName}</div>
                <div className="tos-sidebar__user-role">{displayRole}</div>
              </div>
              <button
                type="button"
                className="tos-sidebar__user-logout"
                onClick={handleLogout}
                title="Sign Out"
                aria-label="Sign Out"
              >
                <Icon name="LogOut" size={16} />
              </button>
            </div>
            <div className="tos-sidebar__user-footer">
              TravelOS Admin
            </div>
          </>
        ) : (
          <div className="tos-sidebar__user-collapsed">
            <Avatar
              size="sm"
              color="primary"
              textColor="white"
              className="tos-sidebar__user-avatar"
            >
              {displayName[0].toUpperCase()}
            </Avatar>
          </div>
        )}
      </div>
    </aside>
  );
}
