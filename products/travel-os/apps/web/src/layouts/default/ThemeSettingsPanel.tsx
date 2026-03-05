'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Icon } from '@/components/icons/Icon';
import { useThemeSettingsStore, type MenuOrient, type LayoutWidth, type SidebarPos, type ThemeMode } from '@/stores/themeSettingsStore';

// ─── Constants ─────────────────────────────────────────────────────────────────

/** 8 nature photo options for background thumbnails (index 0–7). */
const BG_OPTIONS: { thumb: string; full: string }[] = [
  { thumb: 'https://picsum.photos/id/15/120/90',   full: 'https://picsum.photos/id/15/1920/1080'  }, // Mountains
  { thumb: 'https://picsum.photos/id/28/120/90',   full: 'https://picsum.photos/id/28/1920/1080'  }, // Beach
  { thumb: 'https://picsum.photos/id/64/120/90',   full: 'https://picsum.photos/id/64/1920/1080'  }, // Forest
  { thumb: 'https://picsum.photos/id/85/120/90',   full: 'https://picsum.photos/id/85/1920/1080'  }, // Misty
  { thumb: 'https://picsum.photos/id/10/120/90',   full: 'https://picsum.photos/id/10/1920/1080'  }, // Tree
  { thumb: 'https://picsum.photos/id/56/120/90',   full: 'https://picsum.photos/id/56/1920/1080'  }, // Desert
  { thumb: 'https://picsum.photos/id/36/120/90',   full: 'https://picsum.photos/id/36/1920/1080'  }, // Sunset
  { thumb: 'https://picsum.photos/id/57/120/90',   full: 'https://picsum.photos/id/57/1920/1080'  }, // Purple sky
];

/** 12 color presets: [headerBg, sidebarBg] pairs. */
const COLOR_PRESETS: [string, string][] = [
  ['#00897B', '#00695C'],
  ['#1B4F72', '#1B1F6B'],
  ['#2E7D32', '#1B5E20'],
  ['#B71C1C', '#7F0000'],
  ['#6A1B9A', '#4A148C'],
  ['#1565C0', '#0D47A1'],
  ['#455A64', '#263238'],
  ['#E65100', '#BF360C'],
  ['#880E4F', '#560027'],
  ['#37474F', '#212121'],
  ['#4E342E', '#3E2723'],
  ['#006064', '#004D40'],
];

const FONT_FAMILIES = ['Roboto', 'Inter', 'Open Sans', 'Poppins', 'Lato', 'Arial'];
const FONT_WEIGHTS  = [
  { label: 'Thin',   value: '100' },
  { label: 'Light',  value: '300' },
  { label: 'Normal', value: 'normal' },
  { label: 'Medium', value: '500' },
  { label: 'Bold',   value: 'bold' },
];

// ─── Props ─────────────────────────────────────────────────────────────────────

interface ThemeSettingsPanelProps {
  open:    boolean;
  onClose: () => void;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="tos-tp__section">
      <p className="tos-tp__section-title">{title}</p>
      {children}
    </div>
  );
}

