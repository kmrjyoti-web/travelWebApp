import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useUIStore } from '@/shared/stores/ui.store';
import { DEFAULT_THEME } from '@/shared/constants/theme.constants';

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState({ ...DEFAULT_THEME });
  });

  it('starts with default theme', () => {
    const state = useUIStore.getState();
    expect(state.headerBg).toBe(DEFAULT_THEME.headerBg);
    expect(state.themeMode).toBe('light');
  });

  it('updateTheme merges partial updates', () => {
    act(() => {
      useUIStore.getState().updateTheme({ headerBg: '#ff0000' });
    });
    expect(useUIStore.getState().headerBg).toBe('#ff0000');
    expect(useUIStore.getState().sidebarBg).toBe(DEFAULT_THEME.sidebarBg); // unchanged
  });

  it('resetTheme restores defaults', () => {
    act(() => {
      useUIStore.getState().updateTheme({ headerBg: '#ff0000', fontSize: 20 });
      useUIStore.getState().resetTheme();
    });
    const state = useUIStore.getState();
    expect(state.headerBg).toBe(DEFAULT_THEME.headerBg);
    expect(state.fontSize).toBe(DEFAULT_THEME.fontSize);
  });

  it('toggleSettings flips isSettingsOpen', () => {
    expect(useUIStore.getState().isSettingsOpen).toBe(false);
    act(() => { useUIStore.getState().toggleSettings(); });
    expect(useUIStore.getState().isSettingsOpen).toBe(true);
    act(() => { useUIStore.getState().toggleSettings(); });
    expect(useUIStore.getState().isSettingsOpen).toBe(false);
  });

  it('toggleSidebar flips isSidebarOpen', () => {
    const initial = useUIStore.getState().isSidebarOpen;
    act(() => { useUIStore.getState().toggleSidebar(); });
    expect(useUIStore.getState().isSidebarOpen).toBe(!initial);
  });

  it('setDarkMode sets isDarkMode', () => {
    act(() => { useUIStore.getState().setDarkMode(true); });
    expect(useUIStore.getState().isDarkMode).toBe(true);
  });
});
