/**
 * Admin layout CSS custom property names and values.
 *
 * Design intent:
 *   - Near-black dark scheme throughout (header, sidebar, content, toolbar)
 *   - Brighter accent (blue-500 #3B82F6) — stands out on dark backgrounds
 *   - Wider sidebar (280px) to accommodate longer admin menu labels
 *   - Admin toolbar adds a second header row for quick-action navigation
 *   - Status indicators use traffic-light colours (green / amber / red)
 *   - Higher contrast text (slate-200) than the default layout's slate-300
 */

export const ADMIN_THEME_VARS = {
  // Page
  pageBg: '--tos-admin-bg',

  // Header (top bar)
  headerBg: '--tos-admin-header-bg',
  headerText: '--tos-admin-header-text',
  headerHeight: '--tos-admin-header-height',
  headerBorderBottom: '--tos-admin-header-border',
  headerShadow: '--tos-admin-header-shadow',

  // Admin toolbar (secondary bar below header)
  toolbarBg: '--tos-admin-toolbar-bg',
  toolbarText: '--tos-admin-toolbar-text',
  toolbarHeight: '--tos-admin-toolbar-height',
  toolbarBorderBottom: '--tos-admin-toolbar-border',
  toolbarActiveBg: '--tos-admin-toolbar-active-bg',
  toolbarActiveText: '--tos-admin-toolbar-active-text',
  toolbarHoverBg: '--tos-admin-toolbar-hover-bg',

  // Sidebar
  sidebarBg: '--tos-admin-sidebar-bg',
  sidebarText: '--tos-admin-sidebar-text',
  sidebarTextMuted: '--tos-admin-sidebar-text-muted',
  sidebarActiveText: '--tos-admin-sidebar-active-text',
  sidebarActiveBg: '--tos-admin-sidebar-active-bg',
  sidebarHoverBg: '--tos-admin-sidebar-hover-bg',
  sidebarWidth: '--tos-admin-sidebar-width',
  sidebarCollapsedWidth: '--tos-admin-sidebar-collapsed-width',
  sidebarBorderRight: '--tos-admin-sidebar-border',
  sidebarTransition: '--tos-admin-sidebar-transition',

  // Content
  contentBg: '--tos-admin-content-bg',
  contentText: '--tos-admin-content-text',
  contentPadding: '--tos-admin-content-padding',

  // System status
  statusOperational: '--tos-admin-status-operational',
  statusDegraded: '--tos-admin-status-degraded',
  statusDown: '--tos-admin-status-down',
  statusDotSize: '--tos-admin-status-dot-size',

  // Colours
  accent: '--tos-admin-accent',
  accentHover: '--tos-admin-accent-hover',
  danger: '--tos-admin-danger',
  warning: '--tos-admin-warning',
  success: '--tos-admin-success',
  text: '--tos-admin-text',
  textMuted: '--tos-admin-text-muted',
  borderColor: '--tos-admin-border',

  // Typography
  fontSizeSm: '--tos-admin-font-size-sm',
  fontSizeBase: '--tos-admin-font-size-base',
  fontWeightMedium: '--tos-admin-font-weight-medium',
  fontWeightSemibold: '--tos-admin-font-weight-semibold',

  // Spacing
  spacingSm: '--tos-admin-spacing-sm',
  spacingMd: '--tos-admin-spacing-md',
  spacingLg: '--tos-admin-spacing-lg',

  // Borders & shadows
  borderRadius: '--tos-admin-radius',
  shadowMd: '--tos-admin-shadow-md',
  focusRing: '--tos-admin-focus-ring',

  // Z-index
  zHeader: '--tos-admin-z-header',
  zToolbar: '--tos-admin-z-toolbar',
  zSidebar: '--tos-admin-z-sidebar',
  zDropdown: '--tos-admin-z-dropdown',
} as const;

export type AdminThemeVar = (typeof ADMIN_THEME_VARS)[keyof typeof ADMIN_THEME_VARS];

