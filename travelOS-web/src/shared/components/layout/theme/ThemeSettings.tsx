'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/shared/stores/ui.store';
import { Icon } from '@/shared/components/Icon';
import {
  COLOR_PRESETS,
  BACKGROUNDS,
  FONT_OPTIONS,
  FONT_WEIGHT_OPTIONS,
} from '@/shared/constants/theme.constants';
import type { ThemeMode, CardBgMode, MenuOrientation, LayoutWidth, SidebarPosition } from '@/shared/types/theme.types';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="tos-settings-panel__section-title">{children}</div>;
}

function ThemeModeButtons() {
  const { themeMode, updateTheme } = useUIStore();
  const modes: Array<{ value: ThemeMode; icon: Parameters<typeof Icon>[0]['name']; label: string }> = [
    { value: 'light', icon: 'Sun', label: 'Light' },
    { value: 'dark', icon: 'Moon', label: 'Dark' },
    { value: 'system', icon: 'Monitor', label: 'System' },
    { value: 'time', icon: 'Clock', label: 'Time' },
  ];
  return (
    <div className="tos-theme-modes">
      {modes.map((m) => (
        <button
          key={m.value}
          type="button"
          className={`tos-theme-mode-btn ${themeMode === m.value ? 'tos-theme-mode-btn--active' : ''}`}
          onClick={() => updateTheme({ themeMode: m.value })}
        >
          <Icon name={m.icon} size={14} />
          {m.label}
        </button>
      ))}
    </div>
  );
}

function ColorPresetPicker() {
  const { headerBg, sidebarBg, updateTheme } = useUIStore();
  return (
    <div className="tos-color-presets">
      {COLOR_PRESETS.map((preset, i) => {
        const isActive = headerBg === preset.header && sidebarBg === preset.sidebar;
        return (
          <button
            key={i}
            type="button"
            className={`tos-color-preset ${isActive ? 'tos-color-preset--active' : ''}`}
            title={preset.label}
            onClick={() =>
              updateTheme({ headerBg: preset.header, sidebarBg: preset.sidebar })
            }
          >
            <div className="tos-color-preset__top" style={{ background: preset.header }} />
            <div className="tos-color-preset__bottom" style={{ background: preset.sidebar }} />
          </button>
        );
      })}
    </div>
  );
}

function IndividualColors() {
  const { headerBg, sidebarBg, sidebarText, accentColor, iconColor, updateTheme } = useUIStore();
  const fields = [
    { label: 'Header BG', key: 'headerBg', value: headerBg },
    { label: 'Sidebar BG', key: 'sidebarBg', value: sidebarBg },
    { label: 'Sidebar Text', key: 'sidebarText', value: sidebarText },
    { label: 'Accent Color', key: 'accentColor', value: accentColor },
    { label: 'Icon Color', key: 'iconColor', value: iconColor },
  ] as const;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tos-spacing-sm)' }}>
      {fields.map((field) => (
        <div
          key={field.key}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <span style={{ fontSize: 13, color: 'var(--tos-text-secondary)' }}>{field.label}</span>
          <input
            type="color"
            value={field.value}
            onChange={(e) => updateTheme({ [field.key]: e.target.value })}
            style={{ width: 36, height: 28, border: 'none', cursor: 'pointer', borderRadius: 4 }}
          />
        </div>
      ))}
    </div>
  );
}