function ToggleGroup({ options, value, onChange }: {
  options: { label: string; value: string }[];
  value:   string;
  onChange:(v: string) => void;
}) {
  return (
    <div className="tos-tp__toggle-group">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`tos-tp__toggle-btn${value === opt.value ? ' tos-tp__toggle-btn--active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="tos-tp__color-row">
      <span className="tos-tp__color-label">{label}</span>
      <button
        type="button"
        className="tos-tp__color-swatch"
        style={{ background: value }}
        onClick={() => inputRef.current?.click()}
        aria-label={`Pick color for ${label}`}
        title={value}
      >
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="tos-tp__color-input"
          aria-hidden
        />
      </button>
    </div>
  );
}

function SliderRow({ label, value, min, max, onChange }: {
  label:    string;
  value:    number;
  min:      number;
  max:      number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="tos-tp__slider-row">
      <span className="tos-tp__slider-label">{label}</span>
      <div className="tos-tp__slider-controls">
        <button type="button" className="tos-tp__slider-step"
          onClick={() => onChange(Math.max(min, value - 1))} aria-label="Decrease">
          <Icon name="Minus" size={11} aria-hidden />
        </button>
        <input type="range" className="tos-tp__slider"
          min={min} max={max} value={value}
          onChange={(e) => onChange(Number(e.target.value))} />
        <button type="button" className="tos-tp__slider-step"
          onClick={() => onChange(Math.min(max, value + 1))} aria-label="Increase">
          <Icon name="Plus" size={11} aria-hidden />
        </button>
      </div>
    </div>
  );
}

function SelectRow({ label, value, options, onChange }: {
  label:    string;
  value:    string;
  options:  { label: string; value: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="tos-tp__select-row">
      <span className="tos-tp__select-label">{label}</span>
      <select
        className="tos-tp__select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ─── Layout Tab ────────────────────────────────────────────────────────────────

function LayoutTab() {
  const s = useThemeSettingsStore();

  return (
    <>
      {/* App Background */}
      <Section title="APP BACKGROUND">
        <div className="tos-tp__bg-header">
          <span />
          <label className="tos-tp__checkbox-label">
            <input type="checkbox" className="tos-tp__checkbox" />
            Full Page
          </label>
        </div>
        <div className="tos-tp__bg-grid">
          {/* None */}
          <button
            type="button"
            className={`tos-tp__bg-thumb tos-tp__bg-thumb--none${s.appBgIndex === -1 ? ' tos-tp__bg-thumb--active' : ''}`}
            onClick={() => s.setAppBgIndex(-1)}
            aria-label="No background"
          >
            None
          </button>
          {BG_OPTIONS.map((opt, i) => (
            <button
              key={i}
              type="button"
              className={`tos-tp__bg-thumb${s.appBgIndex === i ? ' tos-tp__bg-thumb--active' : ''}`}
              style={{ backgroundImage: `url(${opt.thumb})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              onClick={() => s.setAppBgIndex(i)}
              aria-label={`Background ${i + 1}`}
            />
          ))}
        </div>
        <SliderRow label={`Opacity (${s.appBgOpacity}%)`} value={s.appBgOpacity} min={10} max={100} onChange={s.setAppBgOpacity} />
      </Section>

      {/* Sidebar Background */}
      <Section title="SIDEBAR BACKGROUND">
        <div className="tos-tp__bg-grid">
          <button
            type="button"
            className={`tos-tp__bg-thumb tos-tp__bg-thumb--none${s.sidebarBgIndex === -1 ? ' tos-tp__bg-thumb--active' : ''}`}
            onClick={() => s.setSidebarBgIndex(-1)}
            aria-label="No background"
          >
            None
          </button>
          {BG_OPTIONS.map((opt, i) => (
            <button
              key={i}
              type="button"
              className={`tos-tp__bg-thumb${s.sidebarBgIndex === i ? ' tos-tp__bg-thumb--active' : ''}`}
              style={{ backgroundImage: `url(${opt.thumb})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              onClick={() => s.setSidebarBgIndex(i)}
              aria-label={`Background ${i + 1}`}
            />
          ))}
        </div>
        <SliderRow label={`Opacity (${s.sidebarBgOpacity}%)`} value={s.sidebarBgOpacity} min={10} max={100} onChange={s.setSidebarBgOpacity} />
      </Section>

      {/* Menu Orientation */}
      <Section title="MENU ORIENTATION">
        <ToggleGroup
          options={[{ label: 'Vertical', value: 'vertical' }, { label: 'Horizontal', value: 'horizontal' }]}
          value={s.menuOrientation}
          onChange={(v) => s.setMenuOrientation(v as MenuOrient)}
        />
      </Section>

      {/* Layout Width */}
      <Section title="LAYOUT WIDTH">
        <ToggleGroup
          options={[{ label: 'Fluid', value: 'fluid' }, { label: 'Boxed', value: 'boxed' }]}
          value={s.layoutWidth}
          onChange={(v) => s.setLayoutWidth(v as LayoutWidth)}
        />
      </Section>

      {/* Sidebar Position */}
      <Section title="SIDEBAR POSITION">
        <ToggleGroup
          options={[{ label: 'Left', value: 'left' }, { label: 'Right', value: 'right' }]}
          value={s.sidebarPosition}
          onChange={(v) => s.setSidebarPosition(v as SidebarPos)}
        />
      </Section>
    </>
  );
}

// ─── Theme Tab ─────────────────────────────────────────────────────────────────

function ThemeTab() {
  const s = useThemeSettingsStore();

  return (
    <>
      {/* Theme Mode */}
      <Section title="THEME MODE">
        <div className="tos-tp__mode-grid">
          {(['light', 'dark', 'system', 'time-based'] as ThemeMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              className={`tos-tp__mode-btn${s.themeMode === mode ? ' tos-tp__mode-btn--active' : ''}`}
              onClick={() => s.setThemeMode(mode)}
            >
              {mode === 'time-based' ? 'Time Based' : mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </Section>

      {/* Color Presets */}
      <Section title="COLOR PRESETS">
        <div className="tos-tp__preset-grid">
          {COLOR_PRESETS.map(([header, sidebar], i) => (
            <button
              key={i}
              type="button"
              className={`tos-tp__preset${s.colorPreset === i ? ' tos-tp__preset--active' : ''}`}
              onClick={() => {
                s.setColorPreset(i);
                s.setColor('headerBg', header);
                s.setColor('sidebarBg', sidebar);
                s.setColor('accentColor', header);
              }}
              aria-label={`Color preset ${i + 1}`}
            >
              <span className="tos-tp__preset-half" style={{ background: header }} />
              <span className="tos-tp__preset-half" style={{ background: sidebar }} />
            </button>
          ))}
        </div>
      </Section>

      {/* Colors */}
      <Section title="COLORS">
        <ColorRow label="Header Background" value={s.headerBg}    onChange={(v) => s.setColor('headerBg', v)} />
        <ColorRow label="Sidebar Background" value={s.sidebarBg}  onChange={(v) => s.setColor('sidebarBg', v)} />
        <ColorRow label="Sidebar Text"       value={s.sidebarText} onChange={(v) => s.setColor('sidebarText', v)} />
        <ColorRow label="Accent Color"       value={s.accentColor} onChange={(v) => s.setColor('accentColor', v)} />
        <ColorRow label="Icon Color"         value={s.iconColor}   onChange={(v) => s.setColor('iconColor', v)} />
      </Section>

      {/* Appearance */}
      <Section title="APPEARANCE">
        <SelectRow
          label="Font Family"
          value={s.fontFamily}
          options={FONT_FAMILIES.map((f) => ({ label: f, value: f }))}
          onChange={s.setFontFamily}
        />
        <SelectRow
          label="Font Weight"
          value={s.fontWeight}
          options={FONT_WEIGHTS}
          onChange={s.setFontWeight}
        />
        <SliderRow label={`Font Size (${s.fontSize}px)`} value={s.fontSize} min={10} max={20} onChange={s.setFontSize} />
        <SliderRow label={`Zoom (${s.zoom}%)`}           value={s.zoom}     min={70}  max={130} onChange={s.setZoom} />
      </Section>
    </>
  );
}

// ─── ThemeSettingsPanel ────────────────────────────────────────────────────────

export function ThemeSettingsPanel({ open, onClose }: ThemeSettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<'layout' | 'theme'>('layout');
  const panelRef = useRef<HTMLDivElement>(null);
  const s = useThemeSettingsStore();

  /* ── Close on outside click ── */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  /* ── Close on Escape ── */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  /* ── Apply theme to DOM whenever settings change ── */
  useEffect(() => {
    const root = document.documentElement;

    // Colors
    root.style.setProperty('--tos-header-bg',         s.headerBg);
    root.style.setProperty('--tos-sidebar-bg-color',  s.sidebarBg);
    root.style.setProperty('--tos-color-primary',     s.accentColor);
    root.style.setProperty('--tos-color-primary-dark',s.accentColor);
    root.style.setProperty('--tos-sidebar-text',      s.sidebarText);
    root.style.setProperty('--tos-icon',              s.iconColor);

    // Typography
    root.style.setProperty('--tos-font-family-base', `${s.fontFamily}, sans-serif`);
    root.style.setProperty('--tos-font-weight-base', s.fontWeight);
    root.style.fontSize = `${s.fontSize}px`;

    // Zoom — applied to layout container via CSS var
    root.style.setProperty('--tos-app-zoom', `${s.zoom / 100}`);

    // App background — real photo
    if (s.appBgIndex >= 0) {
      const imgUrl = BG_OPTIONS[s.appBgIndex]?.full ?? '';
      document.body.style.backgroundImage      = `url(${imgUrl})`;
      document.body.style.backgroundSize       = 'cover';
      document.body.style.backgroundPosition   = 'center';
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.backgroundRepeat     = 'no-repeat';
      root.style.setProperty('--tos-app-bg-opacity', String(s.appBgOpacity / 100));
    } else {
      document.body.style.backgroundImage      = '';
      document.body.style.backgroundSize       = '';
      document.body.style.backgroundPosition   = '';
      document.body.style.backgroundAttachment = '';
      document.body.style.backgroundRepeat     = '';
      root.style.setProperty('--tos-app-bg-opacity', '1');
    }

    // Sidebar background — real photo
    if (s.sidebarBgIndex >= 0) {
      const imgUrl = BG_OPTIONS[s.sidebarBgIndex]?.full ?? '';
      root.style.setProperty('--tos-sidebar-bg-image',   `url(${imgUrl})`);
      root.style.setProperty('--tos-sidebar-bg-opacity', String(s.sidebarBgOpacity / 100));
    } else {
      root.style.setProperty('--tos-sidebar-bg-image',   'none');
      root.style.setProperty('--tos-sidebar-bg-opacity', '1');
    }

    // Dark mode
    const scheme =
      s.themeMode === 'dark' ? 'dark'
      : s.themeMode === 'system' && typeof window !== 'undefined'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : 'light';
    root.setAttribute('data-coreui-theme', scheme);

  }, [s.headerBg, s.sidebarBg, s.accentColor, s.sidebarText, s.iconColor,
      s.fontFamily, s.fontWeight, s.fontSize, s.zoom, s.themeMode,
      s.appBgIndex, s.appBgOpacity, s.sidebarBgIndex, s.sidebarBgOpacity]);

  const handleReset = useCallback(() => {
    s.resetToDefault();
  }, [s]);

  return (
    <>
      {/* Backdrop — subtle darkening */}
      {open && (
        <div className="tos-tp__backdrop" onClick={onClose} aria-hidden />
      )}

      {/* Sliding panel */}
      <div
        ref={panelRef}
        className={`tos-tp${open ? ' tos-tp--open' : ''}`}
        role="dialog"
        aria-label="Theme Settings"
        aria-modal="true"
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="tos-tp__head">
          <span className="tos-tp__title">Theme Settings</span>
          <button type="button" className="tos-tp__close" onClick={onClose} aria-label="Close theme settings">
            <Icon name="X" size={18} aria-hidden />
          </button>
        </div>

        {/* Tabs */}
        <div className="tos-tp__tabs" role="tablist">
          <button
            role="tab"
            type="button"
            aria-selected={activeTab === 'layout'}
            className={`tos-tp__tab${activeTab === 'layout' ? ' tos-tp__tab--active' : ''}`}
            onClick={() => setActiveTab('layout')}
          >
            Layout
          </button>
          <button
            role="tab"
            type="button"
            aria-selected={activeTab === 'theme'}
            className={`tos-tp__tab${activeTab === 'theme' ? ' tos-tp__tab--active' : ''}`}
            onClick={() => setActiveTab('theme')}
          >
            Theme
          </button>
        </div>

        {/* Scrollable body */}
        <div className="tos-tp__body">
          {activeTab === 'layout' ? <LayoutTab /> : <ThemeTab />}
        </div>

        {/* Footer */}
        <div className="tos-tp__foot">
          <button type="button" className="tos-tp__reset" onClick={handleReset}>
            🌴 Reset to Default
          </button>
        </div>
      </div>
    </>
  );
}
