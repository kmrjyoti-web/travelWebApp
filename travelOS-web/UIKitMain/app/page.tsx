"use client";

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import HorizontalMenu from '@/components/HorizontalMenu';
import Footer from '@/components/Footer';
import { useTheme } from '@/components/ThemeProvider';
import ItineraryDashboard from '@/components/ItineraryDashboard';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme } = useTheme();

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden font-sans relative">
      {/* Background Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-300"
        style={{ 
          backgroundImage: 'var(--app-bg-image)',
          backgroundColor: 'var(--app-bg-color)',
          opacity: 'var(--app-bg-opacity)'
        }}
      />
      
      {/* Content Layer */}
      <div className={`relative z-10 flex flex-col h-full w-full transition-all duration-300 ${theme.layoutWidth === 'boxed' ? 'max-w-[1600px] mx-auto shadow-2xl ring-1 ring-black/5 bg-white/5' : ''}`}>
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        {theme.menuOrientation === 'horizontal' && <HorizontalMenu />}
        <div className={`flex-1 flex overflow-hidden ${theme.sidebarPosition === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
          {theme.menuOrientation === 'vertical' && <Sidebar isOpen={isSidebarOpen} />}
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <ItineraryDashboard />
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
}
