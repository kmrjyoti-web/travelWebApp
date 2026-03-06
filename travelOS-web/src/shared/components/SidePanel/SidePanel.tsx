'use client';
import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/shared/components/Button';
import { Spinner } from '@/shared/components/Spinner';
import { Icon } from '@/shared/components/Icon';
import { useSidePanelStore } from './useSidePanelStore';
import type { PanelInstance, ActionButton } from './types';
import './SidePanel.css';

// ─── Action button renderer ────────────────────────────────────────────────────
function ActionBtn({ btn }: { btn: ActionButton }) {
  const showAs = btn.showAs ?? (btn.icon && btn.label ? 'both' : btn.icon ? 'icon' : 'text');
  const coreColor = btn.variant === 'primary'   ? 'primary'
                  : btn.variant === 'danger'    ? 'danger'
                  : btn.variant === 'ghost'     ? 'secondary'
                  : 'secondary';
  const coreVariant = btn.variant === 'ghost' ? 'ghost' : undefined;

  return (
    <Button
      type={btn.type ?? 'button'}
      form={btn.form}
      color={coreColor}
      variant={coreVariant as 'outline' | 'ghost' | undefined}
      size="sm"
      disabled={btn.disabled || btn.loading}
      onClick={btn.onClick}
      className="sp-btn"
      title={showAs === 'icon' ? btn.label : undefined}
    >
      {btn.loading && <Spinner size="sm" />}
      {!btn.loading && (showAs === 'icon' || showAs === 'both') && btn.icon && (
        <Icon name={btn.icon} size={15} aria-hidden />
      )}
      {(showAs === 'text' || showAs === 'both') && btn.label && (
        <span>{btn.label}</span>
      )}
    </Button>
  );
}

// ─── Window control button ─────────────────────────────────────────────────────
function WinBtn({
  icon,
  title,
  onClick,
  danger,
}: {
  icon: React.ComponentProps<typeof Icon>['name'];
  title: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={`sp-header__btn${danger ? ' sp-header__btn--close' : ''}`}
      onClick={onClick}
      title={title}
    >
      <Icon name={icon} size={16} aria-hidden />
    </Button>
  );
}

// ─── Single panel ──────────────────────────────────────────────────────────────
function PanelEl({ panel }: { panel: PanelInstance }) {
  const { config, state, zIndex } = panel;
  const panelRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const setPanelState = useSidePanelStore((s) => s.setPanelState);
  const closePanel    = useSidePanelStore((s) => s.closePanel);
  const bringToFront  = useSidePanelStore((s) => s.bringToFront);

  const isMaximized  = state === 'maximized';
  const isFullscreen = state === 'fullscreen';

  // Escape key closes top-most open panel
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const all = Object.values(useSidePanelStore.getState().panels).filter(
        (p) => p.state !== 'minimized',
      );
      if (all.length === 0) return;
      const top = all.reduce((a, b) => (a.zIndex > b.zIndex ? a : b));
      if (top.config.id === config.id) closePanel(config.id);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [config.id, closePanel]);

  // Clear entry animation flag
  useEffect(() => {
    if (isFirstRender.current) isFirstRender.current = false;
  }, []);

  if (state === 'minimized') return null;

  const widthStyle: React.CSSProperties =
    isFullscreen || isMaximized
      ? {}
      : { width: config.width ? (typeof config.width === 'number' ? `${config.width}px` : config.width) : 600 };

  const panelClass = [
    'sp-panel',
    isFullscreen ? 'sp-panel--fullscreen sp-panel--inset' : isMaximized ? 'sp-panel--maximized' : 'sp-panel--normal',
    isFirstRender.current ? 'sp-panel--entering' : '',
  ].filter(Boolean).join(' ');

  const el = (
    <div
      ref={panelRef}
      className={panelClass}
      style={{ zIndex, ...widthStyle }}
      role="dialog"
      aria-modal="true"
      aria-label={config.title}
      onClick={() => bringToFront(config.id)}
    >
      {/* ── Header ── */}
      <div className="sp-header">
        <div className="sp-header__left">
          <h2 className="sp-header__title">{config.title}</h2>
          {config.headerButtons && config.headerButtons.length > 0 && (
            <div className="sp-header__custom-actions">
              {config.headerButtons.map((btn) => <ActionBtn key={btn.id} btn={btn} />)}
            </div>
          )}
        </div>

        <div className="sp-header__actions">
          <WinBtn icon="Minus"    title="Minimize"   onClick={() => setPanelState(config.id, 'minimized')} />
          <WinBtn
            icon={isMaximized ? 'Minimize2' : 'Maximize2'}
            title={isMaximized ? 'Restore' : 'Maximize'}
            onClick={() => setPanelState(config.id, isMaximized ? 'normal' : 'maximized')}
          />
          <WinBtn
            icon="Expand"
            title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
            onClick={() => setPanelState(config.id, isFullscreen ? 'normal' : 'fullscreen')}
          />
          {config.newTabUrl && (
            <WinBtn
              icon="ExternalLink"
              title="Open in new tab"
              onClick={() => window.open(config.newTabUrl, '_blank', 'noopener,noreferrer')}
            />
          )}
          <WinBtn icon="X" title="Close" onClick={() => closePanel(config.id)} danger />
        </div>
      </div>

      {/* ── Body ── */}
      <div className={`sp-body${config.noPadding ? ' sp-body--no-pad' : ''}`}>
        {config.content}
      </div>

      {/* ── Footer ── */}
      {config.footerButtons !== undefined && (
        <div className="sp-footer">
          {config.footerButtons.map((btn) => <ActionBtn key={btn.id} btn={btn} />)}
        </div>
      )}
    </div>
  );

  if (typeof window === 'undefined') return null;
  return createPortal(el, document.body);
}

// ─── Renderer — renders all panels from global store ──────────────────────────
export function SidePanelRenderer() {
  const panels = useSidePanelStore((s) => s.panels);
  const list   = Object.values(panels);
  if (list.length === 0) return null;
  return (
    <>
      {list.map((panel) => (
        <PanelEl key={panel.config.id} panel={panel} />
      ))}
    </>
  );
}
