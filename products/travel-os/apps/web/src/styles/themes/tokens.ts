/**
 * @file src/styles/themes/tokens.ts
 *
 * TravelOS design token registry.
 *
 * Two exports:
 *   TOKENS — typed map of every --tos-* CSS custom property name.
 *   SCALE  — raw JS values for each token (used by ThemeProvider to
 *             apply tokens in JS when CSS alone isn't enough).
 *
 * Naming convention:  --tos-{category}-{variant?}-{modifier?}
 * All colours follow a 50–950 lightness scale (Radix / Tailwind style).
 */

// ─── Color scales ─────────────────────────────────────────────────────────────

/** TravelOS primary — deep ocean blues */
export const TRAVEL_BLUE = {
  50:  '#e8f1f8',
  100: '#c5d8ec',
  200: '#9fbde0',
  300: '#78a2d3',
  400: '#5a8dc9',
  500: '#3d79c0',
  600: '#2980B9',   // accent (legacy tos-accent)
  700: '#1B4F72',   // primary (legacy tos-header-bg)
  800: '#154060',
  900: '#0d2a40',
  950: '#071520',
} as const;

/** TravelOS secondary — teal/cyan accents */
export const TRAVEL_TEAL = {
  50:  '#e6f7f7',
  100: '#b3e9e9',
  200: '#80dbdb',
  300: '#4dcdcd',
  400: '#26c2c2',
  500: '#00b7b7',
  600: '#00a0a0',
  700: '#008080',
  800: '#006060',
  900: '#004040',
  950: '#002020',
} as const;

/** FoodOS primary — warm oranges */
export const FOOD_ORANGE = {
  50:  '#fff3e0',
  100: '#ffe0b2',
  200: '#ffcc80',
  300: '#ffb74d',
  400: '#ffa726',
  500: '#ff9800',
  600: '#fb8c00',
  700: '#f57c00',   // primary
  800: '#e65100',
  900: '#bf360c',
  950: '#7f1f00',
} as const;

/** FoodOS secondary — fresh greens */
export const FOOD_GREEN = {
  50:  '#e8f5e9',
  100: '#c8e6c9',
  200: '#a5d6a7',
  300: '#81c784',
  400: '#66bb6a',
  500: '#4caf50',
  600: '#43a047',
  700: '#388e3c',   // secondary
  800: '#2e7d32',
  900: '#1b5e20',
  950: '#0a3d10',
} as const;

/** CRM-OS primary — professional purples */
export const CRM_PURPLE = {
  50:  '#f3e5f5',
  100: '#e1bee7',
  200: '#ce93d8',
  300: '#ba68c8',
  400: '#ab47bc',
  500: '#9c27b0',
  600: '#8e24aa',
  700: '#7b1fa2',   // primary
  800: '#6a1b9a',
  900: '#4a148c',
  950: '#2d0a5a',
} as const;

/** Neutral grays — shared across all products */
export const NEUTRAL = {
  0:   '#ffffff',
  50:  '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
  950: '#020617',
  1000: '#000000',
} as const;

/** Semantic / intent colors */
export const INTENT_COLORS = {
  success:     '#16a34a',
  successLight:'#dcfce7',
  successDark: '#14532d',
  warning:     '#d97706',
  warningLight:'#fef3c7',
  warningDark: '#78350f',
  error:       '#dc2626',
  errorLight:  '#fee2e2',
  errorDark:   '#7f1d1d',
  info:        '#0284c7',
  infoLight:   '#e0f2fe',
  infoDark:    '#0c4a6e',
} as const;

// ─── Token map ────────────────────────────────────────────────────────────────

/**
 * Canonical registry of every --tos-* CSS custom property.
 * Import `TOKENS` in TypeScript to get type-safe property names.
 */
