'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

import { useLayout } from '../LayoutProvider';
import { Icon } from '@/components/icons/Icon';
import type { IconProps } from '@/components/icons/Icon';
import { useAuthStore } from '@/stores/authStore';

// ─── Nav data ─────────────────────────────────────────────────────────────────

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  /** Route to open when "+" is clicked — opens add/create form */
  addHref?: string;
  icon?: IconProps['name'];
  children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'Home' },
  {
    id: 'master', label: 'Master', icon: 'Database',
    children: [
      { id: 'accounts-master',  label: 'Accounts Master',  href: '/master/accounts',  addHref: '/master/accounts/add' },
      { id: 'inventory-master', label: 'Inventory Master', href: '/master/inventory', addHref: '/master/inventory/add' },
      { id: 'rate-master',      label: 'Rate Master',      href: '/master/rates',     addHref: '/master/rates/add' },
      { id: 'discount-master',  label: 'Discount Master',  href: '/master/discounts', addHref: '/master/discounts/add' },
      {
        id: 'other-master', label: 'Other Master',
        children: [
          { id: 'station', label: 'Station', href: '/master/other/station', addHref: '/master/other/station/add' },
        ],
      },
      { id: 'opening-balance',   label: 'Opening Balance',   href: '/master/opening-balance',   addHref: '/master/opening-balance/add' },
      { id: 'sales-promotions',  label: 'Sales Promotions',  href: '/master/sales-promotions',  addHref: '/master/sales-promotions/add' },
      { id: 'currency',          label: 'Currency',          href: '/master/currency',           addHref: '/master/currency/add' },
    ],
  },
  { id: 'sale',       label: 'Sale',               href: '/sale',        icon: 'ShoppingCart', addHref: '/sale/add' },
  { id: 'purchase',   label: 'Purchase',           href: '/purchase',    icon: 'ShoppingBag',  addHref: '/purchase/add' },
  { id: 'accounting', label: 'Accounting Trans.',  href: '/accounting',  icon: 'FileText',     addHref: '/accounting/add' },
  { id: 'stock',      label: 'Stock Management',   href: '/stock',       icon: 'Package',      addHref: '/stock/add' },
  { id: 'banking',    label: 'Banking',            href: '/banking',     icon: 'Building2',    addHref: '/banking/add' },
  { id: 'report',     label: 'Report',             href: '/report',      icon: 'TrendingUp' },
  { id: 'crm',        label: 'CRM',                href: '/crm',         icon: 'Users',        addHref: '/crm/add' },
  { id: 'other-products', label: 'Other Products', href: '/other-products', icon: 'LayoutGrid' },
  { id: 'utilities',  label: 'Utilities & Tools',  href: '/utilities',   icon: 'Wrench' },
  { id: 'online-store', label: 'Online Store',     href: '/online-store', icon: 'Store',       addHref: '/online-store/add' },
];

const STORAGE_KEY = 'tos-sidebar-open';

// ─── SidebarNavItem ───────────────────────────────────────────────────────────

interface SidebarNavItemProps {
  item: NavItem;
  collapsed: boolean;
  pathname: string;
  expanded: Set<string>;
  onToggleExpand: (id: string) => void;
  depth?: number;
  query: string;
}

function matchesSearch(item: NavItem, q: string): boolean {
  if (!q) return true;
  const lower = q.toLowerCase();
  if (item.label.toLowerCase().includes(lower)) return true;
  return item.children?.some((c) => matchesSearch(c, q)) ?? false;
}

