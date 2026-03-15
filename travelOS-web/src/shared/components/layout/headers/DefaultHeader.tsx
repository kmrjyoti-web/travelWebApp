'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/shared/stores/ui.store';
import { useAuthStore } from '@/shared/stores/auth.store';
import { Icon } from '@/shared/components/Icon';
import { Avatar } from '@/shared/components/Avatar';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  DropdownDivider,
  DropdownHeader,
} from '@/shared/components/Dropdown';

function ToolbarBtn({
  iconName,
  label,
  onClick,
  badge,
}: {
  iconName: Parameters<typeof Icon>[0]['name'];
  label: string;
  onClick?: () => void;
  badge?: number;
}) {
  return (
    <button
      type="button"
      className="tos-header__toolbar-btn"
      title={label}
      onClick={onClick}
      aria-label={label}
    >
      <span className="tos-header__toolbar-btn-icon">
        <Icon name={iconName} size={18} />
        {badge !== undefined && (
          <span className="tos-header__toolbar-badge">{badge}</span>
        )}
      </span>
      <span className="tos-header__toolbar-btn-label">{label}</span>
    </button>
  );
}

export function DefaultHeader() {
  const { toggleSidebar, toggleSettings, toggleShortcutsModal } = useUIStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="tos-header">
      {/* Logo */}
      <Link href="/dashboard" className="tos-header__logo">
        <Icon name="Plane" size={20} />
        <span>Travel<span className="tos-header__logo-accent">OS</span></span>
      </Link>

      {/* Hamburger */}
      <button
        type="button"
        className="tos-header__icon-btn"
        title="Toggle Sidebar"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <Icon name="Menu" size={18} />
      </button>

      {/* Company / Tenant Selector */}
      <Dropdown>
        <DropdownToggle caret={false} className="tos-header__company-toggle">
          <Avatar
            size="sm"
            color="primary"
            textColor="white"
            className="tos-header__company-avatar"
          >
            {(user?.name ?? 'D')[0].toUpperCase()}
          </Avatar>
          <div className="tos-header__company-info">
            <div className="tos-header__company-name">Default Organization</div>
            <div className="tos-header__company-period">Books From 01-04-2025 to 31-03-2026</div>
          </div>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownHeader>Switch Company</DropdownHeader>
          <DropdownItem>Default Organization</DropdownItem>
          <DropdownItem>TravelCo Global</DropdownItem>
          <DropdownDivider />
          <DropdownItem>
            <Icon name="Plus" size={14} style={{ marginRight: 6 }} />
            Add Company
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {/* WiFi / Speed */}
      <div className="tos-header__status-group">
        <Icon name="Wifi" size={14} className="tos-header__wifi-icon" />
        <span className="tos-header__speed-text">10 Mb/s</span>
      </div>

      {/* Version badge */}
      <div className="tos-header__version">
        <span>V 1.0</span>
        <span className="tos-header__version-dot" />
      </div>

      <div className="tos-header__spacer" />

      {/* Smart Toolbar */}
      <div className="tos-header__toolbar">
        <ToolbarBtn iconName="Wallet" label="Wallet" badge={0} />
        <ToolbarBtn iconName="Download" label="Import" />
        <ToolbarBtn iconName="Ticket" label="Ticket" />
        <ToolbarBtn iconName="CircleHelp" label="Help" />
        <ToolbarBtn iconName="Settings2" label="Settings" onClick={toggleSettings} />
        <ToolbarBtn iconName="Keyboard" label="Shortcut" onClick={toggleShortcutsModal} />
        <ToolbarBtn iconName="History" label="History" />
        <ToolbarBtn iconName="Bell" label="Notification" />

        <div className="tos-header__divider" />

        {/* Profile Dropdown */}
        <Dropdown placement="bottom-end">
          <DropdownToggle caret={false} className="tos-header__profile-toggle">
            <div className="tos-header__profile-circle">
              <Icon name="User" size={20} />
            </div>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownHeader>
              <div>
                <div style={{ fontWeight: 600 }}>{user?.name ?? 'System Admin'}</div>
                <div style={{ fontSize: 12, color: 'var(--tos-text-muted)' }}>
                  {user?.email ?? 'admin@travelos.com'}
                </div>
              </div>
            </DropdownHeader>
            <DropdownDivider />
            <DropdownItem>
              <Icon name="User" size={14} style={{ marginRight: 6 }} />
              Profile
            </DropdownItem>
            <DropdownItem>
              <Icon name="Settings" size={14} style={{ marginRight: 6 }} />
              Account Settings
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem style={{ color: 'var(--tos-danger)' }} onClick={handleLogout}>
              <Icon name="LogOut" size={14} style={{ marginRight: 6 }} />
              Sign Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
}
