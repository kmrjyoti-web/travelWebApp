'use client';
import React from 'react';
import { useDevToolsStore } from '../../stores/devtools.store';

const STATUS_COLORS: Record<string, string> = {
  '2': '#16a34a',
  '3': '#2563eb',
  '4': '#d97706',
  '5': '#dc2626',
};

function getStatusColor(status?: number): string {
  if (!status) return '#888';
  return STATUS_COLORS[String(status)[0]] ?? '#888';
}

export function NetworkTab() {
  const networkLogs = useDevToolsStore((s) => s.networkLogs);
  const clearNetworkLogs = useDevToolsStore((s) => s.clearNetworkLogs);

  return (
    <div className="tos-devtools-tab tos-devtools-tab--network">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontWeight: 600 }}>
          {networkLogs.length} request{networkLogs.length !== 1 ? 's' : ''} logged
        </span>
        {networkLogs.length > 0 && (
          <button
            onClick={clearNetworkLogs}
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
            Clear
          </button>
        )}
      </div>

      {networkLogs.length === 0 && (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--tos-text-muted, #888)' }}>
          No network requests logged yet. Requests made via the API service will appear here.
          <br /><br />
          <em style={{ fontSize: 11 }}>Note: The axios interceptor must be wired to log requests to the DevTools store.</em>
        </div>
      )}

      {networkLogs.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--tos-border, #dee2e6)' }}>
              <th style={{ textAlign: 'left', padding: '6px 8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '6px 8px' }}>URL</th>
              <th style={{ textAlign: 'center', padding: '6px 8px' }}>Status</th>
              <th style={{ textAlign: 'right', padding: '6px 8px' }}>Duration</th>
              <th style={{ textAlign: 'right', padding: '6px 8px' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {networkLogs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid var(--tos-border-light, #f0f0f0)' }}>
                <td style={{
                  padding: '4px 8px',
                  fontWeight: 600,
                  color: log.method === 'GET' ? '#2563eb' : log.method === 'POST' ? '#16a34a' : log.method === 'DELETE' ? '#dc2626' : '#d97706',
                }}>
                  {log.method}
                </td>
                <td style={{ padding: '4px 8px', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {log.url}
                  {log.error && <span style={{ color: '#dc2626', marginLeft: 4 }}>({log.error})</span>}
                </td>
                <td style={{ padding: '4px 8px', textAlign: 'center' }}>
                  {log.status ? (
                    <span style={{
                      display: 'inline-block',
                      padding: '1px 6px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      color: getStatusColor(log.status),
                      background: `${getStatusColor(log.status)}15`,
                    }}>
                      {log.status}
                    </span>
                  ) : (
                    <span style={{ color: '#dc2626' }}>ERR</span>
                  )}
                </td>
                <td style={{ padding: '4px 8px', textAlign: 'right', fontFamily: 'monospace', color: 'var(--tos-text-muted, #888)' }}>
                  {log.duration != null ? `${log.duration}ms` : '\u2014'}
                </td>
                <td style={{ padding: '4px 8px', textAlign: 'right', color: 'var(--tos-text-muted, #888)' }}>
                  {new Date(log.timestamp).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
