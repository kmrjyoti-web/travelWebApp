import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useThemeStore } from './themeStore';
import { THEME_STORAGE_KEYS, DEFAULT_COLOR_MODE, DEFAULT_PRODUCT_THEME } from '@/config/theme';

// ─── localStorage mock ────────────────────────────────────────────────────────

const storageMock: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem:    vi.fn((k: string) => storageMock[k] ?? null),
  setItem:    vi.fn((k: string, v: string) => { storageMock[k] = v; }),
  removeItem: vi.fn((k: string) => { delete storageMock[k]; }),
  clear:      vi.fn(() => Object.keys(storageMock).forEach((k) => delete storageMock[k])),
});

// ─── matchMedia mock ──────────────────────────────────────────────────────────

let prefersDark = false;
vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
  matches: query.includes('dark') && prefersDark,
  media:   query,
  addEventListenerWithOptions: vi.fn(),
  removeEventListener: vi.fn(),
})));

function resetStore() {
  useThemeStore.setState({
    colorMode:         DEFAULT_COLOR_MODE,
    productTheme:      DEFAULT_PRODUCT_THEME,
    resolvedColorMode: 'light',
  });
  Object.keys(storageMock).forEach((k) => delete storageMock[k]);
  vi.clearAllMocks();
}

// ─── Initial state ────────────────────────────────────────────────────────────

describe('themeStore — initial state', () => {
  beforeEach(resetStore);

  it('has default colorMode', () => {
    expect(useThemeStore.getState().colorMode).toBe(DEFAULT_COLOR_MODE);
  });

  it('has default productTheme', () => {
    expect(useThemeStore.getState().productTheme).toBe(DEFAULT_PRODUCT_THEME);
  });

  it('resolvedColorMode is light when system is light', () => {
    prefersDark = false;
    useThemeStore.getState().hydrate();
    expect(useThemeStore.getState().resolvedColorMode).toBe('light');
  });
});

// ─── setColorMode ─────────────────────────────────────────────────────────────

describe('themeStore.setColorMode', () => {
  beforeEach(resetStore);

  it('sets colorMode to light', () => {
    useThemeStore.getState().setColorMode('light');
    expect(useThemeStore.getState().colorMode).toBe('light');
    expect(useThemeStore.getState().resolvedColorMode).toBe('light');
  });

  it('sets colorMode to dark', () => {
    useThemeStore.getState().setColorMode('dark');
    expect(useThemeStore.getState().colorMode).toBe('dark');
    expect(useThemeStore.getState().resolvedColorMode).toBe('dark');
  });

  it('resolves system→light when OS is light', () => {
    prefersDark = false;
    useThemeStore.getState().setColorMode('system');
    expect(useThemeStore.getState().colorMode).toBe('system');
    expect(useThemeStore.getState().resolvedColorMode).toBe('light');
  });

  it('resolves system→dark when OS is dark', () => {
    prefersDark = true;
    useThemeStore.getState().setColorMode('system');
    expect(useThemeStore.getState().resolvedColorMode).toBe('dark');
    prefersDark = false;
  });

  it('persists colorMode to localStorage', () => {
    useThemeStore.getState().setColorMode('dark');
    expect(localStorage.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEYS.COLOR_MODE, 'dark');
  });
});

// ─── setProductTheme ──────────────────────────────────────────────────────────

describe('themeStore.setProductTheme', () => {
  beforeEach(resetStore);

  it('sets productTheme to food-os', () => {
    useThemeStore.getState().setProductTheme('food-os');
    expect(useThemeStore.getState().productTheme).toBe('food-os');
  });

  it('sets productTheme to crm-os', () => {
    useThemeStore.getState().setProductTheme('crm-os');
    expect(useThemeStore.getState().productTheme).toBe('crm-os');
  });

  it('persists productTheme to localStorage', () => {
    useThemeStore.getState().setProductTheme('food-os');
    expect(localStorage.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEYS.PRODUCT_THEME, 'food-os');
  });
});

// ─── hydrate ─────────────────────────────────────────────────────────────────

describe('themeStore.hydrate', () => {
  beforeEach(resetStore);

  it('reads colorMode from localStorage', () => {
    storageMock[THEME_STORAGE_KEYS.COLOR_MODE] = 'dark';
    useThemeStore.getState().hydrate();
    expect(useThemeStore.getState().colorMode).toBe('dark');
    expect(useThemeStore.getState().resolvedColorMode).toBe('dark');
  });

  it('reads productTheme from localStorage', () => {
    storageMock[THEME_STORAGE_KEYS.PRODUCT_THEME] = 'crm-os';
    useThemeStore.getState().hydrate();
    expect(useThemeStore.getState().productTheme).toBe('crm-os');
  });

  it('falls back to defaults when nothing stored', () => {
    useThemeStore.getState().hydrate();
    expect(useThemeStore.getState().colorMode).toBe(DEFAULT_COLOR_MODE);
    expect(useThemeStore.getState().productTheme).toBe(DEFAULT_PRODUCT_THEME);
  });

  it('ignores invalid stored values', () => {
    storageMock[THEME_STORAGE_KEYS.COLOR_MODE]    = 'invalid';
    storageMock[THEME_STORAGE_KEYS.PRODUCT_THEME] = 'bad-product';
    useThemeStore.getState().hydrate();
    expect(useThemeStore.getState().colorMode).toBe(DEFAULT_COLOR_MODE);
    expect(useThemeStore.getState().productTheme).toBe(DEFAULT_PRODUCT_THEME);
  });

  it('resolves system mode from OS preference on hydrate', () => {
    prefersDark = true;
    storageMock[THEME_STORAGE_KEYS.COLOR_MODE] = 'system';
    useThemeStore.getState().hydrate();
    expect(useThemeStore.getState().resolvedColorMode).toBe('dark');
    prefersDark = false;
  });
});
