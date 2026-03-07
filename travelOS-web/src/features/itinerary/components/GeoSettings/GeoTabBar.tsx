'use client';
/**
 * GeoTabBar — tab navigation bar for GeoSettingsDrawer.
 * Renders 5 ARIA-compliant tab buttons.
 */
import React from 'react';

export type TabKey = 'schema' | 'ai' | 'seo' | 'geo' | 'social';

interface Tab {
  key: TabKey;
  label: string;
}

const TABS: Tab[] = [
  { key: 'schema', label: 'Schema' },
  { key: 'ai', label: 'AI Search' },
  { key: 'seo', label: 'SEO' },
  { key: 'geo', label: 'Geo-Target' },
  { key: 'social', label: 'Social' },
];

interface GeoTabBarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export function GeoTabBar({ activeTab, onTabChange }: GeoTabBarProps) {
  return (
    <div
      role="tablist"
      aria-label="GEO settings sections"
      style={{
        display: 'flex',
        borderBottom: '2px solid var(--cui-border-color)',
        padding: '0 16px',
        overflowX: 'auto',
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            aria-controls={`geo-tab-panel-${tab.key}`}
            id={`geo-tab-${tab.key}`}
            onClick={() => onTabChange(tab.key)}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderBottom: isActive
                ? '2px solid var(--tos-primary, #1B4F72)'
                : '2px solid transparent',
              marginBottom: -2,
              background: 'none',
              cursor: 'pointer',
              fontWeight: isActive ? 700 : 400,
              fontSize: '0.875rem',
              color: isActive
                ? 'var(--tos-primary, #1B4F72)'
                : 'var(--cui-secondary-color)',
              whiteSpace: 'nowrap',
              transition: 'color 0.2s, border-color 0.2s',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
