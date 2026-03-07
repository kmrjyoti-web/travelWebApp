'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/stores/auth.store';
import { useUIKitTheme } from '@/features/theme/ThemeProvider';
import Header from '@/features/layout/Header';
import { useUIStore } from '@/shared/stores/ui.store';
import { SidePanelRenderer, SidePanelTaskbar } from '@/shared/components';

export default function PublisherLayout({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { theme } = useUIKitTheme();
  const { toggleSidebar } = useUIStore();

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) router.replace('/login');
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) return null;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden font-sans relative">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: 'var(--app-bg-image)',
          backgroundColor: 'var(--app-bg-color)',
          opacity: 'var(--app-bg-opacity)',
        }}
      />

      {/* Content */}
      <div className={`relative z-10 flex flex-col h-full w-full ${theme.layoutWidth === 'boxed' ? 'max-w-[1600px] mx-auto shadow-2xl' : ''}`}>
        {/* Header — same app header, no sidebar toggle needed */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Full-height, zero-padding content area */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>

      <SidePanelRenderer />
      <SidePanelTaskbar />
    </div>
  );
}
