// ─── Layout shell ──────────────────────────────────────────────────────────────
export { PublicLayout } from './PublicLayout';

// ─── Sub-components ────────────────────────────────────────────────────────────
export { PublicHeader } from './PublicHeader';
export { PublicFooter } from './PublicFooter';

// ─── Nav / sitemap data ────────────────────────────────────────────────────────
export { PUBLIC_NAV_ITEMS } from './PublicHeader';
export type { PublicNavItem } from './PublicHeader';
export { FOOTER_SITEMAP, FOOTER_SOCIAL_LINKS } from './PublicFooter';
export type { FooterColumn, FooterLinkItem, SocialLink } from './PublicFooter';

// ─── Theme ────────────────────────────────────────────────────────────────────
export {
  PUBLIC_THEME_VARS,
  PUBLIC_THEME_VALUES,
  applyPublicTheme,
} from './theme';
export type { PublicThemeVar } from './theme';

// ─── Keyboard shortcuts ────────────────────────────────────────────────────────
export {
  PUBLIC_KEYBOARD_SHORTCUTS,
  PUBLIC_MOBILE_MENU_EVENT,
  PUBLIC_MODIFIER_LABELS,
  formatPublicShortcut,
} from './keyboard-shortcuts';
export type { PublicMobileMenuEventDetail } from './keyboard-shortcuts';
