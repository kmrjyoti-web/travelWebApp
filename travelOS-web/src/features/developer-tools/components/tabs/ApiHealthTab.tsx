'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { api } from '@/shared/services/api';

interface HealthResult {
  status: 'ok' | 'error';
  latencyMs: number;
  response?: unknown;
  error?: string;
  timestamp: number;
}

export function ApiHealthTab() {
  const [results, setResults] = useState<HealthResult[]>([]);
  const [checking, setChecking] = useState(false);
  const [autoCheck, setAutoCheck] = useState(false);

  const checkHealth = useCallback(async () => {
    setChecking(true);
    const start = performance.now();
    try {
      const res = await api.get('/health');
      const latencyMs = Math.round(performance.now() - start);
      setResults((prev) => [
        { status: 'ok' as const, latencyMs, response: res, timestamp: Date.now() },
        ...prev,
      ].slice(0, 50));
    } catch (err: unknown) {
      const latencyMs = Math.round(performance.now() - start);
      const message = err instanceof Error ? err.message : 'Unknown error';
      setResults((prev) => [
        { status: 'error' as const, latencyMs, error: message, timestamp: Date.now() },
        ...prev,
      ].slice(0, 50));
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  useEffect(() => {
    if (!autoCheck) return;
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, [autoCheck, checkHealth]);

  const latestResult = results[0];

  return (
    <div className="tos-devtools-tab tos-devtools-tab--api-health">
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: !latestResult ? '#888' : latestResult.status === 'ok' ? '#16a34a' : '#dc2626',
            flexShrink: 0,
          }}
        />
        <span style={{ fontWeight: 600 }}>
          {!latestResult ? 'Not checked' : latestResult.status === 'ok' ? 'Healthy' : 'Unhealthy'}
        </span>
        {latestResult && (
          <span style={{ color: 'var(--tos-text-muted, #888)', fontSize: 12 }}>
            {latestResult.latencyMs}ms
          </span>
        )}
        <button
          onClick={checkHealth}
          disabled={checking}
          style={{
            padding: '4px 12px',
            borderRadius: 4,
            border: '1px solid var(--tos-border, #dee2e6)',
            background: 'var(--tos-bg, #fff)',
            color: 'var(--tos-text, #212529)',
            fontSize: 12,
            cursor: checking ? 'not-allowed' : 'pointer',
          }}
        >
          {checking ? 'Checking...' : 'Check Now'}
        </button>
        <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
          <input
            type="checkbox"
            checked={autoCheck}
            onChange={(e) => setAutoCheck(e.target.checked)}
          />
          Auto (10s)
        </label>
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--tos-text-secondary, #666)' }}>
        API Base: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}
      </div>

      {results.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--tos-border, #dee2e6)' }}>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>Time</th>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>Status</th>
              <th style={{ textAlign: 'right', padding: '4px 8px' }}>Latency</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--tos-border-light, #f0f0f0)' }}>
                <td style={{ padding: '4px 8px', color: 'var(--tos-text-muted, #888)' }}>
                  {new Date(r.timestamp).toLocaleTimeString()}
                </td>
                <td style={{ padding: '4px 8px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '1px 6px',
                    borderRadius: 4,
                    fontSize: 11,
                    background: r.status === 'ok' ? '#dcfce7' : '#fee2e2',
                    color: r.status === 'ok' ? '#16a34a' : '#dc2626',
                  }}>
                    {r.status === 'ok' ? 'OK' : 'ERROR'}
                  </span>
                  {r.error && <span style={{ marginLeft: 8, color: '#dc2626' }}>{r.error}</span>}
                </td>
                <td style={{ padding: '4px 8px', textAlign: 'right', fontFamily: 'monospace' }}>
                  {r.latencyMs}ms
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
