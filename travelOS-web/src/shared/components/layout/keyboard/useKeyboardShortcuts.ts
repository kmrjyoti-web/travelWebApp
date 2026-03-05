'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/shared/stores/ui.store';
import { SHORTCUTS, LAYOUT_CYCLE } from './shortcuts.config';
import type { UIStore } from '@/shared/types/theme.types';
import type { LayoutVariant } from '@/shared/types/theme.types';

function executeAction(action: string, store: UIStore, router: ReturnType<typeof useRouter>) {
  switch (action) {
    case 'toggle-sidebar':
      store.toggleSidebar();
      break;
    case 'open-settings':
      store.toggleSettings();
      break;
    case 'toggle-dark': {
      const nextMode = store.isDarkMode ? 'light' : 'dark';
      store.updateTheme({ themeMode: nextMode as UIStore['themeMode'] });
      break;
    }
    case 'toggle-layout': {
      const currentIdx = LAYOUT_CYCLE.indexOf(store.activeLayout as LayoutVariant);
      const nextLayout = LAYOUT_CYCLE[(currentIdx + 1) % LAYOUT_CYCLE.length];
      store.updateTheme({ activeLayout: nextLayout });
      break;
    }
    case 'show-shortcuts':
      store.toggleShortcutsModal();
      break;
    case 'close-panel':
      if (store.isSettingsOpen) store.toggleSettings();
      if (store.isShortcutsModalOpen) store.toggleShortcutsModal();
      break;
    case 'go-home':
      router.push('/dashboard');
      break;
    case 'open-search':
      // Emit a custom event — search components listen for this
      window.dispatchEvent(new CustomEvent('tos:open-search'));
      break;
    default:
      break;
  }
}

export function useKeyboardShortcuts() {
  const store = useUIStore();
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't fire when user is typing in an input
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Only allow Escape from inputs
        if (e.key !== 'Escape') return;
      }

      for (const shortcut of SHORTCUTS) {
        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          !!e.ctrlKey === !!shortcut.ctrl &&
          !!e.shiftKey === !!shortcut.shift &&
          !!e.altKey === !!shortcut.alt
        ) {
          // Check layout restriction
          if (shortcut.layouts && !shortcut.layouts.includes(store.activeLayout as LayoutVariant)) {
            continue;
          }
          e.preventDefault();
          executeAction(shortcut.action, store, router);
          break;
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [store, router]);
}