export const ADMIN_THEME_VALUES: Record<AdminThemeVar, string> = {
  '--tos-admin-bg': '#0f172a',

  '--tos-admin-header-bg': '#111827',
  '--tos-admin-header-text': '#f1f5f9',
  '--tos-admin-header-height': '56px',
  '--tos-admin-header-border': '1px solid #1e293b',
  '--tos-admin-header-shadow': '0 1px 3px rgba(0,0,0,0.4)',

  '--tos-admin-toolbar-bg': '#1e293b',
  '--tos-admin-toolbar-text': '#94a3b8',
  '--tos-admin-toolbar-height': '40px',
  '--tos-admin-toolbar-border': '1px solid #334155',
  '--tos-admin-toolbar-active-bg': '#334155',
  '--tos-admin-toolbar-active-text': '#f1f5f9',
  '--tos-admin-toolbar-hover-bg': '#293548',

  '--tos-admin-sidebar-bg': '#0a0f1e',
  '--tos-admin-sidebar-text': '#94a3b8',
  '--tos-admin-sidebar-text-muted': '#475569',
  '--tos-admin-sidebar-active-text': '#ffffff',
  '--tos-admin-sidebar-active-bg': '#3B82F6',
  '--tos-admin-sidebar-hover-bg': '#111827',
  '--tos-admin-sidebar-width': '280px',
  '--tos-admin-sidebar-collapsed-width': '64px',
  '--tos-admin-sidebar-border': '1px solid #1e293b',
  '--tos-admin-sidebar-transition': 'width 200ms ease',

  '--tos-admin-content-bg': '#0f172a',
  '--tos-admin-content-text': '#e2e8f0',
  '--tos-admin-content-padding': '24px',

  '--tos-admin-status-operational': '#10b981',
  '--tos-admin-status-degraded': '#f59e0b',
  '--tos-admin-status-down': '#ef4444',
  '--tos-admin-status-dot-size': '8px',

  '--tos-admin-accent': '#3B82F6',
  '--tos-admin-accent-hover': '#2563EB',
  '--tos-admin-danger': '#ef4444',
  '--tos-admin-warning': '#f59e0b',
  '--tos-admin-success': '#10b981',
  '--tos-admin-text': '#e2e8f0',
  '--tos-admin-text-muted': '#94a3b8',
  '--tos-admin-border': '#1e293b',

  '--tos-admin-font-size-sm': '0.75rem',
  '--tos-admin-font-size-base': '0.875rem',
  '--tos-admin-font-weight-medium': '500',
  '--tos-admin-font-weight-semibold': '600',

  '--tos-admin-spacing-sm': '8px',
  '--tos-admin-spacing-md': '16px',
  '--tos-admin-spacing-lg': '24px',

  '--tos-admin-radius': '6px',
  '--tos-admin-shadow-md': '0 4px 12px rgba(0,0,0,0.5)',
  '--tos-admin-focus-ring': '0 0 0 3px rgba(59,130,246,0.4)',

  '--tos-admin-z-header': '100',
  '--tos-admin-z-toolbar': '95',
  '--tos-admin-z-sidebar': '90',
  '--tos-admin-z-dropdown': '150',
};

/** Injects all Admin layout CSS tokens onto :root. */
export function applyAdminTheme(): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  for (const [prop, value] of Object.entries(ADMIN_THEME_VALUES)) {
    root.style.setProperty(prop, value);
  }
}

// ─── System status types (shared by header + tests) ───────────────────────────

export type SystemStatusLevel = 'operational' | 'degraded' | 'down';

export interface SystemStatusItem {
  id: string;
  label: string;
  status: SystemStatusLevel;
}

/** Maps a status level to the corresponding CSS variable name. */
export function statusColorVar(level: SystemStatusLevel): AdminThemeVar {
  switch (level) {
    case 'operational': return ADMIN_THEME_VARS.statusOperational;
    case 'degraded':    return ADMIN_THEME_VARS.statusDegraded;
    case 'down':        return ADMIN_THEME_VARS.statusDown;
  }
}

/** Human-readable label for each status level. */
export const STATUS_LABELS: Record<SystemStatusLevel, string> = {
  operational: 'Operational',
  degraded: 'Degraded',
  down: 'Down',
};