export const TOKENS = {
  // ── Primary colors ────────────────────────────────────────────────────────
  colorPrimary:          '--tos-color-primary',
  colorPrimaryLight:     '--tos-color-primary-light',
  colorPrimaryDark:      '--tos-color-primary-dark',
  colorAccent:           '--tos-color-accent',
  colorAccentHover:      '--tos-color-accent-hover',

  // ── Secondary colors ──────────────────────────────────────────────────────
  colorSecondary:        '--tos-color-secondary',
  colorSecondaryLight:   '--tos-color-secondary-light',
  colorSecondaryDark:    '--tos-color-secondary-dark',

  // ── Semantic / intent ─────────────────────────────────────────────────────
  colorSuccess:          '--tos-color-success',
  colorSuccessLight:     '--tos-color-success-light',
  colorWarning:          '--tos-color-warning',
  colorWarningLight:     '--tos-color-warning-light',
  colorError:            '--tos-color-error',
  colorErrorLight:       '--tos-color-error-light',
  colorInfo:             '--tos-color-info',
  colorInfoLight:        '--tos-color-info-light',

  // ── Neutral / surface ─────────────────────────────────────────────────────
  colorSurface:          '--tos-color-surface',
  colorSurfaceElevated:  '--tos-color-surface-elevated',
  colorSurfaceSunken:    '--tos-color-surface-sunken',
  colorBackground:       '--tos-color-background',
  colorBorder:           '--tos-color-border',
  colorBorderStrong:     '--tos-color-border-strong',

  // ── Text ──────────────────────────────────────────────────────────────────
  colorText:             '--tos-color-text',
  colorTextMuted:        '--tos-color-text-muted',
  colorTextDisabled:     '--tos-color-text-disabled',
  colorTextInverse:      '--tos-color-text-inverse',
  colorTextLink:         '--tos-color-text-link',
  colorTextLinkHover:    '--tos-color-text-link-hover',

  // ── Header ────────────────────────────────────────────────────────────────
  headerBg:              '--tos-header-bg',
  headerText:            '--tos-header-text',
  headerHeight:          '--tos-header-height',
  headerShadow:          '--tos-header-shadow',
  headerBorderBottom:    '--tos-header-border-bottom',

  // ── Sidebar ───────────────────────────────────────────────────────────────
  sidebarBg:             '--tos-sidebar-bg',
  sidebarText:           '--tos-sidebar-text',
  sidebarTextMuted:      '--tos-sidebar-text-muted',
  sidebarActiveText:     '--tos-sidebar-active-text',
  sidebarActiveBg:       '--tos-sidebar-active-bg',
  sidebarHoverBg:        '--tos-sidebar-hover-bg',
  sidebarWidth:          '--tos-sidebar-width',
  sidebarCollapsedWidth: '--tos-sidebar-collapsed-width',
  sidebarBorderRight:    '--tos-sidebar-border-right',
  sidebarTransition:     '--tos-sidebar-transition',

  // ── Content / layout ─────────────────────────────────────────────────────
  contentBg:             '--tos-content-bg',
  contentPadding:        '--tos-content-padding',
  appBg:                 '--tos-app-bg',

  // ── Footer ────────────────────────────────────────────────────────────────
  footerBg:              '--tos-footer-bg',
  footerText:            '--tos-footer-text',
  footerBorderTop:       '--tos-footer-border-top',
  footerHeight:          '--tos-footer-height',

  // ── Icon ──────────────────────────────────────────────────────────────────
  icon:                  '--tos-icon',
  iconMuted:             '--tos-icon-muted',

  // ── Spacing ───────────────────────────────────────────────────────────────
  spacing1:              '--tos-spacing-1',   // 4px
  spacing2:              '--tos-spacing-2',   // 8px
  spacing3:              '--tos-spacing-3',   // 12px
  spacing4:              '--tos-spacing-4',   // 16px
  spacing5:              '--tos-spacing-5',   // 20px
  spacing6:              '--tos-spacing-6',   // 24px
  spacing8:              '--tos-spacing-8',   // 32px
  spacing10:             '--tos-spacing-10',  // 40px
  spacing12:             '--tos-spacing-12',  // 48px
  spacing16:             '--tos-spacing-16',  // 64px
  // Legacy aliases
  spacingXs:             '--tos-spacing-xs',  // 4px
  spacingSm:             '--tos-spacing-sm',  // 8px
  spacingMd:             '--tos-spacing-md',  // 16px
  spacingLg:             '--tos-spacing-lg',  // 24px
  spacingXl:             '--tos-spacing-xl',  // 32px

  // ── Typography ────────────────────────────────────────────────────────────
  fontFamily:            '--tos-font-family',
  fontFamilyMono:        '--tos-font-family-mono',

  fontSizeXs:            '--tos-font-size-xs',    // 11px
  fontSizeSm:            '--tos-font-size-sm',    // 12px
  fontSizeBase:          '--tos-font-size-base',  // 14px
  fontSizeLg:            '--tos-font-size-lg',    // 16px
  fontSizeXl:            '--tos-font-size-xl',    // 18px
  fontSize2xl:           '--tos-font-size-2xl',   // 20px
  fontSize3xl:           '--tos-font-size-3xl',   // 24px

  fontWeightNormal:      '--tos-font-weight-normal',    // 400
  fontWeightMedium:      '--tos-font-weight-medium',    // 500
  fontWeightSemibold:    '--tos-font-weight-semibold',  // 600
  fontWeightBold:        '--tos-font-weight-bold',      // 700

  lineHeightTight:       '--tos-line-height-tight',   // 1.25
  lineHeightBase:        '--tos-line-height-base',    // 1.5
  lineHeightRelaxed:     '--tos-line-height-relaxed', // 1.75

  // ── Borders ───────────────────────────────────────────────────────────────
  borderWidth:           '--tos-border-width',
  borderColor:           '--tos-border-color',
  borderColorStrong:     '--tos-border-color-strong',

  radiusSm:              '--tos-radius-sm',   // 4px
  radiusMd:              '--tos-radius-md',   // 6px  (default)
  radiusLg:              '--tos-radius-lg',   // 8px
  radiusXl:              '--tos-radius-xl',   // 12px
  radiusFull:            '--tos-radius-full', // 9999px
  // Legacy alias
  borderRadius:          '--tos-border-radius',

  // ── Shadows ───────────────────────────────────────────────────────────────
  shadowXs:              '--tos-shadow-xs',
  shadowSm:              '--tos-shadow-sm',
  shadowMd:              '--tos-shadow-md',
  shadowLg:              '--tos-shadow-lg',
  shadowXl:              '--tos-shadow-xl',
  shadowInner:           '--tos-shadow-inner',

  // ── Focus ─────────────────────────────────────────────────────────────────
  focusRing:             '--tos-focus-ring',
  focusRingColor:        '--tos-focus-ring-color',
  focusRingOffset:       '--tos-focus-ring-offset',

  // ── Z-index ───────────────────────────────────────────────────────────────
  zBase:                 '--tos-z-base',
  zDropdown:             '--tos-z-dropdown',
  zSticky:               '--tos-z-sticky',
  zSidebar:              '--tos-z-sidebar',
  zHeader:               '--tos-z-header',
  zOverlay:              '--tos-z-overlay',
  zModal:                '--tos-z-modal',
  zToast:                '--tos-z-toast',
  zTooltip:              '--tos-z-tooltip',

  // ── Transitions ───────────────────────────────────────────────────────────
  transitionFast:        '--tos-transition-fast',    // 100ms
  transitionBase:        '--tos-transition-base',    // 200ms
  transitionSlow:        '--tos-transition-slow',    // 300ms
  transitionColors:      '--tos-transition-colors',  // color, background-color…
  transitionTransform:   '--tos-transition-transform',

  // ── Breakpoints (reference only — use in CSS/JS media queries) ────────────
  breakpointSm:          '--tos-breakpoint-sm',   // 640px
  breakpointMd:          '--tos-breakpoint-md',   // 768px
  breakpointLg:          '--tos-breakpoint-lg',   // 1024px
  breakpointXl:          '--tos-breakpoint-xl',   // 1280px
  breakpoint2xl:         '--tos-breakpoint-2xl',  // 1536px
} as const;

export type TokenKey = keyof typeof TOKENS;
export type TokenValue = (typeof TOKENS)[TokenKey];

// ─── Legacy alias (keep back-compat with existing code) ───────────────────────

/** @deprecated Use TOKENS instead */
export const TOS_TOKENS = {
  headerBg:    TOKENS.headerBg,
  sidebarBg:   TOKENS.sidebarBg,
  sidebarText: TOKENS.sidebarText,
  accent:      TOKENS.colorAccent,
  icon:        TOKENS.icon,
  appBg:       TOKENS.appBg,
} as const;

export type TosTokenKey = keyof typeof TOS_TOKENS;

// ─── Breakpoint values (JS) ───────────────────────────────────────────────────

export const BREAKPOINTS = {
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;
