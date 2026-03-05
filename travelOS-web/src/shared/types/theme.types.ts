export type ThemeMode = 'light' | 'dark' | 'system' | 'time';
export type MenuOrientation = 'vertical' | 'horizontal';
export type LayoutWidth = 'fluid' | 'boxed';
export type SidebarPosition = 'left' | 'right';
export type LayoutVariant = 'default' | 'horizontal' | 'boxed' | 'minimal';
export type CardBgMode = 'background' | 'child';

export interface ThemeState {
  // Mode
  themeMode: ThemeMode;
  isDarkMode: boolean;

  // Colors (mapped from UI-KIT ThemeProvider defaults)
  headerBg: string;
  sidebarBg: string;
  sidebarText: string;
  accentColor: string;
  iconColor: string;

  // Typography
  fontFamily: string;
  fontWeight: string;
  fontSize: number;
  zoom: number;

  // Background (mapped from UI-KIT background system)
  background: string;
  bgOpacity: number;
  sidebarBgImage: string;
  sidebarBgOpacity: number;
  fullPageBg: boolean;

  // Card
  cardBgMode: CardBgMode;
  cardBgOpacity: number;

  // Layout
  menuOrientation: MenuOrientation;
  layoutWidth: LayoutWidth;
  sidebarPosition: SidebarPosition;
  activeLayout: LayoutVariant;

  // UI State
  isSettingsOpen: boolean;
  isSidebarOpen: boolean;
  isSidebarHovered: boolean;
  isShortcutsModalOpen: boolean;
}

export interface ThemeActions {
  updateTheme: (updates: Partial<ThemeState>) => void;
  resetTheme: () => void;
  toggleSettings: () => void;
  toggleSidebar: () => void;
  setSidebarHovered: (hovered: boolean) => void;
  setDarkMode: (isDark: boolean) => void;
  toggleShortcutsModal: () => void;
}

export type UIStore = ThemeState & ThemeActions;
