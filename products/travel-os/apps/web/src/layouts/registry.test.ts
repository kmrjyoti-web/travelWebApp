import { describe, expect, it } from 'vitest';
import { LAYOUT_REGISTRY, ROUTE_LAYOUT_MAP } from './registry';
import type { LayoutName } from './types';

// ─── LAYOUT_REGISTRY ───────────────────────────────────────────────────────────

describe('LAYOUT_REGISTRY', () => {
  const names: LayoutName[] = ['default', 'auth', 'admin', 'public', 'minimal'];

  it('has an entry for every LayoutName', () => {
    for (const name of names) {
      expect(LAYOUT_REGISTRY).toHaveProperty(name);
    }
  });

  it('each entry has a config with matching name', () => {
    for (const name of names) {
      expect(LAYOUT_REGISTRY[name].config.name).toBe(name);
    }
  });

  it('each entry has a label string', () => {
    for (const name of names) {
      expect(typeof LAYOUT_REGISTRY[name].config.label).toBe('string');
      expect(LAYOUT_REGISTRY[name].config.label.length).toBeGreaterThan(0);
    }
  });

  it('each entry has a loader function', () => {
    for (const name of names) {
      expect(typeof LAYOUT_REGISTRY[name].loader).toBe('function');
    }
  });

  it.each(names)('%s config has boolean hasHeader/hasFooter/hasSidebar', (name) => {
    const { config } = LAYOUT_REGISTRY[name];
    expect(typeof config.hasHeader).toBe('boolean');
    expect(typeof config.hasFooter).toBe('boolean');
    expect(typeof config.hasSidebar).toBe('boolean');
  });

  it.each(names)('%s theme has required numeric dimensions', (name) => {
    const { theme } = LAYOUT_REGISTRY[name].config;
    expect(typeof theme.sidebarWidth).toBe('number');
    expect(typeof theme.headerHeight).toBe('number');
    expect(typeof theme.borderRadius).toBe('number');
    expect(theme.sidebarWidth).toBeGreaterThanOrEqual(0);
    expect(theme.headerHeight).toBeGreaterThanOrEqual(0);
  });

  it('auth layout has no sidebar, no header, no footer', () => {
    const { config } = LAYOUT_REGISTRY.auth;
    expect(config.hasHeader).toBe(false);
    expect(config.hasFooter).toBe(false);
    expect(config.hasSidebar).toBe(false);
  });

  it('default layout has header, footer, and sidebar', () => {
    const { config } = LAYOUT_REGISTRY.default;
    expect(config.hasHeader).toBe(true);
    expect(config.hasFooter).toBe(true);
    expect(config.hasSidebar).toBe(true);
  });

  it('admin layout has admin dark theme', () => {
    const { theme } = LAYOUT_REGISTRY.admin.config;
    expect(theme.colorScheme).toBe('dark');
  });

  it('default layout keyboard shortcuts reference toggleSidebar', () => {
    const shortcuts = LAYOUT_REGISTRY.default.config.keyboardShortcuts;
    const toggle = shortcuts.find((s) => s.actionId === 'toggleSidebar');
    expect(toggle).toBeDefined();
  });

  it('auth layout has no keyboard shortcuts', () => {
    expect(LAYOUT_REGISTRY.auth.config.keyboardShortcuts).toHaveLength(0);
  });
});

// ─── ROUTE_LAYOUT_MAP ──────────────────────────────────────────────────────────

describe('ROUTE_LAYOUT_MAP', () => {
  it('is non-empty', () => {
    expect(ROUTE_LAYOUT_MAP.length).toBeGreaterThan(0);
  });

  it('last entry is a catch-all matching any path', () => {
    const last = ROUTE_LAYOUT_MAP[ROUTE_LAYOUT_MAP.length - 1];
    expect(last.layout).toBe('default');
    expect(last.matcher.test('/anything/at/all')).toBe(true);
  });

  it('maps /login to auth', () => {
    const entry = ROUTE_LAYOUT_MAP.find(
      (e) => e.matcher.test('/login') && e.layout === 'auth',
    );
    expect(entry).toBeDefined();
  });

  it('maps /users to admin (before the catch-all)', () => {
    const entry = ROUTE_LAYOUT_MAP.find(
      (e) => e.matcher.test('/users') && e.layout === 'admin',
    );
    expect(entry).toBeDefined();
  });

  it('maps /landing to public', () => {
    const entry = ROUTE_LAYOUT_MAP.find(
      (e) => e.matcher.test('/landing') && e.layout === 'public',
    );
    expect(entry).toBeDefined();
  });

  it('maps /register to auth', () => {
    const authEntries = ROUTE_LAYOUT_MAP.filter(
      (e) => e.layout === 'auth',
    );
    const match = authEntries.find((e) => e.matcher.test('/register'));
    expect(match).toBeDefined();
  });
});
