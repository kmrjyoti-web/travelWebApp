'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { DefaultHeader, DefaultSidebar, DefaultFooter } from '@/shared/components/layout';
import { SidePanelRenderer, SidePanelTaskbar } from '@/shared/components';
import { useUIKitTheme } from '@/features/theme/ThemeProvider';
import { useAuthStore } from '@/shared/stores/auth.store';

const HorizontalMenu = dynamic(
  () => import('@/features/layout/HorizontalMenu'),
  { ssr: false },
);

const DevToolsPanel = dynamic(
  () => import('@/features/developer-tools').then((m) => ({ default: m.DevToolsPanel })),
  { ssr: false },
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const { theme } = useUIKitTheme();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isDevMode = process.env.NODE_ENV === 'development';

  // DevTools shortcut (dev only)
  useEffect(() => {
    if (!isDevMode) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toUpperCase() === 'D') {
        e.preventDefault();
        import('@/features/developer-tools').then((m) => m.useDevToolsStore.getState().toggle());
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isDevMode]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) return null;

  const isBoxed = theme.layoutWidth === 'boxed';
  const isRtl = theme.sidebarPosition === 'right';
  const isHorizontal = theme.menuOrientation === 'horizontal';

  return (
    <div className="tos-layout">
      {/* Background Layer */}
      <div className="tos-layout__bg" />

      {/* Content Layer */}
      <div className={`tos-layout__content ${isBoxed ? 'tos-layout--boxed' : ''}`}>
        <DefaultHeader />
        {isHorizontal && <HorizontalMenu />}
        <div className={`tos-layout__body ${isRtl ? 'tos-layout__body--rtl' : ''}`}>
          {/* Sidebar takes full height from header to bottom */}
          {!isHorizontal && <DefaultSidebar />}
          {/* Content column: main + footer */}
          <div className="tos-layout__content-col">
            <main className="tos-layout__main">
              {children}
            </main>
            <DefaultFooter />
          </div>
        </div>
      </div>

      {/* SidePanel system */}
      <SidePanelRenderer />
      <SidePanelTaskbar />
      {isDevMode && <DevToolsPanel />}
    </div>
  );
}
