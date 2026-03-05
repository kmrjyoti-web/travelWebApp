'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';
import Link from 'next/link';

import { useLayout } from '../LayoutProvider';
import { Icon } from '@/components/icons/Icon';
import { APP_NAME, APP_VERSION } from '@/config/constants';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { TOS_SEARCH_OPEN, TOS_HELP_OPEN, TOS_SETTINGS_OPEN } from '@/config/keyboard-shortcuts';
import { useAuthStore } from '@/stores/authStore';

// ─── Notification data ────────────────────────────────────────────────────────

interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'New booking', body: 'Booking #4521 confirmed', timestamp: '5m ago', read: false },
  { id: '2', title: 'Itinerary updated', body: 'Paris 2024 was modified', timestamp: '1h ago', read: false },
  { id: '3', title: 'System', body: 'Scheduled maintenance tonight', timestamp: '3h ago', read: false },
];

// ─── Smart Toolbar config ─────────────────────────────────────────────────────

interface ToolbarItem {
  id: string;
  label: string;
  icon: 'Download' | 'Ticket' | 'HelpCircle' | 'Settings' | 'Bell' | 'Command' | 'Clock';
  href?: string;
  onClick?: () => void;
  badge?: number;
}

// ─── Search Overlay ───────────────────────────────────────────────────────────

function SearchOverlay({ onClose, inputRef }: { onClose: () => void; inputRef: RefObject<HTMLInputElement> }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent): void => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="tos-search-overlay" role="dialog" aria-modal="true" aria-label="Global search">
      <div className="tos-search-overlay__backdrop" onClick={onClose} aria-hidden />
      <div className="tos-search-overlay__panel">
        <div className="tos-search-overlay__input-row">
          <Icon name="Search" size={18} className="tos-search-overlay__icon" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            className="tos-search-overlay__input"
            placeholder="Search itineraries, bookings, agents…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
            autoComplete="off"
          />
          <button type="button" className="tos-search-overlay__close" onClick={onClose} aria-label="Close search">
            <kbd aria-hidden>Esc</kbd>
          </button>
        </div>
        {query.length === 0 && (
          <p className="tos-search-overlay__hint">Start typing to search across all modules…</p>
        )}
        {query.length > 0 && (
          <p className="tos-search-overlay__hint" role="status" aria-live="polite">
            No results for &ldquo;{query}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Notification Panel ───────────────────────────────────────────────────────

function NotifPanel({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent): void => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div ref={panelRef} className="tos-header__dropdown tos-notif-panel" role="dialog"
      aria-label={`Notifications — ${unread} unread`} aria-modal="false">
      <div className="tos-notif-panel__header">
        <span className="tos-notif-panel__title">Notifications</span>
        {unread > 0 && <span className="tos-notif-panel__badge" aria-label={`${unread} unread`}>{unread}</span>}
      </div>
      <ul className="tos-notif-panel__list" role="list">
        {MOCK_NOTIFICATIONS.map((notif) => (
          <li key={notif.id} className={`tos-notif-panel__item${notif.read ? '' : ' tos-notif-panel__item--unread'}`}>
            <div className="tos-notif-panel__item-title">{notif.title}</div>
            <div className="tos-notif-panel__item-body">{notif.body}</div>
            <div className="tos-notif-panel__item-time" aria-label={`Received ${notif.timestamp}`}>{notif.timestamp}</div>
          </li>
        ))}
      </ul>
      <div className="tos-notif-panel__footer">
        <button type="button" className="tos-notif-panel__mark-all" onClick={onClose}>Mark all as read</button>
      </div>
    </div>
  );
}

// ─── User Dropdown ────────────────────────────────────────────────────────────

function UserDropdown({ onClose }: { onClose: () => void }) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent): void => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div ref={dropdownRef} className="tos-header__dropdown tos-user-dropdown" role="menu" aria-label="User menu">
      <div className="tos-user-dropdown__divider" role="separator" />
      <Link href="/settings/profile" className="tos-user-dropdown__item" role="menuitem" onClick={onClose}>
        <Icon name="User" size={16} aria-hidden /><span>Profile</span>
      </Link>
      <Link href="/settings" className="tos-user-dropdown__item" role="menuitem" onClick={onClose}>
        <Icon name="Settings" size={16} aria-hidden /><span>Settings</span>
      </Link>
      <div className="tos-user-dropdown__divider" role="separator" />
      <button type="button" className="tos-user-dropdown__item tos-user-dropdown__item--danger" role="menuitem"
        onClick={() => { onClose(); window.location.href = '/login'; }}>
        <Icon name="LogOut" size={16} aria-hidden /><span>Sign out</span>
      </button>
    </div>
  );
}

