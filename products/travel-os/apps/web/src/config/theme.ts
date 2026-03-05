/**
 * @file src/config/theme.ts
 *
 * Theme configuration — product palette definitions + storage keys.
 *
 * The ThemeProvider reads this file to know:
 *   • What CSS data-attribute to set on <html> for each product
 *   • Which primary / accent colors anchor each palette
 *   • Where to persist the user's preferences in localStorage
 */

import type { ColorMode, ProductTheme, ProductThemeConfig } from '@/types/theme';
import { TRAVEL_BLUE, FOOD_ORANGE, CRM_PURPLE, TRAVEL_TEAL, FOOD_GREEN } from '@/styles/themes/tokens';

// ─── Storage keys ─────────────────────────────────────────────────────────────

export const THEME_STORAGE_KEYS = {
  COLOR_MODE:    'tos_color_mode',
  PRODUCT_THEME: 'tos_product_theme',
} as const;

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_COLOR_MODE: ColorMode       = 'system';
export const DEFAULT_PRODUCT_THEME: ProductTheme = 'travel-os';

// ─── Product theme configs ────────────────────────────────────────────────────

export const PRODUCT_THEME_CONFIGS: Record<ProductTheme, ProductThemeConfig> = {
  'travel-os': {
    name:           'TravelOS',
    primaryColor:   TRAVEL_BLUE[700],    // #1B4F72
    accentColor:    TRAVEL_BLUE[600],    // #2980B9
    secondaryColor: TRAVEL_TEAL[700],    // #008080
    cssFile:        'travel-os.css',
    dataAttribute:  'travel-os',
  },
  'food-os': {
    name:           'FoodOS',
    primaryColor:   FOOD_ORANGE[700],    // #f57c00
    accentColor:    FOOD_ORANGE[600],    // #fb8c00
    secondaryColor: FOOD_GREEN[700],     // #388e3c
    cssFile:        'food-os.css',
    dataAttribute:  'food-os',
  },
  'crm-os': {
    name:           'CRM-OS',
    primaryColor:   CRM_PURPLE[700],     // #7b1fa2
    accentColor:    CRM_PURPLE[600],     // #8e24aa
    secondaryColor: CRM_PURPLE[500],     // #9c27b0
    cssFile:        'crm-os.css',
    dataAttribute:  'crm-os',
  },
};

// ─── HTML data attributes ─────────────────────────────────────────────────────

/** Set on document.documentElement to switch color mode */
export const DATA_THEME_ATTR   = 'data-theme';
/** Set on document.documentElement to switch product palette */
export const DATA_PRODUCT_ATTR = 'data-product';
/** Set on document.documentElement for CoreUI dark mode compat */
export const DATA_COREUI_ATTR  = 'data-coreui-theme';

// ─── Transition class ─────────────────────────────────────────────────────────

/**
 * Class added to <html> for a brief window during theme transitions
 * so CSS can apply `transition: color …` without it firing on initial load.
 */
export const THEME_TRANSITION_CLASS = 'tos-theme-transitioning';
/** Duration the transition class stays on (ms) — matches CSS transition-duration. */
export const THEME_TRANSITION_DURATION_MS = 200;
