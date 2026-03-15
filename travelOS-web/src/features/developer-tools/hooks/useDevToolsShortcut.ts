'use client';
import { useEffect } from 'react';
import { useDevToolsStore } from '../stores/devtools.store';

/**
 * Registers the Ctrl+Shift+D (Cmd+Shift+D on Mac) keyboard shortcut
 * to toggle the DevTools panel open/closed.
 */
export function useDevToolsShortcut(): void {
  const toggle = useDevToolsStore((s) => s.toggle);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggle]);
}
