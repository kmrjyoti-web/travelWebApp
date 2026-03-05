'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useLayout } from '../LayoutProvider';
import { Icon } from '@/components/icons/Icon';
import { APP_NAME } from '@/config/constants';

import type { SystemStatusItem, SystemStatusLevel } from './theme';
import { statusColorVar, STATUS_LABELS } from './theme';
import {
  ADMIN_KEYBOARD_SHORTCUTS,
  formatAdminShortcut,
} from './keyboard-shortcuts';

// ─── Mock system status data ──────────────────────────────────────────────────
// Replace with a real API hook (useAdminSystemStatus) in production.

const MOCK_SYSTEM_STATUS: SystemStatusItem[] = [
  { id: 'api',   label: 'API',   status: 'operational' },
  { id: 'db',    label: 'DB',    status: 'operational' },
  { id: 'cache', label: 'Cache', status: 'degraded'    },
  { id: 'jobs',  label: 'Jobs',  status: 'operational' },
];

// ─── Mock admin user ──────────────────────────────────────────────────────────

const MOCK_ADMIN = { name: 'Admin User', role: 'Super Admin', initials: 'AU' };

// ─── Admin toolbar links ───────────────────────────────────────────────────────

interface ToolbarLink {
  id: string;
  label: string;
  href: string;
  shortcut?: string;
}

const TOOLBAR_LINKS: ToolbarLink[] = [
  { id: 'dashboard', label: 'Dashboard',   href: '/dashboard' },
  { id: 'users',     label: 'Users',       href: '/users',        shortcut: '⌃U' },
  { id: 'tenants',   label: 'Tenants',     href: '/admin/tenants' },
  { id: 'logs',      label: 'Logs',        href: '/admin/logs',   shortcut: '⌃L' },
  { id: 'settings',  label: 'Settings',    href: '/settings',     shortcut: '⌃S' },
  { id: 'system',    label: 'System',      href: '/admin/system'  },
];

// ─── SystemStatusBadge ────────────────────────────────────────────────────────

interface StatusDotProps {
  status: SystemStatusLevel;
}

function StatusDot({ status }: StatusDotProps) {
  const varName = statusColorVar(status);
  return (
    <span
      className={`tos-admin-status__dot tos-admin-status__dot--${status}`}
      style={{ backgroundColor: `var(${varName})` }}
      aria-hidden
    />
  );
}

interface SystemStatusBadgeProps {
  items: SystemStatusItem[];
}

