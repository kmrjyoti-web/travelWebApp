import { create } from 'zustand';
import type { PanelConfig, PanelInstance, PanelState } from './types';

const BASE_Z = 1050;

interface SidePanelStore {
  panels: Record<string, PanelInstance>;
  /** Open a new panel or re-open an existing one by id */
  openPanel: (config: PanelConfig) => void;
  /** Permanently close and remove a panel */
  closePanel: (id: string) => void;
  /** Set panel state (normal | minimized | maximized | fullscreen) */
  setPanelState: (id: string, state: PanelState) => void;
  /** Bring panel to the front of the z-index stack */
  bringToFront: (id: string) => void;
}

export const useSidePanelStore = create<SidePanelStore>((set, get) => ({
  panels: {},

  openPanel: (config) =>
    set((s) => {
      const existing = s.panels[config.id];
      if (existing) {
        // Re-open: restore to normal and update config
        return {
          panels: {
            ...s.panels,
            [config.id]: { ...existing, config, state: 'normal' },
          },
        };
      }
      const maxZ = Object.values(s.panels).reduce(
        (max, p) => Math.max(max, p.zIndex),
        BASE_Z,
      );
      return {
        panels: {
          ...s.panels,
          [config.id]: { config, state: 'normal', zIndex: maxZ + 1 },
        },
      };
    }),

  closePanel: (id) =>
    set((s) => {
      const next = { ...s.panels };
      delete next[id];
      return { panels: next };
    }),

  setPanelState: (id, state) =>
    set((s) => {
      if (!s.panels[id]) return s;
      return {
        panels: {
          ...s.panels,
          [id]: { ...s.panels[id], state },
        },
      };
    }),

  bringToFront: (id) =>
    set((s) => {
      if (!s.panels[id]) return s;
      const maxZ = Object.values(s.panels).reduce(
        (max, p) => Math.max(max, p.zIndex),
        BASE_Z,
      );
      return {
        panels: {
          ...s.panels,
          [id]: { ...s.panels[id], zIndex: maxZ + 1 },
        },
      };
    }),
}));
