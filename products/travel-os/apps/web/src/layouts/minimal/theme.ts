// ─── Minimal Layout Theme ──────────────────────────────────────────────────────
//
// Intentionally stripped-back palette: white header + light-grey page bg.
// Designed for focused flows — checkout, onboarding wizards, step-by-step forms.
// The narrowed content well (--tos-min-content-max-width) keeps readers focused.

// ─── Token names ──────────────────────────────────────────────────────────────

export type MinimalThemeVar =
  | '--tos-min-bg'
  | '--tos-min-header-bg'
  | '--tos-min-header-height'
  | '--tos-min-header-border'
  | '--tos-min-header-shadow'
  | '--tos-min-back-color'
  | '--tos-min-back-hover'
  | '--tos-min-title-color'
  | '--tos-min-title-size'
  | '--tos-min-title-weight'
  | '--tos-min-content-max-width'
  | '--tos-min-content-padding-x'
  | '--tos-min-content-padding-y'
  | '--tos-min-progress-track-bg'
  | '--tos-min-progress-fill'
  | '--tos-min-progress-height'
  | '--tos-min-progress-radius'
  | '--tos-min-progress-label-color'
  | '--tos-min-progress-label-size'
  | '--tos-min-primary'
  | '--tos-min-accent'
  | '--tos-min-text'
  | '--tos-min-muted'
  | '--tos-min-radius'
  | '--tos-min-font-size-base';

// ─── Token → property name map ────────────────────────────────────────────────

export const MINIMAL_THEME_VARS: Record<MinimalThemeVar, MinimalThemeVar> = {
  '--tos-min-bg':                    '--tos-min-bg',
  '--tos-min-header-bg':             '--tos-min-header-bg',
  '--tos-min-header-height':         '--tos-min-header-height',
  '--tos-min-header-border':         '--tos-min-header-border',
  '--tos-min-header-shadow':         '--tos-min-header-shadow',
  '--tos-min-back-color':            '--tos-min-back-color',
  '--tos-min-back-hover':            '--tos-min-back-hover',
  '--tos-min-title-color':           '--tos-min-title-color',
  '--tos-min-title-size':            '--tos-min-title-size',
  '--tos-min-title-weight':          '--tos-min-title-weight',
  '--tos-min-content-max-width':     '--tos-min-content-max-width',
  '--tos-min-content-padding-x':     '--tos-min-content-padding-x',
  '--tos-min-content-padding-y':     '--tos-min-content-padding-y',
  '--tos-min-progress-track-bg':     '--tos-min-progress-track-bg',
  '--tos-min-progress-fill':         '--tos-min-progress-fill',
  '--tos-min-progress-height':       '--tos-min-progress-height',
  '--tos-min-progress-radius':       '--tos-min-progress-radius',
  '--tos-min-progress-label-color':  '--tos-min-progress-label-color',
  '--tos-min-progress-label-size':   '--tos-min-progress-label-size',
  '--tos-min-primary':               '--tos-min-primary',
  '--tos-min-accent':                '--tos-min-accent',
  '--tos-min-text':                  '--tos-min-text',
  '--tos-min-muted':                 '--tos-min-muted',
  '--tos-min-radius':                '--tos-min-radius',
  '--tos-min-font-size-base':        '--tos-min-font-size-base',
} as const;

// ─── Token values ─────────────────────────────────────────────────────────────

export const MINIMAL_THEME_VALUES: Record<MinimalThemeVar, string> = {
  '--tos-min-bg':                    '#f8fafc',
  '--tos-min-header-bg':             '#ffffff',
  '--tos-min-header-height':         '56px',
  '--tos-min-header-border':         '1px solid #e2e8f0',
  '--tos-min-header-shadow':         '0 1px 4px 0 rgba(0,0,0,0.06)',
  '--tos-min-back-color':            '#64748b',
  '--tos-min-back-hover':            '#1B4F72',
  '--tos-min-title-color':           '#0f172a',
  '--tos-min-title-size':            '1.0625rem',
  '--tos-min-title-weight':          '600',
  '--tos-min-content-max-width':     '560px',
  '--tos-min-content-padding-x':     '1.5rem',
  '--tos-min-content-padding-y':     '2rem',
  '--tos-min-progress-track-bg':     '#e2e8f0',
  '--tos-min-progress-fill':         '#1B4F72',
  '--tos-min-progress-height':       '4px',
  '--tos-min-progress-radius':       '9999px',
  '--tos-min-progress-label-color':  '#64748b',
  '--tos-min-progress-label-size':   '0.75rem',
  '--tos-min-primary':               '#1B4F72',
  '--tos-min-accent':                '#3B82F6',
  '--tos-min-text':                  '#0f172a',
  '--tos-min-muted':                 '#64748b',
  '--tos-min-radius':                '8px',
  '--tos-min-font-size-base':        '1rem',
};

// ─── Apply theme ──────────────────────────────────────────────────────────────

/**
 * Writes all minimal CSS custom properties onto :root.
 * Call once on mount in MinimalLayout.
 */
export function applyMinimalTheme(): void {
  const root = document.documentElement;
  for (const [prop, value] of Object.entries(MINIMAL_THEME_VALUES)) {
    root.style.setProperty(prop, value);
  }
}