function AppearanceControls() {
  const { fontFamily, fontWeight, fontSize, zoom, updateTheme } = useUIStore();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tos-spacing-sm)' }}>
      <div>
        <label style={{ fontSize: 12, color: 'var(--tos-text-muted)', display: 'block', marginBottom: 4 }}>
          Font Family
        </label>
        <select
          value={fontFamily}
          onChange={(e) => updateTheme({ fontFamily: e.target.value })}
          style={{
            width: '100%',
            padding: '5px 8px',
            background: 'var(--tos-input-bg)',
            border: '1px solid var(--tos-input-border)',
            borderRadius: 'var(--tos-border-radius-sm)',
            color: 'var(--tos-text-primary)',
            fontSize: 13,
          }}
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label style={{ fontSize: 12, color: 'var(--tos-text-muted)', display: 'block', marginBottom: 4 }}>
          Font Weight
        </label>
        <select
          value={fontWeight}
          onChange={(e) => updateTheme({ fontWeight: e.target.value })}
          style={{
            width: '100%',
            padding: '5px 8px',
            background: 'var(--tos-input-bg)',
            border: '1px solid var(--tos-input-border)',
            borderRadius: 'var(--tos-border-radius-sm)',
            color: 'var(--tos-text-primary)',
            fontSize: 13,
          }}
        >
          {FONT_WEIGHT_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <label style={{ fontSize: 12, color: 'var(--tos-text-muted)' }}>Font Size</label>
          <span style={{ fontSize: 12, color: 'var(--tos-accent)' }}>{fontSize}px</span>
        </div>
        <input
          type="range"
          min={10}
          max={24}
          value={fontSize}
          onChange={(e) => updateTheme({ fontSize: Number(e.target.value) })}
          style={{ width: '100%', accentColor: 'var(--tos-accent)' }}
        />
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <label style={{ fontSize: 12, color: 'var(--tos-text-muted)' }}>Zoom</label>
          <span style={{ fontSize: 12, color: 'var(--tos-accent)' }}>{zoom}%</span>
        </div>
        <input
          type="range"
          min={50}
          max={150}
          value={zoom}
          onChange={(e) => updateTheme({ zoom: Number(e.target.value) })}
          style={{ width: '100%', accentColor: 'var(--tos-accent)' }}
        />
      </div>
    </div>
  );
}

function CardBgModeButtons() {
  const { cardBgMode, cardBgOpacity, updateTheme } = useUIStore();
  const modes: Array<{ value: CardBgMode; icon: Parameters<typeof Icon>[0]['name']; label: string }> = [
    { value: 'background', icon: 'Image', label: 'Background' },
    { value: 'child', icon: 'Layers', label: 'Child' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tos-spacing-sm)' }}>
      <div style={{ display: 'flex', gap: 'var(--tos-spacing-xs)' }}>
        {modes.map((m) => (
          <button
            key={m.value}
            type="button"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--tos-spacing-xs)',
              padding: 'var(--tos-spacing-sm)',
              border: `1px solid ${cardBgMode === m.value ? 'var(--tos-accent)' : 'var(--tos-border-color)'}`,
              borderRadius: 'var(--tos-border-radius)',
              background: cardBgMode === m.value ? 'var(--tos-accent)' : 'transparent',
              color: cardBgMode === m.value ? '#ffffff' : 'var(--tos-text-secondary)',
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all var(--tos-transition-fast)',
            }}
            onClick={() => updateTheme({ cardBgMode: m.value })}
          >
            <Icon name={m.icon} size={14} />
            {m.label}
          </button>
        ))}
      </div>
      {cardBgMode === 'child' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: 'var(--tos-text-muted)' }}>Opacity</span>
            <span style={{ fontSize: 12, color: 'var(--tos-accent)' }}>{cardBgOpacity}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={cardBgOpacity}
            onChange={(e) => updateTheme({ cardBgOpacity: Number(e.target.value) })}
            style={{ width: '100%', accentColor: 'var(--tos-accent)' }}
          />
        </div>
      )}
    </div>
  );
}

