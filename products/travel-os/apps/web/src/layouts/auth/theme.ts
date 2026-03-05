/**
 * Auth layout CSS custom property names and values.
 *
 * Design intent:
 *   - Lighter, more spacious than the default layout
 *   - Larger base type (1rem vs 0.875rem) for improved form legibility
 *   - Softer shadows and rounder card corners for a welcoming feel
 *   - Illustration panel uses deep-blue gradient (brand colour)
 *   - Card is pure white on a near-white page background
 */

export const AUTH_THEME_VARS = {
  // Page
  pageBg: '--tos-auth-bg',
  pageMinHeight: '--tos-auth-min-height',

  // Header (minimal — logo only)
  headerBg: '--tos-auth-header-bg',
  headerHeight: '--tos-auth-header-height',
  headerBorderBottom: '--tos-auth-header-border',

  // Footer (minimal)
  footerBg: '--tos-auth-footer-bg',
  footerText: '--tos-auth-footer-text',
  footerHeight: '--tos-auth-footer-height',
  footerBorderTop: '--tos-auth-footer-border',

  // Split-screen illustration panel (desktop left)
  illustrationBg: '--tos-auth-illustration-bg',
  illustrationText: '--tos-auth-illustration-text',
  illustrationMinWidth: '--tos-auth-illustration-min-width',
  illustrationMaxWidth: '--tos-auth-illustration-max-width',

  // Card (form container — desktop right / full-width mobile)
  cardBg: '--tos-auth-card-bg',
  cardShadow: '--tos-auth-card-shadow',
  cardBorderRadius: '--tos-auth-card-radius',
  cardPadding: '--tos-auth-card-padding',
  cardPaddingMobile: '--tos-auth-card-padding-mobile',
  cardMaxWidth: '--tos-auth-card-max-width',

  // Typography (larger than default layout)
  fontSizeSm: '--tos-auth-font-size-sm',
  fontSizeBase: '--tos-auth-font-size-base',
  fontSizeLg: '--tos-auth-font-size-lg',
  fontSizeXl: '--tos-auth-font-size-xl',
  headingSize: '--tos-auth-heading-size',
  fontWeightNormal: '--tos-auth-font-weight-normal',
  fontWeightMedium: '--tos-auth-font-weight-medium',
  fontWeightSemibold: '--tos-auth-font-weight-semibold',
  fontWeightBold: '--tos-auth-font-weight-bold',
  lineHeightBase: '--tos-auth-line-height',

  // Colours
  primary: '--tos-auth-primary',
  primaryHover: '--tos-auth-primary-hover',
  accent: '--tos-auth-accent',
  text: '--tos-auth-text',
  textMuted: '--tos-auth-text-muted',
  borderColor: '--tos-auth-border',
  inputBg: '--tos-auth-input-bg',
  inputFocusRing: '--tos-auth-input-focus-ring',

  // Spacing
  spacingSm: '--tos-auth-spacing-sm',
  spacingMd: '--tos-auth-spacing-md',
  spacingLg: '--tos-auth-spacing-lg',
  spacingXl: '--tos-auth-spacing-xl',
} as const;

export type AuthThemeVar = (typeof AUTH_THEME_VARS)[keyof typeof AUTH_THEME_VARS];

/** Token values for the Auth layout. */
export const AUTH_THEME_VALUES: Record<AuthThemeVar, string> = {
  // Page
  '--tos-auth-bg': '#f1f5f9',
  '--tos-auth-min-height': '100dvh',

  // Header
  '--tos-auth-header-bg': '#ffffff',
  '--tos-auth-header-height': '64px',
  '--tos-auth-header-border': '1px solid #e2e8f0',

  // Footer
  '--tos-auth-footer-bg': 'transparent',
  '--tos-auth-footer-text': '#94a3b8',
  '--tos-auth-footer-height': '48px',
  '--tos-auth-footer-border': 'none',

  // Illustration panel
  '--tos-auth-illustration-bg': 'linear-gradient(150deg, #1B4F72 0%, #2980B9 60%, #1a6fa8 100%)',
  '--tos-auth-illustration-text': 'rgba(255,255,255,0.92)',
  '--tos-auth-illustration-min-width': '420px',
  '--tos-auth-illustration-max-width': '50%',

  // Card
  '--tos-auth-card-bg': '#ffffff',
  '--tos-auth-card-shadow': '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
  '--tos-auth-card-radius': '16px',
  '--tos-auth-card-padding': '48px',
  '--tos-auth-card-padding-mobile': '28px 24px',
  '--tos-auth-card-max-width': '480px',

  // Typography (larger than default's 0.875rem base)
  '--tos-auth-font-size-sm': '0.8125rem',
  '--tos-auth-font-size-base': '1rem',
  '--tos-auth-font-size-lg': '1.125rem',
  '--tos-auth-font-size-xl': '1.375rem',
  '--tos-auth-heading-size': '1.875rem',
  '--tos-auth-font-weight-normal': '400',
  '--tos-auth-font-weight-medium': '500',
  '--tos-auth-font-weight-semibold': '600',
  '--tos-auth-font-weight-bold': '700',
  '--tos-auth-line-height': '1.6',

  // Colours
  '--tos-auth-primary': '#1B4F72',
  '--tos-auth-primary-hover': '#154060',
  '--tos-auth-accent': '#2980B9',
  '--tos-auth-text': '#0f172a',
  '--tos-auth-text-muted': '#64748b',
  '--tos-auth-border': '#e2e8f0',
  '--tos-auth-input-bg': '#f8fafc',
  '--tos-auth-input-focus-ring': '0 0 0 3px rgba(41,128,185,0.25)',

  // Spacing (generous — auth forms need breathing room)
  '--tos-auth-spacing-sm': '8px',
  '--tos-auth-spacing-md': '20px',
  '--tos-auth-spacing-lg': '32px',
  '--tos-auth-spacing-xl': '48px',
};

/**
 * Injects all Auth layout CSS tokens onto :root.
 * Called once when the auth layout shell mounts.
 */
export function applyAuthTheme(): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  for (const [prop, value] of Object.entries(AUTH_THEME_VALUES)) {
    root.style.setProperty(prop, value);
  }
}
