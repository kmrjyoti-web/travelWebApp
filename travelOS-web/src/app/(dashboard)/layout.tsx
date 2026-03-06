'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/features/layout/Header';
import HorizontalMenu from '@/features/layout/HorizontalMenu';
import Footer from '@/features/layout/Footer';
import { DefaultSidebar } from '@/shared/components/layout';
import { SidePanelRenderer, SidePanelTaskbar } from '@/shared/components';
import { useUIStore } from '@/shared/stores/ui.store';
import { useUIKitTheme } from '@/features/theme/ThemeProvider';
import { useAuthStore } from '@/shared/stores/auth.store';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const { theme } = useUIKitTheme();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { toggleSidebar } = useUIStore();

  // Wait for Zustand persist to rehydrate from localStorage before checking auth.
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) return null;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden font-sans relative">
      {/* Background Layer */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-300"
        style={{
          backgroundImage: 'var(--app-bg-image)',
          backgroundColor: 'var(--app-bg-color)',
          opacity: 'var(--app-bg-opacity)',
        }}
      />

      {/* Content Layer */}
      <div className={`relative z-10 flex flex-col h-full w-full transition-all duration-300 ${theme.layoutWidth === 'boxed' ? 'max-w-[1600px] mx-auto shadow-2xl ring-1 ring-black/5 bg-white/5' : ''}`}>
        <Header toggleSidebar={toggleSidebar} />
        {theme.menuOrientation === 'horizontal' && <HorizontalMenu />}
        <div className={`flex-1 flex overflow-hidden ${theme.sidebarPosition === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
          {theme.menuOrientation === 'vertical' && <DefaultSidebar />}
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
          </main>
        </div>
        <Footer />
      </div>
      {/* SidePanel system — renders panels + minimized taskbar globally */}
      <SidePanelRenderer />
      <SidePanelTaskbar />
    </div>
  );
}