function BackgroundPicker({
  title,
  value,
  opacityValue,
  onSelect,
  onOpacity,
}: {
  title: string;
  value: string;
  opacityValue: number;
  onSelect: (v: string) => void;
  onOpacity: (v: number) => void;
}) {
  return (
    <div>
      <div className="tos-bg-grid">
        {BACKGROUNDS.map((bg) => (
          <button
            key={bg.value}
            type="button"
            className={`tos-bg-item ${value === bg.value ? 'tos-bg-item--active' : ''}`}
            title={bg.label}
            onClick={() => onSelect(bg.value)}
            style={{
              backgroundImage: bg.preview ? `url(${bg.preview})` : undefined,
              backgroundColor: bg.value.startsWith('#') ? bg.value : bg.value === 'none' ? '#f3f4f6' : undefined,
            }}
          >
            {bg.value === 'none' && (
              <span style={{ fontSize: 16 }}>✕</span>
            )}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 'var(--tos-spacing-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: 'var(--tos-text-muted)' }}>Opacity</span>
          <span style={{ fontSize: 12, color: 'var(--tos-accent)' }}>{opacityValue}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={opacityValue}
          onChange={(e) => onOpacity(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--tos-accent)' }}
        />
      </div>
    </div>
  );
}

function LayoutControls() {
  const { menuOrientation, layoutWidth, sidebarPosition, updateTheme } = useUIStore();

  function ToggleGroup<T extends string>({
    label,
    options,
    value,
    onChange,
  }: {
    label: string;
    options: Array<{ value: T; label: string }>;
    value: T;
    onChange: (v: T) => void;
  }) {
    return (
      <div>
        <div style={{ fontSize: 12, color: 'var(--tos-text-muted)', marginBottom: 6 }}>{label}</div>
        <div style={{ display: 'flex', gap: 'var(--tos-spacing-xs)' }}>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              style={{
                flex: 1,
                padding: '5px 8px',
                borderRadius: 'var(--tos-border-radius-sm)',
                border: '1px solid var(--tos-border-color)',
                background: value === opt.value ? 'var(--tos-accent)' : 'transparent',
                color: value === opt.value ? '#ffffff' : 'var(--tos-text-secondary)',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--tos-spacing-sm)' }}>
      <ToggleGroup<MenuOrientation>
        label="Menu Orientation"
        options={[{ value: 'vertical', label: 'Vertical' }, { value: 'horizontal', label: 'Horizontal' }]}
        value={menuOrientation}
        onChange={(v) => updateTheme({ menuOrientation: v })}
      />
      <ToggleGroup<LayoutWidth>
        label="Layout Width"
        options={[{ value: 'fluid', label: 'Fluid' }, { value: 'boxed', label: 'Boxed' }]}
        value={layoutWidth}
        onChange={(v) => updateTheme({ layoutWidth: v })}
      />
      <ToggleGroup<SidebarPosition>
        label="Sidebar Position"
        options={[{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }]}
        value={sidebarPosition}
        onChange={(v) => updateTheme({ sidebarPosition: v })}
      />
    </div>
  );
}

export function ThemeSettings() {
  const { isSettingsOpen, toggleSettings, resetTheme, background, bgOpacity, sidebarBgImage, sidebarBgOpacity, updateTheme } = useUIStore();

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <>
          <motion.div
            className="tos-settings-panel__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSettings}
          />
          <motion.div
            className="tos-settings-panel"
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="tos-settings-panel__header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--tos-spacing-sm)' }}>
                <Icon name="Settings2" size={16} />
                <span style={{ fontWeight: 600 }}>Theme Settings</span>
              </div>
              <button
                type="button"
                onClick={toggleSettings}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: 4,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Icon name="X" size={16} />
              </button>
            </div>

            <div className="tos-settings-panel__body">
              <div className="tos-settings-panel__section">
                <SectionTitle>Theme Mode</SectionTitle>
                <ThemeModeButtons />
              </div>

              <div className="tos-settings-panel__section">
                <SectionTitle>Color Presets</SectionTitle>
                <ColorPresetPicker />
              </div>

              <div className="tos-settings-panel__section">
                <SectionTitle>Individual Colors</SectionTitle>
                <IndividualColors />
              </div>

              <div className="tos-settings-panel__section">
                <SectionTitle>Appearance</SectionTitle>
                <AppearanceControls />
              </div>

              <div className="tos-settings-panel__section">
                <SectionTitle>Card Background</SectionTitle>
                <CardBgModeButtons />
              </div>

              <div className="tos-settings-panel__section">
                <SectionTitle>App Background</SectionTitle>
                <BackgroundPicker
                  title="App Background"
                  value={background}
                  opacityValue={bgOpacity}
                  onSelect={(v) => updateTheme({ background: v })}
                  onOpacity={(v) => updateTheme({ bgOpacity: v })}
                />
              </div>

              <div className="tos-settings-panel__section">
                <SectionTitle>Sidebar Background</SectionTitle>
                <BackgroundPicker
                  title="Sidebar Background"
                  value={sidebarBgImage}
                  opacityValue={sidebarBgOpacity}
                  onSelect={(v) => updateTheme({ sidebarBgImage: v })}
                  onOpacity={(v) => updateTheme({ sidebarBgOpacity: v })}
                />
              </div>

              <div className="tos-settings-panel__section">
                <SectionTitle>Layout</SectionTitle>
                <LayoutControls />
              </div>

              <div className="tos-settings-panel__section">
                <button
                  type="button"
                  onClick={resetTheme}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid var(--tos-border-color)',
                    borderRadius: 'var(--tos-border-radius)',
                    background: 'transparent',
                    color: 'var(--tos-danger)',
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Icon name="RotateCcw" size={14} />
                  Reset to Default
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
