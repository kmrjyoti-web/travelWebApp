'use client';
import { useEffect } from 'react';
import { useUIStore } from '@/shared/stores/ui.store';

/**
 * Subscribes to Zustand UI store and syncs --tos-* CSS custom properties + CoreUI dark mode
 * to the DOM. Adapted from UI-KIT ThemeProvider.tsx useEffect blocks.
 * Mount this once in ThemeProvider.
 */
export function useThemeSync() {
  const theme = useUIStore();

  // Apply CSS custom properties to :root (adapted from ThemeProvider lines 110-148)
  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty('--tos-header-bg', theme.headerBg);
    root.style.setProperty('--tos-sidebar-bg', theme.sidebarBg);
    root.style.setProperty('--tos-sidebar-text', theme.sidebarText);
    root.style.setProperty('--tos-accent', theme.accentColor);
    root.style.setProperty('--tos-accent-hover', theme.accentColor);
    root.style.setProperty('--tos-icon-color', theme.iconColor);
    root.style.setProperty('--tos-font-family', theme.fontFamily);
    root.style.setProperty('--tos-font-weight', theme.fontWeight === 'bold' ? '700' : '400');
    root.style.setProperty('--tos-font-size', `${theme.fontSize}px`);
    root.style.setProperty('--tos-zoom', `${theme.zoom / 100}`);
    root.style.setProperty('--tos-app-bg-opacity', `${theme.bgOpacity / 100}`);
    root.style.setProperty('--tos-sidebar-bg-opacity', `${theme.sidebarBgOpacity / 100}`);

    // Background image (adapted from ThemeProvider background logic)
    if (theme.background === 'none') {
      root.style.setProperty('--tos-app-bg-image', 'none');
      root.style.setProperty('--tos-app-bg-color', '#eef2f5');
    } else if (theme.background.startsWith('#')) {
      root.style.setProperty('--tos-app-bg-image', 'none');
      root.style.setProperty('--tos-app-bg-color', theme.background);
    } else {
      root.style.setProperty('--tos-app-bg-image', `url(${theme.background})`);
    }

    // Card background mode + opacity
    // 'background' = cards solid (wallpaper only behind cards)
    // 'child' = cards also transparent with adjustable opacity
    if (theme.cardBgMode === 'child') {
      root.setAttribute('data-card-bg', 'child');
      root.style.setProperty('--tos-card-bg-opacity', `${theme.cardBgOpacity / 100}`);
    } else {
      root.removeAttribute('data-card-bg');
      root.style.removeProperty('--tos-card-bg-opacity');
    }

    // Sidebar background
    if (theme.sidebarBgImage === 'none') {
      root.style.setProperty('--tos-sidebar-bg-image', 'none');
    } else if (theme.sidebarBgImage.startsWith('#')) {
      root.style.setProperty('--tos-sidebar-bg', theme.sidebarBgImage);
      root.style.setProperty('--tos-sidebar-bg-image', 'none');
    } else {
      root.style.setProperty('--tos-sidebar-bg-image', `url(${theme.sidebarBgImage})`);
    }
  }, [
    theme.headerBg,
    theme.sidebarBg,
    theme.sidebarText,
    theme.accentColor,
    theme.iconColor,
    theme.fontFamily,
    theme.fontWeight,
    theme.fontSize,
    theme.zoom,
    theme.bgOpacity,
    theme.sidebarBgOpacity,
    theme.background,
    theme.sidebarBgImage,
    theme.cardBgMode,
    theme.cardBgOpacity,
  ]);

  // Dark mode logic (adapted from ThemeProvider lines 76-107)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    const applyDarkMode = (isDark: boolean) => {
      theme.setDarkMode(isDark);
      document.documentElement.setAttribute(
        'data-coreui-theme',
        isDark ? 'dark' : 'light'
      );
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      switch (theme.themeMode) {
        case 'light':
          applyDarkMode(false);
          break;
        case 'dark':
          applyDarkMode(true);
          break;
        case 'system':
          applyDarkMode(mediaQuery.matches);
          break;
        case 'time': {
          const hour = new Date().getHours();
          applyDarkMode(hour >= 18 || hour < 6);
          break;
        }
      }
    };

    applyTheme();

    if (theme.themeMode === 'system') {
      mediaQuery.addEventListener('change', applyTheme);
    }

    if (theme.themeMode === 'time') {
      interval = setInterval(applyTheme, 60_000); // Check every minute
    }

    return () => {
      mediaQuery.removeEventListener('change', applyTheme);
      if (interval) clearInterval(interval);
    };
  }, [theme.themeMode]); // eslint-disable-line react-hooks/exhaustive-deps
}
