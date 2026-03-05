import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type ThemeMode     = 'light' | 'dark' | 'system' | 'time-based';
export type MenuOrient    = 'vertical' | 'horizontal';
export type LayoutWidth   = 'fluid' | 'boxed';
export type SidebarPos    = 'left' | 'right';

export interface ThemeSettings {
  themeMode:        ThemeMode;
  colorPreset:      number;
  headerBg:         string;
  sidebarBg:        string;
  sidebarText:      string;
  accentColor:      string;
  iconColor:        string;
  fontFamily:       string;
  fontWeight:       string;
  fontSize:         number;
  zoom:             number;
  appBgIndex:       number;   // -1 = none, 0–7 = gradient index
  appBgOpacity:     number;   // 10–100
  sidebarBgIndex:   number;   // -1 = none, 0–7 = gradient index
  sidebarBgOpacity: number;
  menuOrientation:  MenuOrient;
  layoutWidth:      LayoutWidth;
  sidebarPosition:  SidebarPos;
}

// ─── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULT: ThemeSettings = {
  themeMode:        'light',
  colorPreset:      1,
  headerBg:         '#1B4F72',
  sidebarBg:        '#1B1F6B',
  sidebarText:      '#cccccc',
  accentColor:      '#1B4F72',
  iconColor:        '#aaaaaa',
  fontFamily:       'Roboto',
  fontWeight:       'normal',
  fontSize:         14,
  zoom:             100,
  appBgIndex:       -1,
  appBgOpacity:     100,
  sidebarBgIndex:   -1,
  sidebarBgOpacity: 100,
  menuOrientation:  'vertical',
  layoutWidth:      'fluid',
  sidebarPosition:  'left',
};

// ─── Store ─────────────────────────────────────────────────────────────────────

type ColorKey = 'headerBg' | 'sidebarBg' | 'sidebarText' | 'accentColor' | 'iconColor';

interface ThemeSettingsStore extends ThemeSettings {
  setThemeMode:        (v: ThemeMode)   => void;
  setColorPreset:      (i: number)      => void;
  setColor:            (k: ColorKey, v: string) => void;
  setFontFamily:       (v: string)      => void;
  setFontWeight:       (v: string)      => void;
  setFontSize:         (v: number)      => void;
  setZoom:             (v: number)      => void;
  setAppBgIndex:       (v: number)      => void;
  setAppBgOpacity:     (v: number)      => void;
  setSidebarBgIndex:   (v: number)      => void;
  setSidebarBgOpacity: (v: number)      => void;
  setMenuOrientation:  (v: MenuOrient)  => void;
  setLayoutWidth:      (v: LayoutWidth) => void;
  setSidebarPosition:  (v: SidebarPos) => void;
  resetToDefault:      () => void;
}

export const useThemeSettingsStore = create<ThemeSettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT,
      setThemeMode:        (themeMode)        => set({ themeMode }),
      setColorPreset:      (colorPreset)      => set({ colorPreset }),
      setColor:            (k, v)             => set({ [k]: v } as Pick<ThemeSettings, ColorKey>),
      setFontFamily:       (fontFamily)       => set({ fontFamily }),
      setFontWeight:       (fontWeight)       => set({ fontWeight }),
      setFontSize:         (fontSize)         => set({ fontSize }),
      setZoom:             (zoom)             => set({ zoom }),
      setAppBgIndex:       (appBgIndex)       => set({ appBgIndex }),
      setAppBgOpacity:     (appBgOpacity)     => set({ appBgOpacity }),
      setSidebarBgIndex:   (sidebarBgIndex)   => set({ sidebarBgIndex }),
      setSidebarBgOpacity: (sidebarBgOpacity) => set({ sidebarBgOpacity }),
      setMenuOrientation:  (menuOrientation)  => set({ menuOrientation }),
      setLayoutWidth:      (layoutWidth)      => set({ layoutWidth }),
      setSidebarPosition:  (sidebarPosition)  => set({ sidebarPosition }),
      resetToDefault:      ()                 => set(DEFAULT),
    }),
    { name: 'tos-theme-settings' },
  ),
);
