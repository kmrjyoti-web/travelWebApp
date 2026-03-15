'use client';
import React from 'react';

const DOC_LINKS = [
  { title: 'Architecture Overview', path: 'docs/architecture/', description: 'System architecture and design patterns' },
  { title: 'P0 Migration', path: 'docs/sessions/2026-03-02_01_claude_p0-migration.md', description: 'CoreUI migration session log' },
  { title: 'Phase 8 Migration', path: 'docs/sessions/2026-03-03_02_claude_phase8-migration.md', description: 'UI-KIT-main migration' },
  { title: 'Phase 8 Cleanup', path: 'docs/sessions/2026-03-03_03_claude_phase8-delete.md', description: 'UI-KIT-main deletion' },
  { title: 'Phases 9-12', path: 'docs/sessions/2026-03-03_04_claude_phases9-12.md', description: 'Performance, errors, testing, docs' },
  { title: 'Verification Flow', path: 'docs/VERIFICATION-FLOW.md', description: 'User verification workflow' },
  { title: 'Admin Roles', path: 'docs/ADMIN-ROLES.md', description: 'Backoffice role definitions' },
  { title: 'Tax ID Guide', path: 'docs/TAX-ID-GUIDE.md', description: 'Country-specific tax ID formats' },
  { title: 'Login Gate', path: 'docs/LOGIN-GATE.md', description: 'Login status gate logic' },
  { title: 'CHANGELOG', path: 'CHANGELOG.md', description: 'Version history' },
  { title: 'README', path: 'README.md', description: 'Project overview and setup' },
];

const FEATURE_MODULES = [
  { name: 'auth', path: 'src/features/auth/', description: 'Authentication & registration' },
  { name: 'itinerary', path: 'src/features/itinerary/', description: 'Itinerary builder & publisher' },
  { name: 'booking', path: 'src/features/booking/', description: 'Booking management' },
  { name: 'marketplace', path: 'src/features/marketplace/', description: 'Service marketplace' },
  { name: 'analytics', path: 'src/features/analytics/', description: 'Analytics & reporting' },
  { name: 'influencer', path: 'src/features/influencer/', description: 'Influencer portal' },
  { name: 'ai-itinerary', path: 'src/features/ai-itinerary/', description: 'AI itinerary generation' },
  { name: 'layout', path: 'src/features/layout/', description: 'App shell (header, sidebar, footer)' },
  { name: 'theme', path: 'src/features/theme/', description: 'Theme provider & settings' },
  { name: 'developer-tools', path: 'src/features/developer-tools/', description: 'This panel!' },
  { name: 'dashboard', path: 'src/features/dashboard/', description: 'Dashboard widgets & overview' },
];

export function FeatureDocsTab() {
  return (
    <div className="tos-devtools-tab tos-devtools-tab--feature-docs">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>Documentation</div>
          {DOC_LINKS.map((doc) => (
            <div
              key={doc.path}
              style={{
                padding: '8px 12px', marginBottom: 4, borderRadius: 4,
                border: '1px solid var(--tos-border-light, #f0f0f0)',
              }}
            >
              <div style={{ fontWeight: 500, fontSize: 13 }}>{doc.title}</div>
              <div style={{ fontSize: 11, color: 'var(--tos-text-muted, #888)', fontFamily: 'monospace' }}>{doc.path}</div>
              <div style={{ fontSize: 12, color: 'var(--tos-text-secondary, #666)', marginTop: 2 }}>{doc.description}</div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>Feature Modules</div>
          {FEATURE_MODULES.map((mod) => (
            <div
              key={mod.name}
              style={{
                padding: '8px 12px', marginBottom: 4, borderRadius: 4,
                border: '1px solid var(--tos-border-light, #f0f0f0)',
              }}
            >
              <div style={{ fontWeight: 500, fontSize: 13 }}>{mod.name}</div>
              <div style={{ fontSize: 11, color: 'var(--tos-text-muted, #888)', fontFamily: 'monospace' }}>{mod.path}</div>
              <div style={{ fontSize: 12, color: 'var(--tos-text-secondary, #666)', marginTop: 2 }}>{mod.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
