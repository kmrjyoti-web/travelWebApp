'use client';
import React, { useState, useEffect } from 'react';
import { useUIStore } from '@/shared/stores/ui.store';
import { useAuthStore } from '@/shared/stores/auth.store';

interface StoreEntry {
  name: string;
  getState: () => unknown;
}

const STORES: StoreEntry[] = [
  { name: 'useUIStore', getState: () => useUIStore.getState() },
  {
    name: 'useAuthStore',
    getState: () => {
      const state = useAuthStore.getState();
      return {
        ...state,
        accessToken: state.accessToken ? '[REDACTED]' : null,
        refreshToken: state.refreshToken ? '[REDACTED]' : null,
      };
    },
  },
];

/**
 * StoreInspectorTab displays a live, read-only view of all registered
 * Zustand stores. Sensitive fields (tokens) are redacted.
 */
export function StoreInspectorTab(): React.ReactElement {
  const [selectedStore, setSelectedStore] = useState(STORES[0]?.name ?? '');
  const [stateSnapshot, setStateSnapshot] = useState<unknown>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const store = STORES.find((s) => s.name === selectedStore);
    if (!store) return;

    const update = () => setStateSnapshot(store.getState());
    update();

    if (!autoRefresh) return;
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [selectedStore, autoRefresh]);

  const renderValue = (val: unknown, depth = 0): React.ReactNode => {
    if (val === null) {
      return <span style={{ color: 'var(--tos-text-muted, #888)' }}>null</span>;
    }
    if (val === undefined) {
      return <span style={{ color: 'var(--tos-text-muted, #888)' }}>undefined</span>;
    }
    if (typeof val === 'boolean') {
      return <span style={{ color: '#d97706' }}>{String(val)}</span>;
    }
    if (typeof val === 'number') {
      return <span style={{ color: '#2563eb' }}>{val}</span>;
    }
    if (typeof val === 'string') {
      return <span style={{ color: '#16a34a' }}>&quot;{val}&quot;</span>;
    }
    if (typeof val === 'function') {
      return <span style={{ color: 'var(--tos-text-muted, #888)' }}>f()</span>;
    }

    if (Array.isArray(val)) {
      if (val.length === 0) return <span>[]</span>;
      if (depth > 3) return <span>[...{val.length} items]</span>;
      return (
        <div style={{ paddingLeft: 16 }}>
          {'['}
          {val.map((item, i) => (
            <div key={i} style={{ paddingLeft: 8 }}>
              {renderValue(item, depth + 1)}
              {i < val.length - 1 ? ',' : ''}
            </div>
          ))}
          {']'}
        </div>
      );
    }

    if (typeof val === 'object') {
      const entries = Object.entries(val as Record<string, unknown>);
      if (entries.length === 0) return <span>{'{}'}</span>;
      if (depth > 3) return <span>{'{ ... }'}</span>;
      return (
        <div style={{ paddingLeft: 16 }}>
          {'{'}
          {entries.map(([key, v]) => (
            <div key={key} style={{ paddingLeft: 8 }}>
              <span style={{ color: 'var(--tos-text-secondary, #666)' }}>{key}</span>
              {': '}
              {renderValue(v, depth + 1)}
            </div>
          ))}
          {'}'}
        </div>
      );
    }

    return <span>{String(val)}</span>;
  };

  return (
    <div className="tos-devtools-tab tos-devtools-tab--stores">
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          style={{
            padding: '4px 8px',
            borderRadius: 4,
            border: '1px solid var(--tos-border, #dee2e6)',
            background: 'var(--tos-bg, #fff)',
            color: 'var(--tos-text, #212529)',
            fontSize: 13,
          }}
        >
          {STORES.map((s) => (
            <option key={s.name} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
        <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          Auto-refresh
        </label>
        <button
          onClick={() => {
            const store = STORES.find((s) => s.name === selectedStore);
            if (store) setStateSnapshot(store.getState());
          }}
          style={{
            padding: '2px 8px',
            borderRadius: 4,
            border: '1px solid var(--tos-border, #dee2e6)',
            background: 'var(--tos-bg, #fff)',
            color: 'var(--tos-text, #212529)',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Refresh
        </button>
      </div>
      <pre
        style={{
          fontSize: 12,
          fontFamily: 'monospace',
          background: 'var(--tos-bg-subtle, #f8f9fa)',
          padding: 12,
          borderRadius: 6,
          overflow: 'auto',
          maxHeight: 'calc(100vh - 260px)',
          border: '1px solid var(--tos-border, #dee2e6)',
          margin: 0,
        }}
      >
        {renderValue(stateSnapshot)}
      </pre>
    </div>
  );
}
