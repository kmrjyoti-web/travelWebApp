"use client";
import React from 'react';
import { ThemeProvider, useLoginTheme } from '@/features/auth/login/ThemeContext';
import { BackgroundStage } from '@/features/auth/login/BackgroundSystem';
import { GlassCard, LoginForm, OnboardingCarousel, ThemeSwitcher } from '@/features/auth/login/UIComponents';
import { AnimatePresence, motion } from 'framer-motion';

function LoginContent() {
  const { view } = useLoginTheme();

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden font-sans">
      <BackgroundStage />

      <div className="relative z-10 w-full max-w-md perspective-1000">
        <AnimatePresence mode="wait">
          {view === 'login' ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, rotateY: -10, scale: 0.95 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: 10, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard>
                <LoginForm />
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, rotateY: -10, scale: 0.95 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: 10, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard>
                <OnboardingCarousel />
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ThemeSwitcher />
    </main>
  );
}

export default function LoginPage() {
  return (
    <ThemeProvider>
      <LoginContent />
    </ThemeProvider>
  );
}
