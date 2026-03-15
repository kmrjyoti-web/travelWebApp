'use client';
import React, { lazy, Suspense } from 'react';
import { useDevToolsStore } from '../stores/devtools.store';
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
  { key: 'stores', label: 'Stores', icon: '\u{1F4E6}' },
  { key: 'api-health', label: 'API Health', icon: '\u{1F49A}' },
  { key: 'error-log', label: 'Errors', icon: '\u{1F534}' },
  { key: 'network', label: 'Network', icon: '\u{1F310}' },
  { key: 'query-cache', label: 'Query Cache', icon: '\u{1F4CB}' },
  { key: 'permissions', label: 'Permissions', icon: '\u{1F511}' },
  { key: 'system', label: 'System', icon: '\u2699\uFE0F' },
  { key: 'ui-kit', label: 'UI Kit', icon: '\u{1F3A8}' },
  { key: 'flags', label: 'Flags', icon: '\u{1F6A9}' },
  { key: 'feature-docs', label: 'Docs', icon: '\u{1F4D6}' },
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
 * DevToolsPanel is the main developer tools overlay panel.
 * Opens at the bottom of the viewport. Toggle with Ctrl+Shift+D.
 */
export function DevToolsPanel(): React.ReactElement | null {
  const { isOpen, activeTab, setTab, close, isPinned, togglePin, errors } =
    useDevToolsStore();

  if (!isOpen) return null;

  return (
    <div
      className="tos-devtools"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: isPinned ? '50vh' : '40vh',
        minHeight: 300,
        background: 'var(--tos-bg, #ffffff)',
        borderTop: '2px solid var(--tos-primary, #1B4F72)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'monospace',
        fontSize: 13,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 12px',
          background: 'var(--tos-primary, #1B4F72)',
          color: '#fff',
          fontSize: 12,
          fontWeight: 600,
          userSelect: 'none',
        }}
      >
        <span>TravelOS DevTools</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {errors.length > 0 && (
            <span
              style={{
                background: '#dc2626',
                borderRadius: 8,
                padding: '1px 6px',
                fontSize: 10,
              }}
            >
              {errors.length} errors
            </span>
          )}
          <button
            onClick={togglePin}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 12,
            }}
            title={isPinned ? 'Unpin' : 'Pin to half screen'}
          >
            {isPinned ? '\u{1F4CC}' : '\u{1F4CD}'}
          </button>
          <button
            onClick={close}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 14,
              lineHeight: 1,
            }}
            title="Close (Ctrl+Shift+D)"
          >
            \u2715
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          gap: 0,
          borderBottom: '1px solid var(--tos-border, #dee2e6)',
          background: 'var(--tos-bg-subtle, #f8f9fa)',
          overflowX: 'auto',
          flexShrink: 0,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTab(tab.key)}
            style={{
              padding: '6px 12px',
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
              fontSize: 12,
              fontWeight: activeTab === tab.key ? 600 : 400,
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
            {tab.key === 'error-log' && errors.length > 0 && (
              <span
                style={{
                  background: '#dc2626',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '0 5px',
                  fontSize: 10,
                  lineHeight: '16px',
                }}
              >
                {errors.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
        <TabContent tab={activeTab} />
      </div>
    </div>
  );
}
