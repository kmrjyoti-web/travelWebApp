// ─── Public Layout Theme ───────────────────────────────────────────────────────
//
// Light marketing palette.  Key behaviour: header starts transparent and
// transitions to solid white once the user scrolls past the hero section.
// The `data-scrolled` attribute drives the CSS transition — no JS className
// toggling needed in CSS consumers.

// ─── Token names ──────────────────────────────────────────────────────────────

export type PublicThemeVar =
  | '--tos-pub-header-bg'
  | '--tos-pub-header-bg-scrolled'
  | '--tos-pub-header-height'
  | '--tos-pub-header-shadow-scrolled'
  | '--tos-pub-header-border-scrolled'
  | '--tos-pub-nav-text'
  | '--tos-pub-nav-text-hover'
  | '--tos-pub-cta-primary-bg'
  | '--tos-pub-cta-primary-text'
  | '--tos-pub-cta-secondary-border'
  | '--tos-pub-cta-secondary-text'
  | '--tos-pub-footer-bg'
  | '--tos-pub-footer-text'
  | '--tos-pub-footer-muted'
  | '--tos-pub-footer-border'
  | '--tos-pub-footer-link-hover'
  | '--tos-pub-newsletter-input-bg'
  | '--tos-pub-newsletter-btn-bg'
  | '--tos-pub-newsletter-btn-text'
  | '--tos-pub-primary'
  | '--tos-pub-accent'
  | '--tos-pub-bg'
  | '--tos-pub-text'
  | '--tos-pub-font-size-base'
  | '--tos-pub-radius'
  | '--tos-pub-mobile-menu-bg';

// ─── Token → property name map ────────────────────────────────────────────────

export const PUBLIC_THEME_VARS: Record<PublicThemeVar, PublicThemeVar> = {
  '--tos-pub-header-bg':               '--tos-pub-header-bg',
  '--tos-pub-header-bg-scrolled':      '--tos-pub-header-bg-scrolled',
  '--tos-pub-header-height':           '--tos-pub-header-height',
  '--tos-pub-header-shadow-scrolled':  '--tos-pub-header-shadow-scrolled',
  '--tos-pub-header-border-scrolled':  '--tos-pub-header-border-scrolled',
  '--tos-pub-nav-text':                '--tos-pub-nav-text',
  '--tos-pub-nav-text-hover':          '--tos-pub-nav-text-hover',
  '--tos-pub-cta-primary-bg':          '--tos-pub-cta-primary-bg',
  '--tos-pub-cta-primary-text':        '--tos-pub-cta-primary-text',
  '--tos-pub-cta-secondary-border':    '--tos-pub-cta-secondary-border',
  '--tos-pub-cta-secondary-text':      '--tos-pub-cta-secondary-text',
  '--tos-pub-footer-bg':               '--tos-pub-footer-bg',
  '--tos-pub-footer-text':             '--tos-pub-footer-text',
  '--tos-pub-footer-muted':            '--tos-pub-footer-muted',
  '--tos-pub-footer-border':           '--tos-pub-footer-border',
  '--tos-pub-footer-link-hover':       '--tos-pub-footer-link-hover',
  '--tos-pub-newsletter-input-bg':     '--tos-pub-newsletter-input-bg',
  '--tos-pub-newsletter-btn-bg':       '--tos-pub-newsletter-btn-bg',
  '--tos-pub-newsletter-btn-text':     '--tos-pub-newsletter-btn-text',
  '--tos-pub-primary':                 '--tos-pub-primary',
  '--tos-pub-accent':                  '--tos-pub-accent',
  '--tos-pub-bg':                      '--tos-pub-bg',
  '--tos-pub-text':                    '--tos-pub-text',
  '--tos-pub-font-size-base':          '--tos-pub-font-size-base',
  '--tos-pub-radius':                  '--tos-pub-radius',
  '--tos-pub-mobile-menu-bg':          '--tos-pub-mobile-menu-bg',
} as const;

// ─── Token values ─────────────────────────────────────────────────────────────

export const PUBLIC_THEME_VALUES: Record<PublicThemeVar, string> = {
  '--tos-pub-header-bg':               'transparent',
  '--tos-pub-header-bg-scrolled':      '#ffffff',
  '--tos-pub-header-height':           '72px',
  '--tos-pub-header-shadow-scrolled':  '0 1px 12px 0 rgba(0,0,0,0.08)',
  '--tos-pub-header-border-scrolled':  '1px solid #e2e8f0',
  '--tos-pub-nav-text':                '#1e293b',
  '--tos-pub-nav-text-hover':          '#1B4F72',
  '--tos-pub-cta-primary-bg':          '#1B4F72',
  '--tos-pub-cta-primary-text':        '#ffffff',
  '--tos-pub-cta-secondary-border':    '#1B4F72',
  '--tos-pub-cta-secondary-text':      '#1B4F72',
  '--tos-pub-footer-bg':               '#0f172a',
  '--tos-pub-footer-text':             '#f1f5f9',
  '--tos-pub-footer-muted':            '#94a3b8',
  '--tos-pub-footer-border':           '#1e293b',
  '--tos-pub-footer-link-hover':       '#38bdf8',
  '--tos-pub-newsletter-input-bg':     '#1e293b',
  '--tos-pub-newsletter-btn-bg':       '#3B82F6',
  '--tos-pub-newsletter-btn-text':     '#ffffff',
  '--tos-pub-primary':                 '#1B4F72',
  '--tos-pub-accent':                  '#3B82F6',
  '--tos-pub-bg':                      '#ffffff',
  '--tos-pub-text':                    '#0f172a',
  '--tos-pub-font-size-base':          '1rem',
  '--tos-pub-radius':                  '8px',
  '--tos-pub-mobile-menu-bg':          '#ffffff',
};

// ─── Apply theme ──────────────────────────────────────────────────────────────

/**
 * Writes all public CSS custom properties onto :root.
 * Call once on mount in PublicLayout.
 */
export function applyPublicTheme(): void {
  const root = document.documentElement;
  for (const [prop, value] of Object.entries(PUBLIC_THEME_VALUES)) {
    root.style.setProperty(prop, value);
  }
}
