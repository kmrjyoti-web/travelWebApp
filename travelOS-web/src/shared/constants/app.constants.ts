export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'TravelOS';
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || '4.0.0';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const BREAKPOINTS = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
} as const;

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
} as const;

export const DATE_FORMAT = 'dd MMM yyyy';
export const DATETIME_FORMAT = 'dd MMM yyyy, HH:mm';