// ─── DefaultHeader ────────────────────────────────────────────────────────────

export function DefaultHeader() {
  const { toggleSidebar, sidebarOpen } = useLayout();
  const user = useAuthStore((s) => s.user);

  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen]   = useState(false);
  const [userOpen, setUserOpen]     = useState(false);
  const [helpOpen, setHelpOpen]     = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeNotif  = useCallback(() => setNotifOpen(false), []);
  const closeUser   = useCallback(() => setUserOpen(false), []);
  const closeHelp   = useCallback(() => setHelpOpen(false), []);

  useEffect(() => {
    if (searchOpen) requestAnimationFrame(() => searchInputRef.current?.focus());
  }, [searchOpen]);

  useEffect(() => {
    const onSearchOpen = () => { setSearchOpen(true); setNotifOpen(false); setUserOpen(false); setHelpOpen(false); };
    const onHelpOpen   = () => { setHelpOpen((p) => !p); setSearchOpen(false); setNotifOpen(false); setUserOpen(false); };
    document.addEventListener(TOS_SEARCH_OPEN, onSearchOpen);
    document.addEventListener(TOS_HELP_OPEN, onHelpOpen);
    return () => {
      document.removeEventListener(TOS_SEARCH_OPEN, onSearchOpen);
      document.removeEventListener(TOS_HELP_OPEN, onHelpOpen);
    };
  }, []);

  useKeyboardShortcut({ id: 'global:search', key: 'k', modifiers: ['ctrl'], description: 'Open search', scope: 'global', action: () => {} });
  useKeyboardShortcut({ id: 'global:help-slash', key: '/', modifiers: ['ctrl'], description: 'Open help', scope: 'global', action: () => {} });
  useKeyboardShortcut({ id: 'global:help-question', key: '?', modifiers: [], description: 'Open help', scope: 'global', action: () => {} });
  useKeyboardShortcut({
    id: 'global:close', key: 'Escape', modifiers: [], description: 'Close overlay', scope: 'global',
    action: () => { setSearchOpen(false); setNotifOpen(false); setUserOpen(false); setHelpOpen(false); },
  });

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  // Tenant display info
  const tenantName  = user ? `${user.name.toUpperCase()} (${user.tenantId.toUpperCase()})` : 'DEMO Aliya.. (ALIYA)';
  const tenantSub   = 'Books From 01-04-2025 to 31-03-2026';
  const userInitials = user ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) : 'A';

  // Toolbar items
  const toolbarItems: ToolbarItem[] = [
    { id: 'pur-import',   label: 'Pur. Import', icon: 'Download',   href: '/purchase/import' },
    { id: 'ticket',       label: 'Ticket',       icon: 'Ticket',     href: '/tickets' },
    { id: 'help',         label: 'Help',         icon: 'HelpCircle', onClick: () => { setHelpOpen((p) => !p); } },
    { id: 'settings', label: 'Settings', icon: 'Settings',
      onClick: () => document.dispatchEvent(new CustomEvent(TOS_SETTINGS_OPEN)) },
    {
      id: 'notification', label: 'Notification', icon: 'Bell',
      badge: unreadCount,
      onClick: () => { setNotifOpen((p) => !p); setUserOpen(false); },
    },
    { id: 'shortcut',  label: 'Shortcut', icon: 'Command', onClick: () => { setHelpOpen((p) => !p); } },
    { id: 'history',   label: 'History',  icon: 'Clock',   href: '/history' },
  ];

  return (
    <header className="tos-default-header" role="banner" aria-label="Application header">
      {/* Skip to main content */}
      <a href="#main-content" className="tos-skip-link">Skip to main content</a>

      {/* ── Brand ──────────────────────────────────────────────────────────── */}
      <Link href="/dashboard" className="tos-header__brand" aria-label={`${APP_NAME} — go to dashboard`}>
        <span className="tos-header__logo" aria-hidden>✈</span>
        <span className="tos-header__app-name">
          Travel <strong>OS</strong>
        </span>
      </Link>

      {/* ── Hamburger ──────────────────────────────────────────────────────── */}
      <button
        type="button"
        className="tos-header__toggle"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        aria-expanded={sidebarOpen}
        aria-controls="default-sidebar"
      >
        <Icon name="Menu" size={20} aria-hidden />
      </button>

      {/* ── Tenant / Company ───────────────────────────────────────────────── */}
      <div className="tos-header__tenant">
        <span className="tos-header__tenant-avatar" aria-hidden>{userInitials}</span>
        <div className="tos-header__tenant-info">
          <span className="tos-header__tenant-name">{tenantName}</span>
          <span className="tos-header__tenant-sub">{tenantSub}</span>
        </div>
      </div>

      {/* ── Status: WiFi + Version ─────────────────────────────────────────── */}
      <div className="tos-header__status">
        <div className="tos-header__wifi">
          <Icon name="Wifi" size={14} aria-hidden />
          <span>10 Mb/s</span>
        </div>
        <div className="tos-header__version">
          <span>V. {APP_VERSION}</span>
          <span className="tos-header__version-dot" aria-label="System online" />
        </div>
      </div>

      {/* ── Spacer ─────────────────────────────────────────────────────────── */}
      <div className="tos-header__spacer" aria-hidden />

      {/* ── Smart Toolbar ──────────────────────────────────────────────────── */}
      <div className="tos-header__toolbar" role="toolbar" aria-label="Quick actions">

        {/* Quick icon-only actions */}
        <button type="button" className="tos-header__toolbar-icon" aria-label="Refresh"
          onClick={() => { setSearchOpen(true); setNotifOpen(false); setUserOpen(false); }}>
          <Icon name="Search" size={15} aria-hidden />
        </button>
        <button type="button" className="tos-header__toolbar-icon" aria-label="Calendar">
          <Icon name="Calendar" size={15} aria-hidden />
        </button>
        <button type="button" className="tos-header__toolbar-icon" aria-label="Download">
          <Icon name="Download" size={15} aria-hidden />
        </button>

        {/* Labeled toolbar items */}
        {toolbarItems.map((item) => {
          const btn = (
            <button
              key={item.id}
              type="button"
              className="tos-header__toolbar-btn"
              aria-label={item.label}
              onClick={item.onClick}
            >
              <span className="tos-header__toolbar-btn-icon">
                <Icon name={item.icon} size={15} aria-hidden />
                {item.badge != null && item.badge > 0 && (
                  <span className="tos-header__badge" aria-label={`${item.badge} unread`}>{item.badge}</span>
                )}
              </span>
              <span className="tos-header__toolbar-btn-label">{item.label}</span>
            </button>
          );

          if (item.href) {
            return (
              <Link key={item.id} href={item.href} className="tos-header__toolbar-btn" aria-label={item.label}>
                <span className="tos-header__toolbar-btn-icon">
                  <Icon name={item.icon} size={15} aria-hidden />
                </span>
                <span className="tos-header__toolbar-btn-label">{item.label}</span>
              </Link>
            );
          }

          return btn;
        })}

        {/* Notification panel */}
        {notifOpen && (
          <div className="tos-header__popover-anchor" style={{ position: 'absolute', right: 100, top: 48 }}>
            <NotifPanel onClose={closeNotif} />
          </div>
        )}

        {/* Language */}
        <button type="button" className="tos-header__toolbar-icon" aria-label="Language / Region">
          <Icon name="Globe" size={16} aria-hidden />
        </button>

        {/* User */}
        <div className="tos-header__popover-anchor">
          <button
            type="button"
            className="tos-header__user-btn"
            onClick={() => { setUserOpen((p) => !p); setNotifOpen(false); }}
            aria-label={`User menu — ${user?.name ?? 'Account'}`}
            aria-expanded={userOpen}
            aria-haspopup="menu"
          >
            <span className="tos-header__avatar" aria-hidden>{userInitials}</span>
          </button>
          {userOpen && <UserDropdown onClose={closeUser} />}
        </div>
      </div>

      {/* Overlays */}
      {searchOpen && <SearchOverlay onClose={closeSearch} inputRef={searchInputRef} />}
      {helpOpen && (
        <div className="tos-search-overlay" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts help">
          <div className="tos-search-overlay__backdrop" onClick={closeHelp} aria-hidden />
          <div className="tos-search-overlay__panel tos-help-panel">
            <div className="tos-help-panel__header">
              <h2 className="tos-help-panel__title">Keyboard Shortcuts</h2>
              <button type="button" className="tos-help-panel__close" onClick={closeHelp} aria-label="Close help">
                <Icon name="X" size={18} aria-hidden />
              </button>
            </div>
            <dl className="tos-help-panel__list">
              {[
                { keys: '⌃K', desc: 'Open search' },
                { keys: '⌃B', desc: 'Toggle sidebar' },
                { keys: '⌃/', desc: 'Open this panel' },
                { keys: 'Esc', desc: 'Close overlay' },
              ].map(({ keys, desc }) => (
                <div key={keys} className="tos-help-panel__row">
                  <dt className="tos-help-panel__keys"><kbd>{keys}</kbd></dt>
                  <dd className="tos-help-panel__desc">{desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </header>
  );
}
