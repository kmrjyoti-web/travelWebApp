'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackgroundStage } from './BackgroundStage';
import { LoginForm } from './LoginForm';
import { OtpForm } from './OtpForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { RegistrationForm } from './RegistrationForm';
import { LoginThemeSwitcher } from './LoginThemeSwitcher';
import { useLoginTheme, THEME_CONFIG, type LoginView } from '../hooks/useLoginTheme';

const CARD_VARIANTS = {
  enter: { opacity: 0, y: 20, scale: 0.97 },
  center: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.97 },
};

export function LoginView() {
  const { mode } = useLoginTheme();
  const [view, setView] = useState<LoginView>('login');
  const [otpEmail, setOtpEmail] = useState('');
  const config = THEME_CONFIG[mode];

  const handleViewChange = (v: LoginView, email?: string) => {
    if (email) setOtpEmail(email);
    setView(v);
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Animated background */}
      <BackgroundStage />

      {/* Theme switcher (top-right) */}
      <LoginThemeSwitcher />

      {/* Time-of-day greeting (top-left) */}
      <div
        style={{
          position: 'absolute',
          top: 'var(--tos-spacing-lg)',
          left: 'var(--tos-spacing-lg)',
          zIndex: 20,
          color: 'rgba(255,255,255,0.85)',
        }}
      >
        <div style={{ fontSize: 13, opacity: 0.7 }}>{config.emoji} {config.greeting}</div>
        <div style={{ fontSize: 11, opacity: 0.5 }}>{config.description}</div>
      </div>

      {/* Login card */}
      <div className="tos-login-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            className="tos-login-card"
            variants={CARD_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {view === 'login' && (
              <LoginForm onViewChange={(v) => handleViewChange(v)} />
            )}
            {view === 'register' && (
              <RegistrationForm onViewChange={handleViewChange} />
            )}
            {view === 'otp' && (
              <OtpForm email={otpEmail || 'your@email.com'} onViewChange={handleViewChange} />
            )}
            {view === 'forgot-password' && (
              <ForgotPasswordForm onViewChange={handleViewChange} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
