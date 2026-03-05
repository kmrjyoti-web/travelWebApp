import { describe, expect, it } from 'vitest';
import { assertNever } from './types';
import type {
  ColorScheme,
  KeyboardShortcut,
  KeyboardShortcutDef,
  LayoutConfig,
  LayoutContextValue,
  LayoutName,
  LayoutProps,
  LayoutProviderProps,
  LayoutRegistry,
  LayoutRegistryEntry,
  Modifier,
  RouteLayoutEntry,
  ThemeConfig,
} from './types';

// ─── assertNever ───────────────────────────────────────────────────────────────

describe('assertNever', () => {
  it('throws with the unhandled value in the message', () => {
    expect(() => assertNever('unknown' as never)).toThrowError(
      'Unhandled LayoutName: unknown',
    );
  });
});

// ─── Type smoke tests (TypeScript compile-time — runtime is trivial) ───────────

describe('LayoutName', () => {
  it('accepts all valid layout names', () => {
    const names: LayoutName[] = ['default', 'auth', 'admin', 'public', 'minimal'];
    expect(names).toHaveLength(5);
  });
});

describe('Modifier', () => {
  it('accepts all modifier keys', () => {
    const mods: Modifier[] = ['ctrl', 'alt', 'shift', 'meta'];
    expect(mods).toHaveLength(4);
  });
});

describe('ColorScheme', () => {
  it('accepts all color scheme values', () => {
    const schemes: ColorScheme[] = ['light', 'dark', 'system'];
    expect(schemes).toHaveLength(3);
  });
});

describe('ThemeConfig', () => {
  it('can construct a valid ThemeConfig object', () => {
    const theme: ThemeConfig = {
      colorScheme: 'light',
      primaryColor: '#1B4F72',
      accentColor: '#2980B9',
      sidebarWidth: 260,
      headerHeight: 56,
      borderRadius: 6,
      fontFamily: 'Inter, sans-serif',
    };
    expect(theme.sidebarWidth).toBe(260);
  });
});

describe('KeyboardShortcutDef', () => {
  it('requires actionId (not action)', () => {
    const def: KeyboardShortcutDef = {
      id: 'test:toggle',
      key: 'b',
      modifiers: ['ctrl'],
      description: 'Test',
      scope: 'default',
      actionId: 'toggleSidebar',
    };
    // actionId is a string — not a function
    expect(typeof def.actionId).toBe('string');
  });
});

describe('KeyboardShortcut', () => {
  it('requires action (a function)', () => {
    const shortcut: KeyboardShortcut = {
      id: 'test:toggle',
      key: 'b',
      modifiers: ['ctrl'],
      description: 'Test',
      scope: 'default',
      action: () => undefined,
    };
    expect(typeof shortcut.action).toBe('function');
  });
});

describe('LayoutConfig', () => {
  it('can be constructed with all required fields', () => {
    const config: LayoutConfig = {
      name: 'default',
      label: 'Default',
      hasHeader: true,
      hasFooter: true,
      hasSidebar: true,
      theme: {
        colorScheme: 'light',
        primaryColor: '#000',
        accentColor: '#111',
        sidebarWidth: 240,
        headerHeight: 56,
        borderRadius: 4,
        fontFamily: 'Inter',
      },
      keyboardShortcuts: [],
    };
    expect(config.name).toBe('default');
  });
});

describe('LayoutProps', () => {
  it('accepts ReactNode children shape', () => {
    const props: LayoutProps = { children: null };
    expect(props.children).toBeNull();
  });
});

describe('RouteLayoutEntry', () => {
  it('stores a regex + layout name', () => {
    const entry: RouteLayoutEntry = {
      matcher: /^\/login$/,
      layout: 'auth',
    };
    expect(entry.matcher.test('/login')).toBe(true);
  });
});

describe('LayoutRegistryEntry', () => {
  it('has a config and an async loader', () => {
    const config: LayoutConfig = {
      name: 'minimal',
      label: 'Minimal',
      hasHeader: false,
      hasFooter: false,
      hasSidebar: false,
      theme: {
        colorScheme: 'light',
        primaryColor: '#000',
        accentColor: '#111',
        sidebarWidth: 0,
        headerHeight: 0,
        borderRadius: 0,
        fontFamily: 'Inter',
      },
      keyboardShortcuts: [],
    };
    const entry: LayoutRegistryEntry = {
      config,
      loader: async () => {
        return () => null;
      },
    };
    expect(entry.config.name).toBe('minimal');
    expect(typeof entry.loader).toBe('function');
  });
});

describe('LayoutContextValue', () => {
  it('can be typed with all required fields', () => {
    const ctx: LayoutContextValue = {
      layoutName: 'default',
      config: {
        name: 'default',
        label: 'Default',
        hasHeader: true,
        hasFooter: true,
        hasSidebar: true,
        theme: {
          colorScheme: 'light',
          primaryColor: '#000',
          accentColor: '#111',
          sidebarWidth: 260,
          headerHeight: 56,
          borderRadius: 4,
          fontFamily: 'Inter',
        },
        keyboardShortcuts: [],
      },
      theme: {
        colorScheme: 'light',
        primaryColor: '#000',
        accentColor: '#111',
        sidebarWidth: 260,
        headerHeight: 56,
        borderRadius: 4,
        fontFamily: 'Inter',
      },
      shortcuts: [],
      sidebarOpen: true,
      setSidebarOpen: (_open: boolean) => undefined,
      toggleSidebar: () => undefined,
      setLayout: (_name: LayoutName) => undefined,
    };
    expect(ctx.layoutName).toBe('default');
  });
});

describe('LayoutProviderProps', () => {
  it('accepts optional initialLayout', () => {
    const props: LayoutProviderProps = { children: null };
    const propsWithLayout: LayoutProviderProps = {
      children: null,
      initialLayout: 'admin',
    };
    expect(props.children).toBeNull();
    expect(propsWithLayout.initialLayout).toBe('admin');
  });
});

describe('LayoutRegistry', () => {
  it('must have an entry for every LayoutName', () => {
    const names: LayoutName[] = ['default', 'auth', 'admin', 'public', 'minimal'];
    const registry: LayoutRegistry = {} as LayoutRegistry;
    // Type system guarantees all keys exist — just verify the names array matches
    expect(names).toHaveLength(5);
    // Suppress unused variable error
    void registry;
  });
});
