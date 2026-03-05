'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from 'react';
import { usePathname } from 'next/navigation';

import type {
  KeyboardShortcut,
  KeyboardShortcutDef,
  LayoutContextValue,
  LayoutName,
  LayoutProps,
  LayoutProviderProps,
  Modifier,
  RouteLayoutEntry,
  ThemeConfig,
} from './types';
import { LAYOUT_REGISTRY, ROUTE_LAYOUT_MAP } from './registry';

// ─── Context ───────────────────────────────────────────────────────────────────

const LayoutContext = createContext<LayoutContextValue | undefined>(undefined);

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Returns the LayoutName for a given pathname (first match wins). */
export function detectLayoutFromPath(
  pathname: string,
  routeMap: RouteLayoutEntry[] = ROUTE_LAYOUT_MAP,
): LayoutName {
  for (const entry of routeMap) {
    if (entry.matcher.test(pathname)) {
      return entry.layout;
    }
  }
  return 'default';
}

/** Writes --tos-* CSS custom properties to :root and sets data-coreui-theme. */
export function applyThemeTokens(theme: ThemeConfig): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.style.setProperty('--tos-primary', theme.primaryColor);
  root.style.setProperty('--tos-accent', theme.accentColor);
  root.style.setProperty('--tos-sidebar-width', `${theme.sidebarWidth}px`);
  root.style.setProperty('--tos-header-height', `${theme.headerHeight}px`);
  root.style.setProperty('--tos-border-radius', `${theme.borderRadius}px`);
  root.style.setProperty('--tos-font-family', theme.fontFamily);

  const scheme =
    theme.colorScheme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme.colorScheme;

  root.setAttribute('data-coreui-theme', scheme);
}

/** True if the keyboard event matches a shortcut definition exactly. */
export function matchesShortcut(
  event: KeyboardEvent,
  shortcut: Pick<KeyboardShortcutDef, 'key' | 'modifiers'>,
): boolean {
  if (event.key.toLowerCase() !== shortcut.key.toLowerCase()) return false;

  const required = new Set<Modifier>(shortcut.modifiers);
  const pressed: Record<Modifier, boolean> = {
    ctrl: event.ctrlKey,
    alt: event.altKey,
    shift: event.shiftKey,
    meta: event.metaKey,
  };

  // All required modifiers must be active …
  for (const mod of required) {
    if (!pressed[mod]) return false;
  }

  // … and no extra modifier may be active.
  const allModifiers: Modifier[] = ['ctrl', 'alt', 'shift', 'meta'];
  for (const mod of allModifiers) {
    if (pressed[mod] && !required.has(mod)) return false;
  }

  return true;
}

/**
 * Maps KeyboardShortcutDef[] → KeyboardShortcut[] by looking up `actionId`
 * in the provided actions map.  Unresolved actionIds are silently skipped.
 */
export function resolveShortcuts(
  defs: KeyboardShortcutDef[],
  actions: Readonly<Record<string, () => void>>,
): KeyboardShortcut[] {
  return defs.flatMap((def) => {
    const action = actions[def.actionId];
    if (!action) return [];
    const { actionId: _removed, ...rest } = def;
    return [{ ...rest, action }];
  });
}

// ─── Hooks ─────────────────────────────────────────────────────────────────────

/**
 * Registers a document-level keydown listener once.
 * Uses a ref so shortcuts can update without re-registering the listener.
 */
function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]): void {
  const shortcutsRef = useRef<KeyboardShortcut[]>(shortcuts);
  shortcutsRef.current = shortcuts;

  useEffect(() => {
    const handler = (event: KeyboardEvent): void => {
      const target = event.target as HTMLElement | null;
      // Skip if focus is inside an input/textarea/select/contenteditable
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcutsRef.current) {
        if (matchesShortcut(event, shortcut)) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []); // empty — handler reads from ref
}

// ─── Component Cache ───────────────────────────────────────────────────────────

const componentCache = new Map<LayoutName, ComponentType<LayoutProps>>();

async function loadLayout(name: LayoutName): Promise<ComponentType<LayoutProps>> {
  const cached = componentCache.get(name);
  if (cached) return cached;

  const entry = LAYOUT_REGISTRY[name];
  const Component = await entry.loader();
  componentCache.set(name, Component);
  return Component;
}

// ─── LayoutProvider ────────────────────────────────────────────────────────────

export function LayoutProvider({ children, initialLayout }: LayoutProviderProps) {
  const pathname = usePathname();

  const detectedLayout = useMemo(
    () => detectLayoutFromPath(pathname ?? '/'),
    [pathname],
  );

  const [layoutName, setLayoutName] = useState<LayoutName>(
    initialLayout ?? detectedLayout,
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [LayoutShell, setLayoutShell] = useState<ComponentType<LayoutProps> | null>(null);

  // Sync layout when pathname changes (unless caller passed an initialLayout override)
  useEffect(() => {
    if (!initialLayout) {
      setLayoutName(detectedLayout);
    }
  }, [detectedLayout, initialLayout]);

  // Lazy-load the layout shell component
  useEffect(() => {
    let cancelled = false;
    loadLayout(layoutName).then((Component) => {
      if (!cancelled) setLayoutShell(() => Component);
    });
    return () => {
      cancelled = true;
    };
  }, [layoutName]);

  const { config } = LAYOUT_REGISTRY[layoutName];
  const { theme } = config;

  // Apply CSS tokens whenever the theme changes
  useEffect(() => {
    applyThemeTokens(theme);
  }, [theme]);

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const setLayout = useCallback((name: LayoutName) => setLayoutName(name), []);

  // Build runtime action map (actionId → closure)
  const actions = useMemo<Record<string, () => void>>(
    () => ({
      toggleSidebar,
      goDashboard: () => {
        if (typeof window !== 'undefined') window.location.href = '/dashboard';
      },
      goUsers: () => {
        if (typeof window !== 'undefined') window.location.href = '/users';
      },
    }),
    [toggleSidebar],
  );

  const shortcuts = useMemo(
    () => resolveShortcuts(config.keyboardShortcuts, actions),
    [config.keyboardShortcuts, actions],
  );

  useKeyboardShortcuts(shortcuts);

  const contextValue = useMemo<LayoutContextValue>(
    () => ({
      layoutName,
      config,
      theme,
      shortcuts,
      sidebarOpen,
      setSidebarOpen,
      toggleSidebar,
      setLayout,
    }),
    [layoutName, config, theme, shortcuts, sidebarOpen, toggleSidebar, setLayout],
  );

  if (!LayoutShell) {
    // Layout is loading — render children directly to avoid flash of unstyled content
    return (
      <LayoutContext.Provider value={contextValue}>
        {children}
      </LayoutContext.Provider>
    );
  }

  return (
    <LayoutContext.Provider value={contextValue}>
      <LayoutShell>{children}</LayoutShell>
    </LayoutContext.Provider>
  );
}

// ─── useLayout ─────────────────────────────────────────────────────────────────

export function useLayout(): LayoutContextValue {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error('useLayout must be used within LayoutProvider');
  return ctx;
}
