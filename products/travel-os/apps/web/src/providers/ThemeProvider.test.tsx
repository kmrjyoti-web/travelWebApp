import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, renderHook } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useThemeStore } from '@/stores/themeStore';
import { DATA_THEME_ATTR, DATA_COREUI_ATTR, DATA_PRODUCT_ATTR } from '@/config/theme';

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
const mediaListeners: Array<(e: { matches: boolean }) => void> = [];

vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
  matches: query.includes('dark') && prefersDark,
  media:   query,
  addEventListener:    vi.fn((_, cb) => { mediaListeners.push(cb as (e: { matches: boolean }) => void); }),
  removeEventListener: vi.fn(),
})));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resetStore() {
  useThemeStore.setState({
    colorMode:         'system',
    productTheme:      'travel-os',
    resolvedColorMode: 'light',
  });
  Object.keys(storageMock).forEach((k) => delete storageMock[k]);
  mediaListeners.length = 0;
  prefersDark = false;
  vi.clearAllMocks();
  document.documentElement.removeAttribute(DATA_THEME_ATTR);
  document.documentElement.removeAttribute(DATA_COREUI_ATTR);
  document.documentElement.removeAttribute(DATA_PRODUCT_ATTR);
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

function ConsumerComponent() {
  const { colorMode, productTheme, resolvedColorMode, isHydrated } = useThemeContext();
  return (
    <div>
      <span data-testid="colorMode">{colorMode}</span>
      <span data-testid="productTheme">{productTheme}</span>
      <span data-testid="resolvedColorMode">{resolvedColorMode}</span>
      <span data-testid="isHydrated">{String(isHydrated)}</span>
    </div>
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ThemeProvider — initial render', () => {
  beforeEach(resetStore);

  it('renders children', () => {
    render(<ThemeProvider><div>hello</div></ThemeProvider>);
    expect(screen.getByText('hello')).toBeTruthy();
  });

  it('provides context to consumers', () => {
    render(
      <ThemeProvider>
        <ConsumerComponent />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('colorMode')).toBeTruthy();
  });

  it('sets isHydrated=true after mount', async () => {
    render(
      <ThemeProvider>
        <ConsumerComponent />
      </ThemeProvider>,
    );
    // After useEffect fires isHydrated becomes true
    expect(screen.getByTestId('isHydrated').textContent).toBe('true');
  });
});

describe('ThemeProvider — colorMode', () => {
  beforeEach(resetStore);

  it('sets data-theme=dark on html when setColorMode(dark)', async () => {
    render(
      <ThemeProvider>
        <ConsumerComponent />
      </ThemeProvider>,
    );

    await act(async () => {
      useThemeStore.getState().setColorMode('dark');
    });

    expect(document.documentElement.getAttribute(DATA_THEME_ATTR)).toBe('dark');
    expect(document.documentElement.getAttribute(DATA_COREUI_ATTR)).toBe('dark');
  });

  it('removes data-theme when setColorMode(light)', async () => {
    document.documentElement.setAttribute(DATA_THEME_ATTR, 'dark');
    render(
      <ThemeProvider>
        <ConsumerComponent />
      </ThemeProvider>,
    );

    await act(async () => {
      useThemeStore.getState().setColorMode('light');
    });

    expect(document.documentElement.getAttribute(DATA_THEME_ATTR)).toBeNull();
  });
});

describe('ThemeProvider — productTheme', () => {
  beforeEach(resetStore);

  it('sets data-product attribute on html', async () => {
    render(
      <ThemeProvider>
        <ConsumerComponent />
      </ThemeProvider>,
    );

    await act(async () => {
      useThemeStore.getState().setProductTheme('food-os');
    });

    expect(document.documentElement.getAttribute(DATA_PRODUCT_ATTR)).toBe('food-os');
  });

  it('updates data-product when theme changes to crm-os', async () => {
    render(
      <ThemeProvider>
        <ConsumerComponent />
      </ThemeProvider>,
    );

    await act(async () => {
      useThemeStore.getState().setProductTheme('crm-os');
    });

    expect(document.documentElement.getAttribute(DATA_PRODUCT_ATTR)).toBe('crm-os');
  });
});

describe('ThemeProvider — toggleColorMode', () => {
  beforeEach(resetStore);

  it('toggles from light to dark', async () => {
    useThemeStore.setState({ colorMode: 'light', resolvedColorMode: 'light' });
    const { result } = renderHook(() => useThemeContext(), { wrapper: Wrapper });

    await act(async () => {
      result.current.toggleColorMode();
    });

    expect(useThemeStore.getState().resolvedColorMode).toBe('dark');
  });

  it('toggles from dark to light', async () => {
    useThemeStore.setState({ colorMode: 'dark', resolvedColorMode: 'dark' });
    const { result } = renderHook(() => useThemeContext(), { wrapper: Wrapper });

    await act(async () => {
      result.current.toggleColorMode();
    });

    expect(useThemeStore.getState().resolvedColorMode).toBe('light');
  });
});

describe('ThemeProvider — system preference', () => {
  beforeEach(resetStore);
  afterEach(() => { prefersDark = false; });

  it('resolves dark when OS prefers dark + colorMode=system', async () => {
    prefersDark = true;
    render(
      <ThemeProvider>
        <ConsumerComponent />
      </ThemeProvider>,
    );

    await act(async () => {
      useThemeStore.getState().setColorMode('system');
    });

    expect(useThemeStore.getState().resolvedColorMode).toBe('dark');
  });

  it('resolves light when OS prefers light + colorMode=system', async () => {
    prefersDark = false;
    render(
      <ThemeProvider>
        <ConsumerComponent />
      </ThemeProvider>,
    );

    await act(async () => {
      useThemeStore.getState().setColorMode('system');
    });

    expect(useThemeStore.getState().resolvedColorMode).toBe('light');
  });
});

describe('ThemeProvider — localStorage hydration', () => {
  beforeEach(resetStore);

  it('reads persisted dark mode on mount', async () => {
    storageMock['tos_color_mode'] = 'dark';

    render(
      <ThemeProvider>
        <ConsumerComponent />
      </ThemeProvider>,
    );

    // hydrate() is called in useEffect
    expect(useThemeStore.getState().colorMode).toBe('dark');
  });

  it('reads persisted food-os product theme on mount', async () => {
    storageMock['tos_product_theme'] = 'food-os';

    render(
      <ThemeProvider>
        <ConsumerComponent />
      </ThemeProvider>,
    );

    expect(useThemeStore.getState().productTheme).toBe('food-os');
  });
});
