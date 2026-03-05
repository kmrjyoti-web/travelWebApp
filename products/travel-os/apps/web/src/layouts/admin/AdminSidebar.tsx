'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useLayout } from '../LayoutProvider';
import { Icon } from '@/components/icons/Icon';
import type { IconProps } from '@/components/icons/Icon';

// ─── Nav data ─────────────────────────────────────────────────────────────────

export interface AdminNavItem {
  id: string;
  label: string;
  href?: string;
  icon: IconProps['name'];
  badge?: string;
  children?: AdminNavItem[];
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    id: 'admin-dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'Home',
  },
  {
    id: 'admin-users',
    label: 'Users',
    href: '/users',
    icon: 'Users',
  },
  {
    id: 'admin-access',
    label: 'Access Control',
    icon: 'Shield',
    children: [
      { id: 'admin-roles',       label: 'Roles',       href: '/admin/roles',       icon: 'Shield' },
      { id: 'admin-permissions', label: 'Permissions', href: '/admin/permissions', icon: 'Settings' },
    ],
  },
  {
    id: 'admin-tenants',
    label: 'Tenants',
    href: '/admin/tenants',
    icon: 'Building2',
  },
  {
    id: 'admin-logs',
    label: 'System Logs',
    href: '/admin/logs',
    icon: 'FileText',
  },
  {
    id: 'admin-analytics',
    label: 'Analytics',
    href: '/analytics',
    icon: 'TrendingUp',
  },
  {
    id: 'admin-database',
    label: 'Database',
    href: '/admin/database',
    icon: 'Database',
  },
  {
    id: 'admin-server',
    label: 'Servers',
    href: '/admin/servers',
    icon: 'Server',
  },
  {
    id: 'admin-settings',
    label: 'Settings',
    href: '/settings',
    icon: 'Settings',
  },
];

const ADMIN_STORAGE_KEY = 'tos-admin-sidebar-open';

// ─── AdminNavItemComponent ────────────────────────────────────────────────────

interface AdminNavItemProps {
  item: AdminNavItem;
  collapsed: boolean;
  pathname: string;
  expanded: Set<string>;
  onToggleExpand: (id: string) => void;
  depth?: number;
}

