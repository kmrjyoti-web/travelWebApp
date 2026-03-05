'use client';
import React from 'react';
import { useLoginTheme, type LoginThemeMode } from '../hooks/useLoginTheme';

const MODES: Array<{ value: LoginThemeMode; emoji: string; label: string }> = [
  { value: 'morning', emoji: '🌅', label: 'Morning' },
  { value: 'work', emoji: '💼', label: 'Work' },
  { value: 'evening', emoji: '🌆', label: 'Evening' },
  { value: 'night', emoji: '🌙', label: 'Night' },
  { value: 'holi', emoji: '🎨', label: 'Holi' },
];

export function LoginThemeSwitcher() {
  const { mode, setMode } = useLoginTheme();

  return (
    <div className="tos-login-theme-switcher">
      {MODES.map((m) => (
        <button
          key={m.value}
          type="button"
          className={`tos-login-theme-btn ${mode === m.value ? 'tos-login-theme-btn--active' : ''}`}
          title={m.label}
          onClick={() => setMode(m.value)}
        >
          {m.emoji}
        </button>
      ))}
    </div>
  );
}
