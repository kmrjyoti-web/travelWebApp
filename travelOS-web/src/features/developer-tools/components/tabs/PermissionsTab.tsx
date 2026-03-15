'use client';
import React from 'react';
import { useAuthStore } from '@/shared/stores/auth.store';

export function PermissionsTab() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated || !user) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--tos-text-muted, #888)' }}>
        Not authenticated. Log in to view permissions.
      </div>
    );
  }

  const fields: [string, unknown][] = Object.entries(user).filter(
    ([key]) => !['password', 'passwordHash'].includes(key),
  );

  return (
    <div className="tos-devtools-tab tos-devtools-tab--permissions">
      <div style={{ fontWeight: 600, marginBottom: 12 }}>User Profile</div>
      <table style={{ width: '100%', maxWidth: 600, borderCollapse: 'collapse', fontSize: 13 }}>
        <tbody>
          {fields.map(([key, value]) => (
            <tr key={key} style={{ borderBottom: '1px solid var(--tos-border-light, #f0f0f0)' }}>
              <td style={{ padding: '6px 12px', fontWeight: 500, color: 'var(--tos-text-secondary, #666)', width: '35%' }}>
                {key}
              </td>
              <td style={{ padding: '6px 12px', fontFamily: 'monospace', fontSize: 12, wordBreak: 'break-all' }}>
                {value === null || value === undefined ? (
                  <span style={{ color: 'var(--tos-text-muted, #888)' }}>null</span>
                ) : typeof value === 'object' ? (
                  JSON.stringify(value, null, 2)
                ) : typeof value === 'boolean' ? (
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
