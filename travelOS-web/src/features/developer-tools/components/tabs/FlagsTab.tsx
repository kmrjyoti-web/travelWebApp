'use client';
import React from 'react';

const DEFAULT_FLAGS: Record<string, { enabled: boolean; description: string }> = {
  'devtools': { enabled: process.env.NODE_ENV === 'development', description: 'Developer tools panel' },
  'ai-itinerary': { enabled: true, description: 'AI-powered itinerary generation' },
  'marketplace': { enabled: true, description: 'Service marketplace' },
  'b2b': { enabled: true, description: 'B2B agent portal' },
  'influencer': { enabled: true, description: 'Influencer module' },
  'analytics': { enabled: true, description: 'Analytics dashboard' },
  'dark-mode': { enabled: true, description: 'Dark mode theme support' },
  'side-panel': { enabled: true, description: 'Drawer/side panel system' },
  'smart-toast': { enabled: true, description: 'Imperative toast notifications' },
};

export function FlagsTab() {
  const flags = DEFAULT_FLAGS;

  return (
    <div className="tos-devtools-tab tos-devtools-tab--flags">
      <div style={{ fontWeight: 600, marginBottom: 12 }}>Feature Flags</div>
      <p style={{ fontSize: 12, color: 'var(--tos-text-muted, #888)', marginBottom: 16 }}>
        These are the current feature flag states. Connect to a remote config service to manage flags dynamically.
      </p>

      <table style={{ width: '100%', maxWidth: 600, borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--tos-border, #dee2e6)' }}>
            <th style={{ textAlign: 'left', padding: '6px 12px' }}>Flag</th>
            <th style={{ textAlign: 'center', padding: '6px 12px' }}>Status</th>
            <th style={{ textAlign: 'left', padding: '6px 12px' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(flags).map(([key, flag]) => (
            <tr key={key} style={{ borderBottom: '1px solid var(--tos-border-light, #f0f0f0)' }}>
              <td style={{ padding: '6px 12px', fontFamily: 'monospace', fontSize: 12 }}>{key}</td>
              <td style={{ padding: '6px 12px', textAlign: 'center' }}>
                <span style={{
                  display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                  background: flag.enabled ? '#dcfce7' : '#fee2e2',
                  color: flag.enabled ? '#16a34a' : '#dc2626',
                }}>
                  {flag.enabled ? 'ON' : 'OFF'}
                </span>
              </td>
              <td style={{ padding: '6px 12px', color: 'var(--tos-text-muted, #888)' }}>{flag.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
