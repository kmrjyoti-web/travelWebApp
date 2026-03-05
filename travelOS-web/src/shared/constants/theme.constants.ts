// Extracted from UI-KIT ThemeSettings.tsx — all 14 color presets
export const COLOR_PRESETS: Array<{ header: string; sidebar: string; label: string }> = [
  { header: '#0f4c75', sidebar: '#3282b8', label: 'Blue' },
  { header: '#1a237e', sidebar: '#3949ab', label: 'Indigo' },
  { header: '#1b5e20', sidebar: '#43a047', label: 'Green' },
  { header: '#b71c1c', sidebar: '#e53935', label: 'Red' },
  { header: '#4a148c', sidebar: '#8e24aa', label: 'Purple' },
  { header: '#01579b', sidebar: '#039be5', label: 'Cyan' },
  { header: '#263238', sidebar: '#546e7a', label: 'Gray' },
  { header: '#e65100', sidebar: '#fb8c00', label: 'Orange' },
  { header: '#1b6563', sidebar: '#222d32', label: 'Teal (Default)' },
  { header: '#880e4f', sidebar: '#d81b60', label: 'Pink' },
  { header: '#000000', sidebar: '#212121', label: 'Black' },
  { header: '#3e2723', sidebar: '#6d4c41', label: 'Brown' },
  { header: '#006064', sidebar: '#00acc1', label: 'Teal Alt' },
  { header: '#212121', sidebar: '#ffb300', label: 'Amber' },
];

// Extracted from UI-KIT ThemeSettings.tsx — background options
export const BACKGROUNDS: Array<{ label: string; value: string; preview?: string }> = [
  { label: 'None', value: 'none' },
  { label: 'White', value: '#ffffff' },
  { label: 'Space', value: 'https://picsum.photos/seed/space/800/600', preview: 'https://picsum.photos/seed/space/100/75' },
  { label: 'Abstract', value: 'https://picsum.photos/seed/abstract/800/600', preview: 'https://picsum.photos/seed/abstract/100/75' },
  { label: 'Mountains', value: 'https://picsum.photos/seed/mountains/800/600', preview: 'https://picsum.photos/seed/mountains/100/75' },
  { label: 'Ocean', value: 'https://picsum.photos/seed/ocean/800/600', preview: 'https://picsum.photos/seed/ocean/100/75' },
  { label: 'City', value: 'https://picsum.photos/seed/city/800/600', preview: 'https://picsum.photos/seed/city/100/75' },
  { label: 'Night', value: 'https://picsum.photos/seed/night/800/600', preview: 'https://picsum.photos/seed/night/100/75' },
  { label: 'Paint', value: 'https://picsum.photos/seed/paint/800/600', preview: 'https://picsum.photos/seed/paint/100/75' },
  { label: 'Texture', value: 'https://picsum.photos/seed/texture/800/600', preview: 'https://picsum.photos/seed/texture/100/75' },
  { label: 'Dark', value: 'https://picsum.photos/seed/dark/800/600', preview: 'https://picsum.photos/seed/dark/100/75' },
];

// Font options (from UI-KIT ThemeSettings appearance section)
export const FONT_OPTIONS = [
  { value: 'Inter, -apple-system, sans-serif', label: 'Inter' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans' },
  { value: 'system-ui, sans-serif', label: 'System UI' },
];

export const FONT_WEIGHT_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'bold', label: 'Bold' },
];

// Default theme values (from UI-KIT ThemeProvider defaultTheme)
export const DEFAULT_THEME = {
  themeMode: 'light' as const,
  isDarkMode: false,
  headerBg: '#1b6563',
  sidebarBg: '#222d32',
  sidebarText: '#d1d5db',
  accentColor: '#1b6563',
  iconColor: '#9ca3af',
  fontFamily: 'Inter, -apple-system, sans-serif',
  fontWeight: 'normal',
  fontSize: 14,
  zoom: 100,
  background: 'none',
  bgOpacity: 100,
  sidebarBgImage: 'none',
  sidebarBgOpacity: 80,
  fullPageBg: false,
  cardBgMode: 'background' as const,
  cardBgOpacity: 80,
  menuOrientation: 'vertical' as const,
  layoutWidth: 'fluid' as const,
  sidebarPosition: 'left' as const,
  activeLayout: 'default' as const,
  isSettingsOpen: false,
  isSidebarOpen: true,
  isSidebarHovered: false,
  isShortcutsModalOpen: false,
};
