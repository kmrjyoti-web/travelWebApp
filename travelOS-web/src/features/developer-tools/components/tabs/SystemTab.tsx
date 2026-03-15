'use client';
import React, { useState, useEffect } from 'react';

interface SystemInfo {
  browser: string;
  viewport: string;
  screen: string;
  devicePixelRatio: number;
  language: string;
  cookiesEnabled: boolean;
  onLine: boolean;
  platform: string;
  memory?: string;
  apiUrl: string;
  nodeEnv: string;
}

function getSystemInfo(): SystemInfo {
  const nav = typeof navigator !== 'undefined' ? navigator : null;
  const mem = (nav as unknown as Record<string, unknown>)?.deviceMemory as number | undefined;
  return {
    browser: nav?.userAgent?.split(' ').slice(-2).join(' ') ?? 'Unknown',
    viewport: typeof window !== 'undefined' ? `${window.innerWidth} \u00D7 ${window.innerHeight}` : 'Unknown',
    screen: typeof screen !== 'undefined' ? `${screen.width} \u00D7 ${screen.height}` : 'Unknown',
    devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    language: nav?.language ?? 'Unknown',
    cookiesEnabled: nav?.cookieEnabled ?? false,
    onLine: nav?.onLine ?? true,
    platform: nav?.platform ?? 'Unknown',
    memory: mem ? `${mem} GB` : undefined,
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
    nodeEnv: process.env.NODE_ENV ?? 'unknown',
  };
}

export function SystemTab() {
  const [info, setInfo] = useState<SystemInfo | null>(null);

  useEffect(() => {
    setInfo(getSystemInfo());
    const handleResize = () => setInfo(getSystemInfo());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!info) return null;

  const rows: [string, string | number | boolean][] = [
    ['Environment', info.nodeEnv],
    ['API URL', info.apiUrl],
    ['Browser', info.browser],
    ['Platform', info.platform],
    ['Viewport', info.viewport],
    ['Screen', info.screen],
    ['Device Pixel Ratio', info.devicePixelRatio],
    ['Language', info.language],
    ['Cookies Enabled', info.cookiesEnabled],
    ['Online', info.onLine],
  ];
  if (info.memory) rows.push(['Device Memory', info.memory]);

  return (
    <div className="tos-devtools-tab tos-devtools-tab--system">
      <table style={{ width: '100%', maxWidth: 500, borderCollapse: 'collapse', fontSize: 13 }}>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} style={{ borderBottom: '1px solid var(--tos-border-light, #f0f0f0)' }}>
              <td style={{ padding: '6px 12px', fontWeight: 600, color: 'var(--tos-text-secondary, #666)', width: '40%' }}>
                {label}
              </td>
              <td style={{ padding: '6px 12px', fontFamily: 'monospace' }}>
                {typeof value === 'boolean' ? (
                  <span style={{ color: value ? '#16a34a' : '#dc2626' }}>{String(value)}</span>
                ) : (
                  String(value)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
