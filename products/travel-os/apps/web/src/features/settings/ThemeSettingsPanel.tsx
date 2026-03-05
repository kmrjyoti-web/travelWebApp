'use client';

/**
 * @file src/features/settings/ThemeSettingsPanel.tsx
 *
 * Slide-in theme settings drawer.
 * Migrated from UI-KIT-main/components/ThemeSettings.tsx.
 *
 * Changes from original:
 *   - Tailwind CSS → tos-* BEM classes (overrides.css)
 *   - Framer Motion → CSS transitions
 *   - Custom ThemeContext → useThemeContext from @/contexts/ThemeContext
 *   - lucide-react direct → Icon wrapper from @/components/icons/Icon
 *   - `any` props removed — fully typed
 *   - Color-mode options: light / dark / system (aligned with ColorMode type)
 *   - Sidebar left/right position removed (not in products/web LayoutProvider)
 */

import { useCallback, type KeyboardEvent } from 'react';
import { useThemeContext } from '@/contexts/ThemeContext';
import { Icon } from '@/components/icons/Icon';
import type { ColorMode, ProductTheme } from '@/types/theme';

// ─── Data ─────────────────────────────────────────────────────────────────────

interface ColorPreset {
  label: string;
  header: string;
  sidebar: string;
}

const COLOR_PRESETS: ColorPreset[] = [
  { label: 'Ocean Blue',    header: '#0f4c75', sidebar: '#3282b8' },
  { label: 'Midnight',      header: '#1a237e', sidebar: '#3949ab' },
  { label: 'Forest',        header: '#1b5e20', sidebar: '#43a047' },
  { label: 'Crimson',       header: '#b71c1c', sidebar: '#e53935' },
  { label: 'Amethyst',      header: '#4a148c', sidebar: '#8e24aa' },
  { label: 'Sky Blue',      header: '#01579b', sidebar: '#039be5' },
  { label: 'Slate',         header: '#263238', sidebar: '#546e7a' },
  { label: 'Amber',         header: '#e65100', sidebar: '#fb8c00' },
  { label: 'TravelOS',      header: '#1b6563', sidebar: '#222d32' },
  { label: 'Rose',          header: '#880e4f', sidebar: '#d81b60' },
  { label: 'Monochrome',    header: '#000000', sidebar: '#212121' },
  { label: 'Walnut',        header: '#3e2723', sidebar: '#6d4c41' },
  { label: 'Teal',          header: '#006064', sidebar: '#00acc1' },
  { label: 'Dark Amber',    header: '#212121', sidebar: '#ffb300' },
];

const PRODUCT_OPTIONS: { value: ProductTheme; label: string }[] = [
  { value: 'travel-os', label: 'TravelOS (Blue)' },
  { value: 'food-os',   label: 'FoodOS (Orange)' },
  { value: 'crm-os',    label: 'CRM OS (Purple)' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="tos-theme-settings__group-label">{children}</p>
  );
}

// ─── ThemeSettingsPanel ───────────────────────────────────────────────────────

interface ThemeSettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function ThemeSettingsPanel({ open, onClose }: ThemeSettingsPanelProps) {
  const { colorMode, setColorMode, productTheme, setProductTheme, toggleColorMode } =
    useThemeContext();

  const handleBackdropKey = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') onClose();
    },
    [onClose],
  );

  if (!open) return null;

  const modeOptions: { value: ColorMode; label: string }[] = [
    { value: 'light',  label: 'Light' },
    { value: 'dark',   label: 'Dark' },
    { value: 'system', label: 'System' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="tos-search-overlay__backdrop"
        style={{ zIndex: 'var(--tos-z-modal)' as React.CSSProperties['zIndex'] }}
        onClick={onClose}
        onKeyDown={handleBackdropKey}
        role="presentation"
        aria-hidden
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Theme settings"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 320,
          zIndex: 'var(--tos-z-modal-content)' as React.CSSProperties['zIndex'],
          backgroundColor: 'var(--tos-surface-card)',
          borderLeft: '1px solid var(--tos-border-light)',
          boxShadow: 'var(--tos-shadow-2xl)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--tos-spacing-4)',
            borderBottom: '1px solid var(--tos-border-light)',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 'var(--tos-font-size-base)',
              fontWeight: 'var(--tos-font-weight-semibold)',
              color: 'var(--tos-text-primary)',
            }}
          >
            Theme Settings
          </h2>
          <button
            className="tos-help-panel__close"
            onClick={onClose}
            aria-label="Close theme settings"
          >
            <Icon name="X" size={20} aria-hidden />
          </button>
        </div>

        {/* Scrollable body */}
        <div
          style={{
            flex: '1 1 auto',
            overflowY: 'auto',
            padding: 'var(--tos-spacing-4)',
          }}
        >
          {/* ── Color Mode ─────────────────────────────────── */}
          <div className="tos-theme-settings__group">
            <SectionLabel>Theme Mode</SectionLabel>
            <div className="tos-theme-settings__mode-grid">
              {modeOptions.map(({ value, label }) => (
                <button
                  key={value}
                  className={[
                    'tos-theme-settings__mode-btn',
                    colorMode === value ? 'tos-theme-settings__mode-btn--active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setColorMode(value)}
                  aria-pressed={colorMode === value}
                >
                  {label}
                </button>
              ))}
              <button
                className="tos-theme-settings__mode-btn"
                onClick={toggleColorMode}
                title="Toggle between light and dark"
              >
                Toggle
              </button>
            </div>
          </div>

          {/* ── Product Theme ───────────────────────────────── */}
          <div className="tos-theme-settings__group">
            <SectionLabel>Product Theme</SectionLabel>
            <div className="tos-theme-settings__orientation-row">
              {PRODUCT_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  className={[
                    'tos-theme-settings__orientation-btn',
                    productTheme === value ? 'tos-theme-settings__orientation-btn--active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setProductTheme(value)}
                  aria-pressed={productTheme === value}
                  style={{ flex: 'unset', padding: '6px 8px', fontSize: '11px' }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Color Presets ───────────────────────────────── */}
          <div className="tos-theme-settings__group">
            <SectionLabel>Color Presets</SectionLabel>
            <div className="tos-theme-settings__preset-grid">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  className="tos-theme-settings__preset"
                  title={preset.label}
                  aria-label={`Apply ${preset.label} color preset`}
                  style={{
                    /* Visual-only; actual theme tokens are applied via data-product + data-theme attrs */
                    '--_h': preset.header,
                    '--_s': preset.sidebar,
                  } as React.CSSProperties}
                  onClick={() => {
                    /* Presets are informational in this build; full custom CSS var override
                       would require runtime injection — for now, switching productTheme is the
                       supported mechanism. */
                  }}
                >
                  <span
                    className="tos-theme-settings__preset-half"
                    style={{ backgroundColor: preset.header }}
                  />
                  <span
                    className="tos-theme-settings__preset-half"
                    style={{ backgroundColor: preset.sidebar }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer: Reset */}
        <div
          style={{
            padding: 'var(--tos-spacing-4)',
            borderTop: '1px solid var(--tos-border-light)',
            backgroundColor: 'var(--tos-surface-bg)',
          }}
        >
          <button
            className="tos-theme-settings__reset-btn"
            onClick={() => setColorMode('system')}
          >
            Reset to Default
          </button>
        </div>
      </aside>
    </>
  );
}
