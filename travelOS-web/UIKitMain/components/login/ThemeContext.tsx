"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'morning' | 'work' | 'evening' | 'night' | 'holi';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  view: 'login' | 'onboarding';
  setView: (view: 'login' | 'onboarding') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const THEME_CONFIG: Record<ThemeMode, { greeting: string; image: string; overlay: string }> = {
  morning: {
    greeting: "Good Morning. Let's begin.",
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=2560&auto=format&fit=crop",
    overlay: "bg-black/10"
  },
  work: {
    greeting: "Let's build. Stay focused.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2560&auto=format&fit=crop",
    overlay: "bg-blue-900/40"
  },
  evening: {
    greeting: "Good Evening. You did well today.",
    image: "https://images.unsplash.com/photo-1516815231560-8f41ec531527?q=80&w=2560&auto=format&fit=crop",
    overlay: "bg-black/30"
  },
  night: {
    greeting: "Good Night. Plan tomorrow.",
    image: "https://images.unsplash.com/photo-1507400492013-162706c8c05e?q=80&w=2560&auto=format&fit=crop",
    overlay: "bg-black/60"
  },
  holi: {
    greeting: "Happy Holi!",
    image: "https://images.unsplash.com/photo-1553605588-4f22af1088eb?q=80&w=2560&auto=format&fit=crop",
    overlay: "bg-black/20"
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('work');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [view, setView] = useState<'login' | 'onboarding'>('login');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 9) setMode('morning');
    else if (hour >= 9 && hour < 18) setMode('work');
    else if (hour >= 18 && hour < 21) setMode('evening');
    else setMode('night');
    
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, setMode, soundEnabled, setSoundEnabled, reducedMotion, setReducedMotion, view, setView }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useLoginTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useLoginTheme must be used within ThemeProvider");
  return context;
};
