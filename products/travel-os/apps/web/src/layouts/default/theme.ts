/**
 * CSS custom property names for the Default layout.
 * Values are applied by applyDefaultTheme() below.
 * Components reference these keys for type-safe token access.
 */
export const DEFAULT_THEME_VARS = {
  // Header
  headerBg: '--tos-header-bg',
  headerText: '--tos-header-text',
  headerHeight: '--tos-header-height',
  headerShadow: '--tos-header-shadow',
  headerBorderBottom: '--tos-header-border-bottom',

  // Sidebar
  sidebarBg: '--tos-sidebar-bg',
  sidebarText: '--tos-sidebar-text',
  sidebarTextMuted: '--tos-sidebar-text-muted',
  sidebarActiveText: '--tos-sidebar-active-text',
  sidebarActiveBg: '--tos-sidebar-active-bg',
  sidebarHoverBg: '--tos-sidebar-hover-bg',
  sidebarWidth: '--tos-sidebar-width',
  sidebarCollapsedWidth: '--tos-sidebar-collapsed-width',
  sidebarBorderRight: '--tos-sidebar-border-right',
  sidebarTransition: '--tos-sidebar-transition',

  // Content area
  contentBg: '--tos-content-bg',
  contentPadding: '--tos-content-padding',

  // Footer
  footerBg: '--tos-footer-bg',
  footerText: '--tos-footer-text',
  footerBorderTop: '--tos-footer-border-top',
  footerHeight: '--tos-footer-height',

  // Shadows
  shadowSm: '--tos-shadow-sm',
  shadowMd: '--tos-shadow-md',
  shadowLg: '--tos-shadow-lg',

  // Typography
  fontSizeXs: '--tos-font-size-xs',
  fontSizeSm: '--tos-font-size-sm',
  fontSizeBase: '--tos-font-size-base',
  fontSizeLg: '--tos-font-size-lg',
  fontWeightNormal: '--tos-font-weight-normal',
  fontWeightMedium: '--tos-font-weight-medium',
  fontWeightSemibold: '--tos-font-weight-semibold',

  // Spacing
  spacingXs: '--tos-spacing-xs',
  spacingSm: '--tos-spacing-sm',
  spacingMd: '--tos-spacing-md',
  spacingLg: '--tos-spacing-lg',
  spacingXl: '--tos-spacing-xl',

  // Borders
  borderRadius: '--tos-border-radius',
  borderColor: '--tos-border-color',
  borderWidth: '--tos-border-width',

  // Focus ring
  focusRing: '--tos-focus-ring',

  // Z-index
  zHeader: '--tos-z-header',
  zSidebar: '--tos-z-sidebar',
  zOverlay: '--tos-z-overlay',
  zDropdown: '--tos-z-dropdown',
} as const;

export type DefaultThemeVar = (typeof DEFAULT_THEME_VARS)[keyof typeof DEFAULT_THEME_VARS];

/** Token values for the Default layout. */
export const DEFAULT_THEME_VALUES: Record<DefaultThemeVar, string> = {
  '--tos-header-bg': '#1B4F72',
  '--tos-header-text': '#ffffff',
  '--tos-header-height': '56px',
  '--tos-header-shadow': '0 2px 4px rgba(0,0,0,0.15)',
  '--tos-header-border-bottom': 'none',

  '--tos-sidebar-bg': '#1a2332',
  '--tos-sidebar-text': '#cbd5e1',
  '--tos-sidebar-text-muted': '#64748b',
  '--tos-sidebar-active-text': '#ffffff',
  '--tos-sidebar-active-bg': '#2980B9',
  '--tos-sidebar-hover-bg': '#243447',
  '--tos-sidebar-width': '256px',
  '--tos-sidebar-collapsed-width': '64px',
  '--tos-sidebar-border-right': '1px solid #243447',
  '--tos-sidebar-transition': 'width 200ms ease',

  '--tos-content-bg': '#f0f4f8',
  '--tos-content-padding': '24px',

  '--tos-footer-bg': '#ffffff',
  '--tos-footer-text': '#64748b',
  '--tos-footer-border-top': '1px solid #e2e8f0',
  '--tos-footer-height': '48px',

  '--tos-shadow-sm': '0 1px 2px rgba(0,0,0,0.06)',
  '--tos-shadow-md': '0 4px 6px rgba(0,0,0,0.10)',
  '--tos-shadow-lg': '0 10px 15px rgba(0,0,0,0.12)',

  '--tos-font-size-xs': '0.6875rem',
  '--tos-font-size-sm': '0.75rem',
  '--tos-font-size-base': '0.875rem',
  '--tos-font-size-lg': '1rem',
  '--tos-font-weight-normal': '400',
  '--tos-font-weight-medium': '500',
  '--tos-font-weight-semibold': '600',

  '--tos-spacing-xs': '4px',
  '--tos-spacing-sm': '8px',
  '--tos-spacing-md': '16px',
  '--tos-spacing-lg': '24px',
  '--tos-spacing-xl': '32px',

  '--tos-border-radius': '6px',
  '--tos-border-color': '#e2e8f0',
  '--tos-border-width': '1px',

  '--tos-focus-ring': '0 0 0 3px rgba(41,128,185,0.4)',

  '--tos-z-header': '100',
  '--tos-z-sidebar': '90',
  '--tos-z-overlay': '200',
  '--tos-z-dropdown': '150',
};

/**
 * Injects all Default layout CSS tokens onto :root.
 * Call once on layout mount (or when switching to the default layout).
 */
export function applyDefaultTheme(): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  for (const [prop, value] of Object.entries(DEFAULT_THEME_VALUES)) {
    root.style.setProperty(prop, value);
  }
}