function AdminNavItemComponent({
  item,
  collapsed,
  pathname,
  expanded,
  onToggleExpand,
  depth = 0,
}: AdminNavItemProps) {
  const hasChildren = Boolean(item.children?.length);
  const isExpanded = expanded.has(item.id);
  const isActive =
    item.href
      ? pathname === item.href || pathname.startsWith(item.href + '/')
      : false;
  const isParentActive =
    hasChildren &&
    item.children?.some(
      (c) => c.href && (pathname === c.href || pathname.startsWith(c.href + '/')),
    );

  const indentStyle = depth > 0 ? { paddingLeft: `${12 + depth * 14}px` } : undefined;

  if (hasChildren) {
    return (
      <li className="tos-admin-sidebar__item tos-admin-sidebar__item--group" role="none">
        <button
          type="button"
          data-nav-item
          data-nav-id={item.id}
          className={[
            'tos-admin-sidebar__btn',
            isParentActive ? 'tos-admin-sidebar__btn--active' : '',
          ].join(' ').trim()}
          onClick={() => onToggleExpand(item.id)}
          aria-expanded={isExpanded}
          aria-label={collapsed ? item.label : undefined}
          style={indentStyle}
        >
          <Icon name={item.icon} size={18} className="tos-admin-sidebar__icon" aria-hidden />
          {!collapsed && (
            <>
              <span className="tos-admin-sidebar__label">{item.label}</span>
              {item.badge && (
                <span className="tos-admin-sidebar__badge" aria-label={`${item.badge} items`}>
                  {item.badge}
                </span>
              )}
              <Icon
                name={isExpanded ? 'ChevronDown' : 'ChevronRight'}
                size={13}
                className="tos-admin-sidebar__chevron"
                aria-hidden
              />
            </>
          )}
        </button>

        {isExpanded && !collapsed && (
          <ul
            className="tos-admin-sidebar__submenu"
            role="list"
            aria-label={`${item.label} submenu`}
          >
            {item.children?.map((child) => (
              <AdminNavItemComponent
                key={child.id}
                item={child}
                collapsed={false}
                pathname={pathname}
                expanded={expanded}
                onToggleExpand={onToggleExpand}
                depth={depth + 1}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li className="tos-admin-sidebar__item" role="none">
      <Link
        href={item.href ?? '#'}
        data-nav-item
        data-nav-id={item.id}
        className={[
          'tos-admin-sidebar__link',
          isActive ? 'tos-admin-sidebar__link--active' : '',
        ].join(' ').trim()}
        aria-current={isActive ? 'page' : undefined}
        aria-label={collapsed ? item.label : undefined}
        style={indentStyle}
      >
        <Icon name={item.icon} size={18} className="tos-admin-sidebar__icon" aria-hidden />
        {!collapsed && (
          <>
            <span className="tos-admin-sidebar__label">{item.label}</span>
            {item.badge && (
              <span className="tos-admin-sidebar__badge" aria-label={`${item.badge} items`}>
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    </li>
  );
}

// ─── AdminSidebar ─────────────────────────────────────────────────────────────

export function AdminSidebar() {
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useLayout();
  const pathname = usePathname() ?? '/';
  const [expanded, setExpanded] = useState<Set<string>>(new Set<string>());
  const navRef = useRef<HTMLElement>(null);

  // ── Restore collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (saved !== null) setSidebarOpen(saved === 'true');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Persist to localStorage
  useEffect(() => {
    localStorage.setItem(ADMIN_STORAGE_KEY, String(sidebarOpen));
  }, [sidebarOpen]);

  // ── Auto-expand parent of active route
  useEffect(() => {
    const parentIds = ADMIN_NAV_ITEMS.filter(
      (item) =>
        item.children?.some(
          (c) => c.href && (pathname === c.href || pathname.startsWith(c.href + '/')),
        ),
    ).map((item) => item.id);

    if (parentIds.length > 0) {
      setExpanded((prev) => {
        const next = new Set(prev);
        for (const id of parentIds) next.add(id);
        return next;
      });
    }
  }, [pathname]);

  // ── Ctrl+B toggle
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent): void => {
      if (e.key === 'b' && e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
        e.preventDefault();
        toggleSidebar();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [toggleSidebar]);

  const handleToggleExpand = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // ── Arrow key navigation
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLElement>) => {
    const focusable = Array.from(
      navRef.current?.querySelectorAll<HTMLElement>('[data-nav-item]') ?? [],
    );
    const idx = focusable.findIndex((el) => el === document.activeElement);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focusable[(idx + 1) % focusable.length]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusable[(idx - 1 + focusable.length) % focusable.length]?.focus();
        break;
      case 'Home':
        e.preventDefault();
        focusable[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        focusable[focusable.length - 1]?.focus();
        break;
      case 'ArrowRight': {
        const navId = (document.activeElement as HTMLElement | null)?.dataset.navId;
        if (navId) {
          const item = ADMIN_NAV_ITEMS.find((n) => n.id === navId);
          if (item?.children && !expanded.has(navId)) {
            setExpanded((prev) => new Set(prev).add(navId));
          }
        }
        break;
      }
      case 'ArrowLeft': {
        const navId = (document.activeElement as HTMLElement | null)?.dataset.navId;
        if (navId && expanded.has(navId)) {
          setExpanded((prev) => {
            const next = new Set(prev);
            next.delete(navId);
            return next;
          });
        }
        break;
      }
    }
  }, [expanded]);

  return (
    <aside
      id="admin-sidebar"
      className="tos-admin-sidebar"
      data-collapsed={!sidebarOpen}
      aria-label="Admin navigation"
      data-testid="admin-sidebar"
    >
      {/* Section label */}
      {sidebarOpen && (
        <div className="tos-admin-sidebar__section-label" aria-hidden>
          ADMINISTRATION
        </div>
      )}

      {/* Collapse toggle */}
      <button
        type="button"
        className="tos-admin-sidebar__collapse-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? 'Collapse admin sidebar' : 'Expand admin sidebar'}
        aria-keyshortcuts="Control+b"
        title={sidebarOpen ? 'Collapse (Ctrl+B)' : 'Expand (Ctrl+B)'}
      >
        <Icon
          name={sidebarOpen ? 'ChevronLeft' : 'ChevronRight'}
          size={16}
          aria-hidden
        />
      </button>

      {/* Navigation */}
      <nav
        ref={navRef}
        aria-label="Admin navigation"
        onKeyDown={handleKeyDown}
      >
        <ul className="tos-admin-sidebar__nav" role="list">
          {ADMIN_NAV_ITEMS.map((item) => (
            <AdminNavItemComponent
              key={item.id}
              item={item}
              collapsed={!sidebarOpen}
              pathname={pathname}
              expanded={expanded}
              onToggleExpand={handleToggleExpand}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}