function SystemStatusBadge({ items: statusItems }: SystemStatusBadgeProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const hasIssue = statusItems.some((s) => s.status !== 'operational');
  const overallStatus: SystemStatusLevel = statusItems.some((s) => s.status === 'down')
    ? 'down'
    : statusItems.some((s) => s.status === 'degraded')
    ? 'degraded'
    : 'operational';

  const overallLabel = STATUS_LABELS[overallStatus];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div ref={ref} className="tos-admin-status">
      <button
        type="button"
        className={`tos-admin-status__trigger tos-admin-status__trigger--${overallStatus}`}
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`System status: ${overallLabel}${hasIssue ? ' — issues detected' : ''}`}
        data-testid="system-status-trigger"
      >
        <StatusDot status={overallStatus} />
        <span className="tos-admin-status__label">{overallLabel}</span>
        <Icon name="ChevronDown" size={12} aria-hidden />
      </button>

      {open && (
        <div
          className="tos-admin-status__panel"
          role="dialog"
          aria-label="System status details"
          data-testid="system-status-panel"
        >
          <p className="tos-admin-status__panel-title">System Status</p>
          <ul className="tos-admin-status__list" role="list">
            {statusItems.map((item) => (
              <li key={item.id} className="tos-admin-status__item">
                <StatusDot status={item.status} />
                <span className="tos-admin-status__item-name">{item.label}</span>
                <span
                  className={`tos-admin-status__item-state tos-admin-status__item-state--${item.status}`}
                  aria-label={`${item.label}: ${STATUS_LABELS[item.status]}`}
                >
                  {STATUS_LABELS[item.status]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── AdminUserDropdown ────────────────────────────────────────────────────────

interface AdminUserDropdownProps {
  onClose: () => void;
}

function AdminUserDropdown({ onClose }: AdminUserDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="tos-admin-user-dropdown"
      role="menu"
      aria-label="Admin user menu"
      data-testid="admin-user-dropdown"
    >
      <div className="tos-admin-user-dropdown__profile" role="presentation">
        <span className="tos-admin-user-dropdown__avatar" aria-hidden>
          {MOCK_ADMIN.initials}
        </span>
        <div>
          <div className="tos-admin-user-dropdown__name">{MOCK_ADMIN.name}</div>
          <div className="tos-admin-user-dropdown__role">{MOCK_ADMIN.role}</div>
        </div>
      </div>

      <div role="separator" className="tos-admin-user-dropdown__divider" />

      <Link href="/settings/profile" role="menuitem" className="tos-admin-user-dropdown__item" onClick={onClose}>
        <Icon name="User" size={14} aria-hidden />
        <span>Profile</span>
      </Link>
      <Link href="/settings" role="menuitem" className="tos-admin-user-dropdown__item" onClick={onClose}>
        <Icon name="Settings" size={14} aria-hidden />
        <span>Settings</span>
      </Link>

      <div role="separator" className="tos-admin-user-dropdown__divider" />

      <button
        type="button"
        role="menuitem"
        className="tos-admin-user-dropdown__item tos-admin-user-dropdown__item--danger"
        onClick={() => { onClose(); window.location.href = '/login'; }}
      >
        <Icon name="LogOut" size={14} aria-hidden />
        <span>Sign out</span>
      </button>
    </div>
  );
}

// ─── AdminToolbar ─────────────────────────────────────────────────────────────

interface AdminToolbarProps {
  pathname: string;
}

export function AdminToolbar({ pathname }: AdminToolbarProps) {
  return (
    <div
      className="tos-admin-toolbar"
      role="toolbar"
      aria-label="Admin quick navigation"
      data-testid="admin-toolbar"
    >
      <nav className="tos-admin-toolbar__nav" aria-label="Admin sections">
        <ul className="tos-admin-toolbar__list" role="list">
          {TOOLBAR_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <li key={link.id} className="tos-admin-toolbar__item">
                <Link
                  href={link.href}
                  className={[
                    'tos-admin-toolbar__link',
                    isActive ? 'tos-admin-toolbar__link--active' : '',
                  ].join(' ').trim()}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                  {link.shortcut && (
                    <kbd className="tos-admin-toolbar__kbd" aria-hidden>
                      {link.shortcut}
                    </kbd>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Right side: quick stats */}
      <div className="tos-admin-toolbar__meta" aria-label="Quick statistics">
        <span className="tos-admin-toolbar__stat" aria-label="42 active sessions">
          <Icon name="Activity" size={12} aria-hidden />
          <span>42 sessions</span>
        </span>
      </div>
    </div>
  );
}

// ─── AdminHeader ──────────────────────────────────────────────────────────────

export function AdminHeader() {
  const { toggleSidebar, sidebarOpen } = useLayout();
  const pathname = usePathname() ?? '/';
  const [userOpen, setUserOpen] = useState(false);
  const closeUser = useCallback(() => setUserOpen(false), []);

  return (
    <header
      className="tos-admin-header"
      role="banner"
      aria-label="Admin panel header"
      data-testid="admin-header"
    >
      {/* Skip link */}
      <a href="#admin-main" className="tos-skip-link">Skip to main content</a>

      {/* ── Top bar ── */}
      <div className="tos-admin-header__top">
        {/* Left: sidebar toggle + brand */}
        <div className="tos-admin-header__left">
          <button
            type="button"
            className="tos-admin-header__toggle"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Collapse admin sidebar' : 'Expand admin sidebar'}
            aria-expanded={sidebarOpen}
            aria-controls="admin-sidebar"
            aria-keyshortcuts="Control+b"
          >
            <Icon name="Menu" size={20} aria-hidden />
          </button>

          <Link
            href="/dashboard"
            className="tos-admin-header__brand"
            aria-label={`${APP_NAME} Admin — go to dashboard`}
          >
            <span className="tos-admin-header__logo" aria-hidden>⚙</span>
            <span className="tos-admin-header__app-name">{APP_NAME}</span>
            <span className="tos-admin-header__badge" aria-label="Admin panel">Admin</span>
          </Link>
        </div>

        {/* Right: system status + keyboard hint + user menu */}
        <div className="tos-admin-header__right">
          {/* Keyboard shortcuts hint */}
          <div
            className="tos-admin-header__shortcuts-hint"
            aria-label="Quick navigation shortcuts"
          >
            {ADMIN_KEYBOARD_SHORTCUTS.filter(
              (s) => ['admin:go-users', 'admin:go-settings', 'admin:go-logs'].includes(s.id),
            ).map((s) => (
              <span key={s.id} className="tos-admin-header__shortcut-chip">
                <kbd aria-label={s.description}>{formatAdminShortcut(s)}</kbd>
                <span className="tos-admin-header__shortcut-desc">{s.description.replace('Navigate to ', '')}</span>
              </span>
            ))}
          </div>

          {/* System status */}
          <SystemStatusBadge items={MOCK_SYSTEM_STATUS} />

          {/* Admin user */}
          <div className="tos-admin-header__user-anchor">
            <button
              type="button"
              className="tos-admin-header__user-btn"
              onClick={() => setUserOpen((p) => !p)}
              aria-label={`Admin menu — ${MOCK_ADMIN.name}`}
              aria-expanded={userOpen}
              aria-haspopup="menu"
              data-testid="admin-user-btn"
            >
              <span className="tos-admin-header__avatar" aria-hidden>
                {MOCK_ADMIN.initials}
              </span>
              <span className="tos-admin-header__user-name">{MOCK_ADMIN.name}</span>
              <Icon name="ChevronDown" size={14} aria-hidden />
            </button>
            {userOpen && <AdminUserDropdown onClose={closeUser} />}
          </div>
        </div>
      </div>

      {/* ── Admin toolbar (second row) ── */}
      <AdminToolbar pathname={pathname} />
    </header>
  );
}
