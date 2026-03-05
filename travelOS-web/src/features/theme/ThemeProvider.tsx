"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ThemeState = {
  headerBg: string;
  sidebarBg: string;
  sidebarText: string;
  accentColor: string;
  iconColor: string;
  fontFamily: string;
  fontWeight: string;
  fontSize: number;
  zoom: number;
  background: string;
  bgOpacity: number;
  sidebarBgImage: string;
  sidebarBgOpacity: number;
  fullPageBg: boolean;
  menuOrientation: "vertical" | "horizontal";
  layoutWidth: "fluid" | "boxed";
  sidebarPosition: "left" | "right";
  themeMode: "light" | "dark" | "system" | "time";
  cardBgMode: "solid" | "child";
  cardBgOpacity: number;
};

const defaultTheme: ThemeState = {
  headerBg: "#1b6563",
  sidebarBg: "#222d32",
  sidebarText: "#d1d5db",
  accentColor: "#1b6563",
  iconColor: "#9ca3af",
  fontFamily: "Inter, sans-serif",
  fontWeight: "normal",
  fontSize: 14,
  zoom: 100,
  background: "none",
  bgOpacity: 100,
  sidebarBgImage: "none",
  sidebarBgOpacity: 80,
  fullPageBg: false,
  menuOrientation: "vertical",
  layoutWidth: "fluid",
  sidebarPosition: "left",
  themeMode: "light",
  cardBgMode: "solid",
  cardBgOpacity: 100,
};

type ThemeContextType = {
  theme: ThemeState;
  updateTheme: (updates: Partial<ThemeState>) => void;
  resetTheme: () => void;
  isSettingsOpen: boolean;
  toggleSettings: () => void;
  isDarkMode: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function UIKitThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeState>(defaultTheme);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme");
    if (savedTheme) {
      try {
        setTheme({ ...defaultTheme, ...JSON.parse(savedTheme) });
      } catch (e) {
        console.error("Failed to parse theme", e);
      }
    }
  }, []);

  // Handle dark mode logic
  useEffect(() => {
    const applyDarkMode = (isDark: boolean) => {
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-coreui-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-coreui-theme', 'light');
      }
    };

    if (theme.themeMode === 'dark') {
      applyDarkMode(true);
    } else if (theme.themeMode === 'light') {
      applyDarkMode(false);
    } else if (theme.themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyDarkMode(mediaQuery.matches);

      const listener = (e: MediaQueryListEvent) => applyDarkMode(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else if (theme.themeMode === 'time') {
      const checkTime = () => {
        const hour = new Date().getHours();
        applyDarkMode(hour >= 18 || hour < 6);
      };
      checkTime();
      const interval = setInterval(checkTime, 60000);
      return () => clearInterval(interval);
    }
  }, [theme.themeMode]);

  // Save to local storage + apply CSS variables
  useEffect(() => {
    localStorage.setItem("app-theme", JSON.stringify(theme));

    const root = document.documentElement;
    // UIKitMain variables
    root.style.setProperty("--header-bg", theme.headerBg);
    root.style.setProperty("--sidebar-bg", theme.sidebarBg);
    root.style.setProperty("--sidebar-text", theme.sidebarText);
    root.style.setProperty("--accent-color", theme.accentColor);
    root.style.setProperty("--icon-color", theme.iconColor);
    root.style.setProperty("--font-family", theme.fontFamily);
    root.style.setProperty("--font-weight", theme.fontWeight);
    root.style.setProperty("--font-size", `${theme.fontSize}px`);
    root.style.setProperty("--zoom", `${theme.zoom / 100}`);
    root.style.setProperty("--app-bg-opacity", `${theme.bgOpacity / 100}`);
    root.style.setProperty("--sidebar-bg-opacity", `${theme.sidebarBgOpacity / 100}`);

    // Also sync to --tos-* tokens for CoreUI components
    root.style.setProperty("--tos-header-bg", theme.headerBg);
    root.style.setProperty("--tos-sidebar-bg", theme.sidebarBg);
    root.style.setProperty("--tos-sidebar-text", theme.sidebarText);
    root.style.setProperty("--tos-accent", theme.accentColor);
    root.style.setProperty("--tos-icon-color", theme.iconColor);
    root.style.setProperty("--tos-font-family", theme.fontFamily);
    root.style.setProperty("--tos-font-weight", theme.fontWeight);
    root.style.setProperty("--tos-font-size", `${theme.fontSize}px`);
    root.style.setProperty("--tos-zoom", `${theme.zoom / 100}`);
    root.style.setProperty("--tos-app-bg-opacity", `${theme.bgOpacity / 100}`);
    root.style.setProperty("--tos-sidebar-bg-opacity", `${theme.sidebarBgOpacity / 100}`);

    // Card background mode
    if (theme.cardBgMode === 'child') {
      root.setAttribute('data-card-bg', 'child');
      root.style.setProperty("--tos-card-bg-opacity", `${theme.cardBgOpacity / 100}`);
    } else {
      root.removeAttribute('data-card-bg');
      root.style.setProperty("--tos-card-bg-opacity", "1");
    }

    if (theme.background !== "none") {
      if (theme.background.startsWith("http") || theme.background.startsWith("/")) {
        root.style.setProperty("--app-bg-image", `url(${theme.background})`);
        root.style.setProperty("--app-bg-color", "transparent");
        root.style.setProperty("--tos-app-bg-image", `url(${theme.background})`);
        root.style.setProperty("--tos-app-bg-color", "transparent");
      } else {
        root.style.setProperty("--app-bg-image", "none");
        root.style.setProperty("--app-bg-color", theme.background);
        root.style.setProperty("--tos-app-bg-image", "none");
        root.style.setProperty("--tos-app-bg-color", theme.background);
      }
    } else {
      root.style.setProperty("--app-bg-image", "none");
      root.style.setProperty("--app-bg-color", isDarkMode ? "#111827" : "#eef2f5");
      root.style.setProperty("--tos-app-bg-image", "none");
      root.style.setProperty("--tos-app-bg-color", isDarkMode ? "#111827" : "#eef2f5");
    }

    // Tooltip colors for recharts
    root.style.setProperty("--tooltip-bg", isDarkMode ? "#1f2937" : "#ffffff");
    root.style.setProperty("--tooltip-text", isDarkMode ? "#f3f4f6" : "#111827");

    if (theme.sidebarBgImage !== "none") {
      root.style.setProperty("--sidebar-bg-image", `url(${theme.sidebarBgImage})`);
      root.style.setProperty("--tos-sidebar-bg-image", `url(${theme.sidebarBgImage})`);
    } else {
      root.style.setProperty("--sidebar-bg-image", "none");
      root.style.setProperty("--tos-sidebar-bg-image", "none");
    }
  }, [theme, isDarkMode]);

  const updateTheme = (updates: Partial<ThemeState>) => {
    setTheme((prev) => ({ ...prev, ...updates }));
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
  };

  const toggleSettings = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, updateTheme, resetTheme, isSettingsOpen, toggleSettings, isDarkMode }}
    >
      <div
        style={{
          fontFamily: theme.fontFamily,
          fontWeight: theme.fontWeight === "bold" ? 700 : 400,
          fontSize: `${theme.fontSize}px`,
          zoom: `${theme.zoom}%`,
        }}
        className="h-full w-full"
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useUIKitTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useUIKitTheme must be used within a UIKitThemeProvider");
  }
  return context;
}
