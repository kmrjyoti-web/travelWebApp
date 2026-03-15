'use client';

import React, { lazy, Suspense, useState } from 'react';
import type { DevToolsTab } from '../stores/devtools.store';
import { StoreInspectorTab } from './tabs/StoreInspectorTab';

const ApiHealthTab = lazy(() =>
  import('./tabs/ApiHealthTab').then((m) => ({ default: m.ApiHealthTab }))
);
const ErrorLogTab = lazy(() =>
  import('./tabs/ErrorLogTab').then((m) => ({ default: m.ErrorLogTab }))
);
const UiKitTab = lazy(() =>
  import('./tabs/UiKitTab').then((m) => ({ default: m.UiKitTab }))
);
const PermissionsTab = lazy(() =>
  import('./tabs/PermissionsTab').then((m) => ({ default: m.PermissionsTab }))
);
const NetworkTab = lazy(() =>
  import('./tabs/NetworkTab').then((m) => ({ default: m.NetworkTab }))
);
const SystemTab = lazy(() =>
  import('./tabs/SystemTab').then((m) => ({ default: m.SystemTab }))
);
const FlagsTab = lazy(() =>
  import('./tabs/FlagsTab').then((m) => ({ default: m.FlagsTab }))
);
const QueryCacheTab = lazy(() =>
  import('./tabs/QueryCacheTab').then((m) => ({ default: m.QueryCacheTab }))
);
const FeatureDocsTab = lazy(() =>
  import('./tabs/FeatureDocsTab').then((m) => ({ default: m.FeatureDocsTab }))
);

const TABS: { key: DevToolsTab; label: string; icon: string }[] = [
  { key: 'api-health', label: 'API Health', icon: '\u{1F49A}' },
  { key: 'error-log', label: 'Error Log', icon: '\u{1F534}' },
  { key: 'ui-kit', label: 'UI Kit', icon: '\u{1F3A8}' },
  { key: 'stores', label: 'Stores', icon: '\u{1F4E6}' },
  { key: 'permissions', label: 'Permissions', icon: '\u{1F511}' },
  { key: 'network', label: 'Network', icon: '\u{1F310}' },
  { key: 'system', label: 'System', icon: '\u2699\uFE0F' },
  { key: 'flags', label: 'Flags', icon: '\u{1F6A9}' },
  { key: 'query-cache', label: 'Query Cache', icon: '\u{1F4CB}' },
  { key: 'feature-docs', label: 'Feature Docs', icon: '\u{1F4D6}' },
];

function TabContent({ tab }: { tab: DevToolsTab }): React.ReactElement {
  const fallback = (
    <div style={{ padding: 16, color: 'var(--tos-text-muted, #888)' }}>Loading...</div>
  );

  switch (tab) {
    case 'stores':
      return <StoreInspectorTab />;
    case 'api-health':
      return <Suspense fallback={fallback}><ApiHealthTab /></Suspense>;
    case 'error-log':
      return <Suspense fallback={fallback}><ErrorLogTab /></Suspense>;
    case 'network':
      return <Suspense fallback={fallback}><NetworkTab /></Suspense>;
    case 'query-cache':
      return <Suspense fallback={fallback}><QueryCacheTab /></Suspense>;
    case 'permissions':
      return <Suspense fallback={fallback}><PermissionsTab /></Suspense>;
    case 'system':
      return <Suspense fallback={fallback}><SystemTab /></Suspense>;
    case 'ui-kit':
      return <Suspense fallback={fallback}><UiKitTab /></Suspense>;
    case 'flags':
      return <Suspense fallback={fallback}><FlagsTab /></Suspense>;
    case 'feature-docs':
      return <Suspense fallback={fallback}><FeatureDocsTab /></Suspense>;
    default:
      return <div>Unknown tab</div>;
  }
}

/**
 * Full-page Developer Tools view — accessible via /developer-tools route.
 * Same 10 tabs as the overlay panel but rendered as a full page.
 */
export function DevToolsPage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<DevToolsTab>('api-health');

  const envLabel = process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'DEVELOPMENT';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <div>
          <h1 style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--tos-text-primary, #1a1a1a)',
            margin: 0,
          }}>
            Developer Tools
          </h1>
          <p style={{
            fontSize: 13,
            color: 'var(--tos-text-muted, #888)',
            margin: '4px 0 0',
          }}>
            Debug, inspect, and test the CRM frontend
          </p>
        </div>
        <span style={{
          padding: '4px 12px',
          borderRadius: 4,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1,
          background: process.env.NODE_ENV === 'production' ? '#f97316' : '#22c55e',
          color: '#fff',
        }}>
          {envLabel}
        </span>
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex',
        gap: 0,
        borderBottom: '1px solid var(--tos-border, #dee2e6)',
        background: 'var(--tos-bg-subtle, #f8f9fa)',
        borderRadius: '8px 8px 0 0',
        overflowX: 'auto',
        flexShrink: 0,
      }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderBottom:
                activeTab === tab.key
                  ? '2px solid var(--tos-primary, #1B4F72)'
                  : '2px solid transparent',
              background:
                activeTab === tab.key ? 'var(--tos-bg, #fff)' : 'transparent',
              color:
                activeTab === tab.key
                  ? 'var(--tos-primary, #1B4F72)'
                  : 'var(--tos-text-muted, #888)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: activeTab === tab.key ? 600 : 400,
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s',
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab description */}
      <div style={{
        padding: '8px 16px',
        fontSize: 12,
        color: 'var(--tos-text-muted, #888)',
        borderBottom: '1px solid var(--tos-border, #dee2e6)',
        background: 'var(--tos-bg, #fff)',
      }}>
        {getTabDescription(activeTab)}
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: 16,
        background: 'var(--tos-bg, #fff)',
        borderRadius: '0 0 8px 8px',
        border: '1px solid var(--tos-border, #dee2e6)',
        borderTop: 'none',
      }}>
        <TabContent tab={activeTab} />
      </div>
    </div>
  );
}

function getTabDescription(tab: DevToolsTab): string {
  switch (tab) {
    case 'api-health': return 'Ping all API endpoints, check backend status';
    case 'error-log': return 'Runtime errors captured via window.onerror and unhandledrejection';
    case 'ui-kit': return 'Browse all 78 shared UI components with categories and status';
    case 'stores': return 'Live Zustand store state inspector';
    case 'permissions': return 'Current user roles and permissions from auth store';
    case 'network': return 'Axios request/response log with timing';
    case 'system': return 'Browser info, viewport size, environment variables';
    case 'flags': return 'Feature flags and toggles';
    case 'query-cache': return 'React Query cache entries and state';
    case 'feature-docs': return 'Documentation links and feature module registry';
    default: return '';
  }
}
