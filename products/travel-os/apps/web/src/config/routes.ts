export const ROUTES = {
  // Auth
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  // Main
  dashboard: '/dashboard',
  settings: '/settings',
  // Admin
  users: '/users',
  // Public
  landing: '/landing',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
