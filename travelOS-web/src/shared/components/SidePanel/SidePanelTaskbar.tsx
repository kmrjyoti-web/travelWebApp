'use client';
import React, { useState } from 'react';
import { Button } from '@/shared/components/Button';
import { Icon } from '@/shared/components/Icon';
import { useSidePanelStore } from './useSidePanelStore';

/**
 * Fixed bottom taskbar showing minimized panels as Windows-style chips.
 * Clicking a chip shows a hover preview; clicking restore opens the panel.
 * Render this ONCE in the root layout.
 *
 * @example
 *   // (dashboard)/layout.tsx
 *   <SidePanelTaskbar />
 */
export function SidePanelTaskbar() {
  const panels        = useSidePanelStore((s) => s.panels);
  const setPanelState = useSidePanelStore((s) => s.setPanelState);
  const closePanel    = useSidePanelStore((s) => s.closePanel);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const minimized = Object.values(panels).filter((p) => p.state === 'minimized');
  if (minimized.length === 0) return null;

  return (
    <div className="sp-taskbar" role="region" aria-label="Minimized panels">
      {minimized.map((panel) => {
        const id     = panel.config.id;
        const active = previewId === id;

        return (
          <div key={id} className="sp-taskbar__wrapper">
            {/* Windows-style hover preview popup */}
            {active && (
              <div
                className="sp-taskbar__preview"
                onClick={() => { setPanelState(id, 'normal'); setPreviewId(null); }}
              >
                <div className="sp-taskbar__preview-header">
                  <span className="sp-taskbar__preview-title">{panel.config.title}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="sp-taskbar__preview-close"
                    title="Close"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      closePanel(id);
                      setPreviewId(null);
                    }}
                  >
                    <Icon name="X" size={12} aria-hidden />
                  </Button>
                </div>
                <div className="sp-taskbar__preview-body">
                  <div className="sp-taskbar__preview-content">
                    {panel.config.content}
                  </div>
                </div>
              </div>
            )}

            {/* Minimized tab chip */}
            <div className={`sp-taskbar__tab${active ? ' sp-taskbar__tab--active' : ''}`}>
              <div
                className="sp-taskbar__tab-main"
                onClick={() => setPreviewId(active ? null : id)}
              >
                <Icon name="PanelRight" size={13} style={{ flexShrink: 0, color: '#9ca3af' }} aria-hidden />
                <span className="sp-taskbar__tab-label">{panel.config.title}</span>

                <div className="sp-taskbar__tab-actions" onClick={(e) => e.stopPropagation()}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="sp-taskbar__tab-btn"
                    title="Restore"
                    onClick={() => { setPanelState(id, 'normal'); setPreviewId(null); }}
                  >
                    <Icon name="Maximize2" size={14} aria-hidden />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="sp-taskbar__tab-btn sp-taskbar__tab-btn--close"
                    title="Close"
                    onClick={() => { closePanel(id); setPreviewId(null); }}
                  >
                    <Icon name="X" size={14} aria-hidden />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
