import type {
  LayoutRegistry,
  RouteLayoutEntry,
  ThemeConfig,
  KeyboardShortcutDef,
} from './types';

// ─── Default Theme Presets ──────────────────────────────────────────────────────

const DEFAULT_FONT_FAMILY = "'Inter', 'Segoe UI', system-ui, sans-serif";

const defaultTheme: ThemeConfig = {
  colorScheme: 'light',
  primaryColor: '#1B4F72',
  accentColor: '#2980B9',
  sidebarWidth: 260,
  headerHeight: 56,
  borderRadius: 6,
  fontFamily: DEFAULT_FONT_FAMILY,
};

const authTheme: ThemeConfig = {
  colorScheme: 'light',
  primaryColor: '#1B4F72',
  accentColor: '#2980B9',
  sidebarWidth: 0,
  headerHeight: 0,
  borderRadius: 8,
  fontFamily: DEFAULT_FONT_FAMILY,
};

const adminTheme: ThemeConfig = {
  colorScheme: 'dark',
  primaryColor: '#111827',
  accentColor: '#3B82F6',
  sidebarWidth: 280,
  headerHeight: 56,
  borderRadius: 4,
  fontFamily: DEFAULT_FONT_FAMILY,
};

const publicTheme: ThemeConfig = {
  colorScheme: 'light',
  primaryColor: '#1B4F72',
  accentColor: '#2980B9',
  sidebarWidth: 0,
  headerHeight: 64,
  borderRadius: 8,
  fontFamily: DEFAULT_FONT_FAMILY,
};

const minimalTheme: ThemeConfig = {
  colorScheme: 'light',
  primaryColor: '#1B4F72',
  accentColor: '#2980B9',
  sidebarWidth: 0,
  headerHeight: 0,
  borderRadius: 4,
  fontFamily: DEFAULT_FONT_FAMILY,
};

// ─── Keyboard Shortcut Definitions ─────────────────────────────────────────────

const defaultShortcuts: KeyboardShortcutDef[] = [
  {
    id: 'default:toggle-sidebar',
    key: 'b',
    modifiers: ['ctrl'],
    description: 'Toggle sidebar',
    scope: 'default',
    actionId: 'toggleSidebar',
  },
  {
    id: 'global:go-dashboard',
    key: 'd',
    modifiers: ['ctrl', 'shift'],
    description: 'Go to dashboard',
    scope: 'global',
    actionId: 'goDashboard',
  },
];

const adminShortcuts: KeyboardShortcutDef[] = [
  {
    id: 'admin:toggle-sidebar',
    key: 'b',
    modifiers: ['ctrl'],
    description: 'Toggle admin sidebar',
    scope: 'admin',
    actionId: 'toggleSidebar',
  },
  {
    id: 'admin:go-users',
    key: 'u',
    modifiers: ['ctrl', 'shift'],
    description: 'Go to users',
    scope: 'admin',
    actionId: 'goUsers',
  },
];

// ─── LAYOUT_REGISTRY ───────────────────────────────────────────────────────────

export const LAYOUT_REGISTRY: LayoutRegistry = {
  default: {
    config: {
      name: 'default',
      label: 'Default',
      hasHeader: true,
      hasFooter: true,
      hasSidebar: true,
      theme: defaultTheme,
      keyboardShortcuts: defaultShortcuts,
    },
    loader: async () => {
      const mod = await import('./default/DefaultLayout');
      return mod.DefaultLayout;
    },
  },

  auth: {
    config: {
      name: 'auth',
      label: 'Auth',
      hasHeader: false,
      hasFooter: false,
      hasSidebar: false,
      theme: authTheme,
      keyboardShortcuts: [],
    },
    loader: async () => {
      const mod = await import('./auth/AuthLayout');
      return mod.AuthLayout;
    },
  },

  admin: {
    config: {
      name: 'admin',
      label: 'Admin',
      hasHeader: true,
      hasFooter: false,
      hasSidebar: true,
      theme: adminTheme,
      keyboardShortcuts: adminShortcuts,
    },
    loader: async () => {
      const mod = await import('./admin/AdminLayout');
      return mod.AdminLayout;
    },
  },

  public: {
    config: {
      name: 'public',
      label: 'Public',
      hasHeader: true,
      hasFooter: true,
      hasSidebar: false,
      theme: publicTheme,
      keyboardShortcuts: [],
    },
    loader: async () => {
      const mod = await import('./public/PublicLayout');
      return mod.PublicLayout;
    },
  },

  minimal: {
    config: {
      name: 'minimal',
      label: 'Minimal',
      hasHeader: false,
      hasFooter: false,
      hasSidebar: false,
      theme: minimalTheme,
      keyboardShortcuts: [],
    },
    loader: async () => {
      const mod = await import('./minimal/MinimalLayout');
      return mod.MinimalLayout;
    },
  },
};

// ─── Route → Layout Map ────────────────────────────────────────────────────────

export const ROUTE_LAYOUT_MAP: RouteLayoutEntry[] = [
  { matcher: /^\/login$/, layout: 'auth' },
  { matcher: /^\/register$/, layout: 'auth' },
  { matcher: /^\/forgot-password$/, layout: 'auth' },
  { matcher: /^\/reset-password/, layout: 'auth' },
  { matcher: /^\/users/, layout: 'admin' },
  { matcher: /^\/admin/, layout: 'admin' },
  { matcher: /^\/landing/, layout: 'public' },
  { matcher: /^\/$/, layout: 'public' },
  { matcher: /^\/minimal/, layout: 'minimal' },
  // Default — must be last
  { matcher: /.*/, layout: 'default' },
];
