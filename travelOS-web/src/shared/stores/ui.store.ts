import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UIStore } from '@/shared/types/theme.types';
import { DEFAULT_THEME } from '@/shared/constants/theme.constants';

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      ...DEFAULT_THEME,

      updateTheme: (updates) => set((state) => ({ ...state, ...updates })),

      resetTheme: () =>
        set({
          ...DEFAULT_THEME,
          // Preserve UI-only state
          isSettingsOpen: false,
          isSidebarOpen: true,
          isSidebarHovered: false,
          isShortcutsModalOpen: false,
        }),

      toggleSettings: () => set((s) => ({ isSettingsOpen: !s.isSettingsOpen })),

      toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),

      setSidebarHovered: (hovered) => set({ isSidebarHovered: hovered }),

      setDarkMode: (isDark) => set({ isDarkMode: isDark }),

      toggleShortcutsModal: () =>
        set((s) => ({ isShortcutsModalOpen: !s.isShortcutsModalOpen })),
    }),
    {
      name: 'tos-ui-store',
      // Only persist theme settings, not transient UI state
      partialize: (state) => ({
        themeMode: state.themeMode,
        headerBg: state.headerBg,
        sidebarBg: state.sidebarBg,
        sidebarText: state.sidebarText,
        accentColor: state.accentColor,
        iconColor: state.iconColor,
        fontFamily: state.fontFamily,
        fontWeight: state.fontWeight,
        fontSize: state.fontSize,
        zoom: state.zoom,
        background: state.background,
        bgOpacity: state.bgOpacity,
        sidebarBgImage: state.sidebarBgImage,
        sidebarBgOpacity: state.sidebarBgOpacity,
        fullPageBg: state.fullPageBg,
        cardBgMode: state.cardBgMode,
        cardBgOpacity: state.cardBgOpacity,
        menuOrientation: state.menuOrientation,
        layoutWidth: state.layoutWidth,
        sidebarPosition: state.sidebarPosition,
        activeLayout: state.activeLayout,
        isSidebarOpen: state.isSidebarOpen,
      }),
    }
  )
);
