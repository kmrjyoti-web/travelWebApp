'use client';
import { create } from 'zustand';

// Adapted from UI-KIT login/ThemeContext.tsx — 5 time-of-day themes
export type LoginThemeMode = 'morning' | 'work' | 'evening' | 'night' | 'holi';
export type LoginView = 'login' | 'otp' | 'forgot-password' | 'onboarding' | 'register';

interface ThemeConfig {
  greeting: string;
  description: string;
  bgImage: string;
  overlayOpacity: number;
  emoji: string;
}

export const THEME_CONFIG: Record<LoginThemeMode, ThemeConfig> = {
  morning: {
    greeting: 'Good Morning!',
    description: 'Start your travel journey with TravelOS',
    bgImage: 'https://picsum.photos/seed/sunrise/1920/1080',
    overlayOpacity: 0.45,
    emoji: '🌅',
  },
  work: {
    greeting: 'Ready to Work?',
    description: 'Manage your travel business efficiently',
    bgImage: 'https://picsum.photos/seed/office/1920/1080',
    overlayOpacity: 0.55,
    emoji: '💼',
  },
  evening: {
    greeting: 'Good Evening!',
    description: 'Wind down and review your travel bookings',
    bgImage: 'https://picsum.photos/seed/sunset/1920/1080',
    overlayOpacity: 0.5,
    emoji: '🌆',
  },
  night: {
    greeting: 'Good Night!',
    description: 'Late-night travel planning made easy',
    bgImage: 'https://picsum.photos/seed/nightsky/1920/1080',
    overlayOpacity: 0.6,
    emoji: '🌙',
  },
  holi: {
    greeting: 'Happy Holi!',
    description: 'Celebrate the festival of colors with TravelOS',
    bgImage: 'https://picsum.photos/seed/colors/1920/1080',
    overlayOpacity: 0.4,
    emoji: '🎨',
  },
};

// Auto-detect mode from current hour (adapted from ThemeContext.tsx)
function detectMode(): LoginThemeMode {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 9) return 'morning';
  if (hour >= 9 && hour < 18) return 'work';
  if (hour >= 18 && hour < 21) return 'evening';
  return 'night';
}

interface LoginThemeState {
  mode: LoginThemeMode;
  soundEnabled: boolean;
  reducedMotion: boolean;
  view: LoginView;
  setMode: (mode: LoginThemeMode) => void;
  setSoundEnabled: (val: boolean) => void;
  setView: (view: LoginView) => void;
}

export const useLoginTheme = create<LoginThemeState>((set) => ({
  mode: detectMode(),
  soundEnabled: false,
  reducedMotion:
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  view: 'login',
  setMode: (mode) => set({ mode }),
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
  setView: (view) => set({ view }),
}));