function SidebarNavItem({
  item,
  collapsed,
  pathname,
  expanded,
  onToggleExpand,
  depth = 0,
  query,
}: SidebarNavItemProps) {
  const router = useRouter();
  const hasChildren = Boolean(item.children?.length);
  const isExpanded  = expanded.has(item.id);
  const isActive    = item.href
    ? pathname === item.href || pathname.startsWith(item.href + '/')
    : false;
  const isParentActive = hasChildren && item.children?.some(
    (c) => c.href && (pathname === c.href || pathname.startsWith(c.href + '/'))
  );

  // Filter by search query
  if (query && !matchesSearch(item, query)) return null;

  const [hovered, setHovered] = useState(false);

  const handleAdd = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (item.addHref) router.push(item.addHref);
    },
    [item.addHref, router],
  );

  // Indentation: first level uses left padding, deeper uses tree-line classes
  const isSubItem   = depth > 0;
  const isDeepItem  = depth > 1;

  const itemClass = [
    'tos-sidebar__item',
    isSubItem  ? 'tos-sidebar__item--sub' : '',
    isDeepItem ? 'tos-sidebar__item--deep' : '',
  ].filter(Boolean).join(' ');

  const linkClass = [
    hasChildren ? 'tos-sidebar__btn' : 'tos-sidebar__link',
    isActive || isParentActive ? 'tos-sidebar__btn--active' : '',
    isSubItem ? 'tos-sidebar__link--sub' : '',
  ].filter(Boolean).join(' ');

  return (
    <li className={itemClass} role="none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>

      {hasChildren ? (
        <button
          type="button"
          data-nav-item
          data-nav-id={item.id}
          className={linkClass}
          onClick={() => onToggleExpand(item.id)}
          aria-expanded={isExpanded}
          aria-label={collapsed ? item.label : undefined}
        >
          {item.icon && !isSubItem && (
            <Icon name={item.icon} size={20} className="tos-sidebar__icon" aria-hidden />
          )}
          {!collapsed && (
            <>
              <span className="tos-sidebar__label">{item.label}</span>
              <Icon
                name={isExpanded ? 'ChevronDown' : 'ChevronRight'}
                size={14}
                className="tos-sidebar__chevron"
                aria-hidden
              />
            </>
          )}
        </button>
      ) : (
        <Link
          href={item.href ?? '#'}
          data-nav-item
          data-nav-id={item.id}
          className={linkClass}
          aria-current={isActive ? 'page' : undefined}
          aria-label={collapsed ? item.label : undefined}
        >
          {item.icon && !isSubItem && (
            <Icon name={item.icon} size={20} className="tos-sidebar__icon" aria-hidden />
          )}
          {!collapsed && (
            <span className="tos-sidebar__label">{item.label}</span>
          )}
        </Link>
      )}

      {/* + Add button — visible on hover when item has addHref */}
      {!collapsed && item.addHref && hovered && !hasChildren && (
        <button
          type="button"
          className="tos-sidebar__add-btn"
          onClick={handleAdd}
          aria-label={`Add ${item.label}`}
          title={`Add ${item.label}`}
        >
          <Icon name="Plus" size={13} aria-hidden />
        </button>
      )}

      {/* Submenu */}
      {hasChildren && isExpanded && !collapsed && (
        <ul className="tos-sidebar__submenu" role="list" aria-label={`${item.label} submenu`}>
          {item.children?.map((child) => (
            <SidebarNavItem
              key={child.id}
              item={child}
              collapsed={false}
              pathname={pathname}
              expanded={expanded}
              onToggleExpand={onToggleExpand}
              depth={depth + 1}
              query={query}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

// ─── DefaultSidebar ───────────────────────────────────────────────────────────

export function DefaultSidebar() {
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useLayout();
  const pathname = usePathname() ?? '/';
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  // Hover-to-expand: temporarily open when collapsed and user hovers
  const [hoverOpen, setHoverOpen] = useState(false);
  const isOpen = sidebarOpen || hoverOpen;

  const userInitials = user
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'SA';
  const userName = user?.name ?? 'System Admin';
  const userRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1).replace(/_/g, ' ')
    : 'Super Admin';

  const handleLogout = useCallback(() => {
    router.push('/login');
  }, [router]);

  const [expanded, setExpanded] = useState<Set<string>>(new Set<string>());
  const [query, setQuery]       = useState('');
  const navRef    = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Auto-expand active parent on mount / route change
  useEffect(() => {
    const parentIds = NAV_ITEMS.filter(
      (item) => item.children?.some(
        (child) => child.href && (pathname === child.href || pathname.startsWith(child.href + '/'))
      )
    ).map((item) => item.id);

    if (parentIds.length > 0) {
      setExpanded((prev) => {
        const next = new Set(prev);
        for (const id of parentIds) next.add(id);
        return next;
      });
    }
  }, [pathname]);

  // Restore sidebar state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) setSidebarOpen(saved === 'true');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(sidebarOpen));
  }, [sidebarOpen]);

  // Ctrl+B toggle
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

  // Auto-expand items matching search
  useEffect(() => {
    if (!query) return;
    const toExpand = NAV_ITEMS.filter((item) =>
      item.children?.some((c) => matchesSearch(c, query))
    ).map((item) => item.id);

    if (toExpand.length > 0) {
      setExpanded((prev) => {
        const next = new Set(prev);
        for (const id of toExpand) next.add(id);
        return next;
      });
    }
  }, [query]);

  const handleToggleExpand = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // Arrow-key navigation
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLElement>) => {
    const focusable = Array.from(
      navRef.current?.querySelectorAll<HTMLElement>('[data-nav-item]') ?? []
    );
    const idx = focusable.findIndex((el) => el === document.activeElement);

    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); focusable[(idx + 1) % focusable.length]?.focus(); break;
      case 'ArrowUp':   e.preventDefault(); focusable[(idx - 1 + focusable.length) % focusable.length]?.focus(); break;
      case 'Home':      e.preventDefault(); focusable[0]?.focus(); break;
      case 'End':       e.preventDefault(); focusable[focusable.length - 1]?.focus(); break;
    }
  }, []);

  return (
    <aside
      id="default-sidebar"
      className="tos-default-sidebar"
      data-collapsed={!sidebarOpen}
      data-hover-open={!sidebarOpen && hoverOpen}
      aria-label="Main navigation"
      onMouseEnter={() => { if (!sidebarOpen) setHoverOpen(true); }}
      onMouseLeave={() => setHoverOpen(false)}
    >
      {/* ── Search ─────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="tos-sidebar__search-wrap">
          <Icon name="Search" size={14} className="tos-sidebar__search-icon" aria-hidden />
          <input
            ref={searchRef}
            type="search"
            className="tos-sidebar__search"
            placeholder="Type to search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search navigation"
          />
        </div>
      )}

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav ref={navRef} aria-label="Main navigation" onKeyDown={handleKeyDown} style={{ flex: '1 1 auto', overflow: 'hidden auto' }}>
        <ul className="tos-sidebar__nav" role="list">
          {NAV_ITEMS.map((item) => (
            <SidebarNavItem
              key={item.id}
              item={item}
              collapsed={!isOpen}
              pathname={pathname}
              expanded={expanded}
              onToggleExpand={handleToggleExpand}
              query={query}
            />
          ))}
        </ul>
      </nav>

      {/* ── User profile ────────────────────────────────────────────────────── */}
      <div className="tos-sidebar__user" aria-label="Signed-in user">
        <span className="tos-sidebar__user-avatar" aria-hidden>{userInitials}</span>
        {isOpen && (
          <>
            <div className="tos-sidebar__user-info">
              <span className="tos-sidebar__user-name">{userName}</span>
              <span className="tos-sidebar__user-role">{userRole}</span>
            </div>
            <button
              type="button"
              className="tos-sidebar__user-logout"
              onClick={handleLogout}
              aria-label="Sign out"
              title="Sign out"
            >
              <Icon name="LogOut" size={15} aria-hidden />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
