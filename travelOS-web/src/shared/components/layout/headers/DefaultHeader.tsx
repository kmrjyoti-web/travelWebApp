'use client';
import React from 'react';
import Link from 'next/link';
import { useUIStore } from '@/shared/stores/ui.store';
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
}: {
  iconName: Parameters<typeof Icon>[0]['name'];
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className="tos-header__icon-btn"
      title={label}
      onClick={onClick}
      aria-label={label}
      style={{ width: 'auto', minWidth: 36, flexDirection: 'column', height: 'auto', padding: '4px 6px', gap: 2 }}
    >
      <Icon name={iconName} size={16} />
      <span style={{ fontSize: 9, lineHeight: 1, whiteSpace: 'nowrap', opacity: 0.75 }}>{label}</span>
    </button>
  );
}

export function DefaultHeader() {
  const { toggleSidebar, toggleSettings, toggleShortcutsModal } = useUIStore();

  return (
    <header className="tos-header">
      {/* Logo */}
      <Link href="/dashboard" className="tos-header__logo" style={{ fontSize: 17 }}>
        <Icon name="Plane" size={20} />
        <span>Travel <span style={{ color: '#f97316' }}>OS</span></span>
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

      {/* View Login UI button */}
      <Link
        href="/login"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '5px 12px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          borderRadius: 20,
          color: '#fff',
          fontSize: 12,
          fontWeight: 600,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
        }}
      >
        <span style={{ fontSize: 13 }}>✦</span>
        View Login UI
      </Link>

      <div className="tos-header__divider" />

      {/* Company / Tenant Selector */}
      <Dropdown>
        <DropdownToggle
          caret={false}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.85)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 8px',
            borderRadius: 'var(--tos-border-radius)',
            cursor: 'pointer',
          }}
        >
          <Avatar size="sm" color="primary" textColor="white" style={{ width: 28, height: 28, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
            A
          </Avatar>
          <div style={{ textAlign: 'left', lineHeight: 1.3 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>DEMO Aliya... (ALIYA)</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Books From 01-04-2025 to 31-03-2026</div>
          </div>
          <Icon name="ChevronDown" size={12} style={{ opacity: 0.6 }} />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownHeader>Switch Company</DropdownHeader>
          <DropdownItem>DEMO Aliya (ALIYA)</DropdownItem>
          <DropdownItem>TravelCo Global</DropdownItem>
          <DropdownDivider />
          <DropdownItem>
            <Icon name="Plus" size={14} style={{ marginRight: 6 }} />
            Add Company
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <div className="tos-header__spacer" />

      {/* WiFi / Speed */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.75)', fontSize: 12, whiteSpace: 'nowrap' }}>
        <Icon name="Wifi" size={14} style={{ color: '#34d399' }} />
        <span>10 Mb/s</span>
      </div>

      {/* Version badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap' }}>
        <span>V. 1.3.212.b</span>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', display: 'inline-block', flexShrink: 0 }} />
      </div>

      <div className="tos-header__divider" />

      {/* Smart Toolbar with labels */}
      <div className="tos-header__toolbar" style={{ gap: 2 }}>
        <ToolbarBtn iconName="Download" label="Pur. Import" />
        <ToolbarBtn iconName="Ticket" label="Ticket" />
        <ToolbarBtn iconName="CircleHelp" label="Help" />
        <ToolbarBtn iconName="Settings2" label="Settings" onClick={toggleSettings} />
        <ToolbarBtn iconName="Bell" label="Notification" />
        <ToolbarBtn iconName="Keyboard" label="Shortcut" onClick={toggleShortcutsModal} />
        <ToolbarBtn iconName="History" label="History" />

        <div className="tos-header__divider" />

        {/* User Dropdown */}
        <Dropdown placement="bottom-end">
          <DropdownToggle caret={false} style={{ background: 'transparent', border: 'none', padding: 0 }}>
            <button
              type="button"
              className="tos-header__icon-btn"
              aria-label="User menu"
            >
              <Icon name="User" size={18} />
            </button>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownHeader>
              <div>
                <div style={{ fontWeight: 600 }}>Kumar Jyoti</div>
                <div style={{ fontSize: 12, color: 'var(--tos-text-muted)' }}>admin@travelos.ai</div>
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
            <DropdownItem style={{ color: 'var(--tos-danger)' }}>
              <Icon name="LogOut" size={14} style={{ marginRight: 6 }} />
              Sign Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
}
