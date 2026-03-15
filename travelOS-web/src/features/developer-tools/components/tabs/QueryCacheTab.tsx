'use client';
import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface CacheEntry {
  queryKey: readonly unknown[];
  state: string;
  dataUpdatedAt: number;
  staleTime: number;
  isStale: boolean;
  fetchStatus: string;
  dataPreview: string;
}

export function QueryCacheTab() {
  const queryClient = useQueryClient();
  const [entries, setEntries] = useState<CacheEntry[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const refresh = () => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    const mapped: CacheEntry[] = queries.map((q) => {
      const state = q.state;
      let preview = '\u2014';
      try {
        const d = state.data;
        if (d !== undefined) {
          const s = JSON.stringify(d);
          preview = s.length > 120 ? s.slice(0, 120) + '...' : s;
        }
      } catch {
        preview = '[Circular]';
      }
      return {
        queryKey: q.queryKey,
        state: state.status,
        dataUpdatedAt: state.dataUpdatedAt,
        staleTime: (q.options as Record<string, unknown>).staleTime as number ?? 0,
        isStale: q.isStale(),
        fetchStatus: state.fetchStatus,
        dataPreview: preview,
      };
    });
    setEntries(mapped);
  };

  useEffect(() => {
    refresh();
    if (!autoRefresh) return;
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <div className="tos-devtools-tab tos-devtools-tab--query-cache">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontWeight: 600 }}>{entries.length} cached quer{entries.length !== 1 ? 'ies' : 'y'}</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
            Auto (2s)
          </label>
          <button
            onClick={refresh}
            style={{
              padding: '2px 8px', borderRadius: 4, border: '1px solid var(--tos-border, #dee2e6)',
              background: 'var(--tos-bg, #fff)', color: 'var(--tos-text, #212529)', fontSize: 12, cursor: 'pointer',
            }}
          >
            Refresh
          </button>
          <button
            onClick={() => { queryClient.invalidateQueries(); refresh(); }}
            style={{
              padding: '2px 8px', borderRadius: 4, border: '1px solid #d97706',
              background: '#fef9c3', color: '#d97706', fontSize: 12, cursor: 'pointer',
            }}
          >
            Invalidate All
          </button>
        </div>
      </div>

      {entries.length === 0 && (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--tos-text-muted, #888)' }}>
          No queries in cache.
        </div>
      )}

      {entries.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--tos-border, #dee2e6)' }}>
              <th style={{ textAlign: 'left', padding: '6px 8px' }}>Query Key</th>
              <th style={{ textAlign: 'center', padding: '6px 8px' }}>Status</th>
              <th style={{ textAlign: 'center', padding: '6px 8px' }}>Stale</th>
              <th style={{ textAlign: 'right', padding: '6px 8px' }}>Updated</th>
              <th style={{ textAlign: 'left', padding: '6px 8px' }}>Data Preview</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--tos-border-light, #f0f0f0)' }}>
                <td style={{ padding: '4px 8px', fontFamily: 'monospace', fontSize: 11, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {JSON.stringify(entry.queryKey)}
                </td>
                <td style={{ padding: '4px 8px', textAlign: 'center' }}>
                  <span style={{
                    padding: '1px 6px', borderRadius: 4, fontSize: 11,
                    background: entry.state === 'success' ? '#dcfce7' : entry.state === 'error' ? '#fee2e2' : '#e0f2fe',
                    color: entry.state === 'success' ? '#16a34a' : entry.state === 'error' ? '#dc2626' : '#0369a1',
                  }}>
                    {entry.state}
                  </span>
                </td>
                <td style={{ padding: '4px 8px', textAlign: 'center' }}>
                  {entry.isStale ? '\uD83D\uDD34' : '\uD83D\uDFE2'}
                </td>
                <td style={{ padding: '4px 8px', textAlign: 'right', color: 'var(--tos-text-muted, #888)', fontSize: 11 }}>
                  {entry.dataUpdatedAt ? new Date(entry.dataUpdatedAt).toLocaleTimeString() : '\u2014'}
                </td>
                <td style={{ padding: '4px 8px', fontSize: 11, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--tos-text-muted, #888)' }}>
                  {entry.dataPreview}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
