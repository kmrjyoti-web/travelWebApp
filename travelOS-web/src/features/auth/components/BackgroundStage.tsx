'use client';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLoginTheme, THEME_CONFIG } from '../hooks/useLoginTheme';

// Adapted from UI-KIT BackgroundSystem.tsx — Stars, DataLines, Particles

function Stars({ count = 40, reducedMotion }: { count?: number; reducedMotion: boolean }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 3,
      })),
    [count]
  );

  if (reducedMotion) return null;

  return (
    <>
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="tos-star"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
          }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </>
  );
}

function DataLines({ count = 15, reducedMotion }: { count?: number; reducedMotion: boolean }) {
  const lines = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${5 + (i / count) * 90}%`,
        height: `${60 + Math.random() * 200}px`,
        top: `${Math.random() * 80}%`,
        duration: 2 + Math.random() * 2,
        delay: Math.random() * 3,
      })),
    [count]
  );

  if (reducedMotion) return null;

  return (
    <>
      {lines.map((l) => (
        <motion.div
          key={l.id}
          className="tos-data-line"
          style={{ left: l.left, height: l.height, top: l.top }}
          animate={{ opacity: [0, 0.6, 0], y: ['-60px', '60px'] }}
          transition={{ duration: l.duration, delay: l.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </>
  );
}

const PARTICLE_COLORS = ['#60a5fa', '#a78bfa', '#34d399', '#f472b6', '#fbbf24'];

function Particles({ count = 30, reducedMotion }: { count?: number; reducedMotion: boolean }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 4 + 2,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        duration: 3 + Math.random() * 3,
        delay: Math.random() * 2,
        dx: (Math.random() - 0.5) * 20,
        dy: (Math.random() - 0.5) * 20,
      })),
    [count]
  );

  if (reducedMotion) return null;

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="tos-particle"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
          }}
          animate={{
            x: [0, p.dx, 0],
            y: [0, p.dy, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </>
  );
}

export function BackgroundStage() {
  const { mode, reducedMotion } = useLoginTheme();
  const config = THEME_CONFIG[mode];
  const isNight = mode === 'night';

  return (
    <div className="tos-login-bg">
      <div
        className="tos-login-bg__image"
        style={{ backgroundImage: `url(${config.bgImage})` }}
      />
      <div
        className="tos-login-bg__overlay"
        style={{ background: `rgba(0,0,0,${config.overlayOpacity})` }}
      />
      {isNight && <Stars reducedMotion={reducedMotion} />}
      <DataLines reducedMotion={reducedMotion} />
      <Particles reducedMotion={reducedMotion} />
    </div>
  );
}
