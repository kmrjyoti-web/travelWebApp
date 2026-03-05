import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMediaQuery } from './useMediaQuery';

// ─── Mock matchMedia ───────────────────────────────────────────────────────────

type Listener = (e: Partial<MediaQueryListEvent>) => void;

function makeMql(matches: boolean) {
  const listeners: Listener[] = [];
  const mql = {
    matches,
    addEventListener: vi.fn((_type: string, fn: Listener) => { listeners.push(fn); }),
    removeEventListener: vi.fn(),
    _emit(newMatches: boolean) {
      for (const fn of listeners) fn({ matches: newMatches } as MediaQueryListEvent);
    },
  };
  return mql;
}

describe('useMediaQuery', () => {
  let mqlInstance: ReturnType<typeof makeMql>;

  beforeEach(() => {
    mqlInstance = makeMql(false);
    vi.spyOn(window, 'matchMedia').mockReturnValue(
      mqlInstance as unknown as MediaQueryList,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns false when media query does not match', () => {
    mqlInstance = makeMql(false);
    vi.spyOn(window, 'matchMedia').mockReturnValue(
      mqlInstance as unknown as MediaQueryList,
    );

    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));
    expect(result.current).toBe(false);
  });

  it('returns true when media query matches', () => {
    mqlInstance = makeMql(true);
    vi.spyOn(window, 'matchMedia').mockReturnValue(
      mqlInstance as unknown as MediaQueryList,
    );

    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));
    expect(result.current).toBe(true);
  });

  it('updates when media query state changes', () => {
    mqlInstance = makeMql(false);
    vi.spyOn(window, 'matchMedia').mockReturnValue(
      mqlInstance as unknown as MediaQueryList,
    );

    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));
    expect(result.current).toBe(false);

    act(() => { mqlInstance._emit(true); });
    expect(result.current).toBe(true);

    act(() => { mqlInstance._emit(false); });
    expect(result.current).toBe(false);
  });

  it('calls removeEventListener on unmount', () => {
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    unmount();
    expect(mqlInstance.removeEventListener).toHaveBeenCalled();
  });

  it('uses defaultValue on SSR (window undefined)', () => {
    const origWindow = global.window;
    // @ts-expect-error simulating SSR
    delete global.window;

    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)', true));
    expect(result.current).toBe(true);

    global.window = origWindow;
  });
});
