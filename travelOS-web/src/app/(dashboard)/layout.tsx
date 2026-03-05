'use client';

import { useState } from 'react';
import Header from '@/features/layout/Header';
import Sidebar from '@/features/layout/Sidebar';
import HorizontalMenu from '@/features/layout/HorizontalMenu';
import Footer from '@/features/layout/Footer';
import { useUIKitTheme } from '@/features/theme/ThemeProvider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme } = useUIKitTheme();

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
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        {theme.menuOrientation === 'horizontal' && <HorizontalMenu />}
        <div className={`flex-1 flex overflow-hidden ${theme.sidebarPosition === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
          {theme.menuOrientation === 'vertical' && <Sidebar isOpen={isSidebarOpen} />}
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
}
