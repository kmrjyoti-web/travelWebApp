"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoginTheme, THEME_CONFIG } from './ThemeContext';
import { Bird } from 'lucide-react';

// Pre-computed once at module load — avoids SSR/client Math.random() mismatch
const STARS = Array.from({ length: 50 }, () => ({
  w: Math.random() * 3 + 1,
  h: Math.random() * 3 + 1,
  top: Math.random() * 100,
  left: Math.random() * 100,
  dur: Math.random() * 3 + 2,
  delay: Math.random() * 2,
}));

const DATA_LINES = Array.from({ length: 20 }, () => ({
  height: Math.random() * 100 + 50,
  left: Math.random() * 100,
  dur: Math.random() * 5 + 5,
  delay: Math.random() * 5,
}));

const PARTICLE_COLORS = ['bg-pink-500', 'bg-purple-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
const PARTICLES = Array.from({ length: 40 }, () => ({
  color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
  w: Math.random() * 10 + 5,
  h: Math.random() * 10 + 5,
  left: Math.random() * 100,
  x1: (Math.random() - 0.5) * 100,
  x2: (Math.random() - 0.5) * 200,
  dur: Math.random() * 10 + 10,
  delay: Math.random() * 5,
}));

const BIRDS = Array.from({ length: 8 }, () => ({
  top: Math.random() * 40 + 10,
  y1: (Math.random() - 0.5) * 50,
  y2: (Math.random() - 0.5) * 100,
  dur: Math.random() * 15 + 15,
  delay: Math.random() * 10,
}));

const Stars = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" suppressHydrationWarning>
    {STARS.map((s, i) => (
      <motion.div
        key={i}
        className="absolute bg-white rounded-full"
        style={{ width: s.w + 'px', height: s.h + 'px', top: s.top + '%', left: s.left + '%' }}
        animate={{ opacity: [0.1, 1, 0.1] }}
        transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
        suppressHydrationWarning
      />
    ))}
  </div>
);

const DataLines = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" suppressHydrationWarning>
    {DATA_LINES.map((d, i) => (
      <motion.div
        key={i}
        className="absolute w-px bg-blue-400/50"
        style={{ height: d.height + 'px', left: d.left + '%', bottom: '-20%' }}
        animate={{ y: ['0vh', '-120vh'], opacity: [0, 1, 0] }}
        transition={{ duration: d.dur, repeat: Infinity, ease: "linear", delay: d.delay }}
        suppressHydrationWarning
      />
    ))}
  </div>
);

const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" suppressHydrationWarning>
    {PARTICLES.map((p, i) => (
      <motion.div
        key={i}
        className={`absolute rounded-full ${p.color} mix-blend-screen blur-[1px]`}
        style={{ width: p.w + 'px', height: p.h + 'px', bottom: '-10%', left: p.left + '%' }}
        animate={{ y: ['0vh', '-110vh'], x: [p.x1, p.x2], opacity: [0, 0.8, 0], rotate: [0, 360] }}
        transition={{ duration: p.dur, repeat: Infinity, ease: "linear", delay: p.delay }}
        suppressHydrationWarning
      />
    ))}
  </div>
);

const Birds = ({ returning = false }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" suppressHydrationWarning>
    {BIRDS.map((b, i) => (
      <motion.div
        key={i}
        className="absolute text-black/40"
        style={{ top: b.top + '%', [returning ? 'right' : 'left']: '-5%' }}
        animate={{ x: returning ? ['0vw', '-110vw'] : ['0vw', '110vw'], y: [b.y1, b.y2] }}
        transition={{ duration: b.dur, repeat: Infinity, ease: "linear", delay: b.delay }}
        suppressHydrationWarning
      >
        <Bird size={24} className={returning ? 'rotate-180' : ''} />
      </motion.div>
    ))}
  </div>
);

export function BackgroundStage() {
  const { mode, reducedMotion } = useLoginTheme();
  const config = THEME_CONFIG[mode];
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="fixed inset-0 z-0 bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <motion.img
            src={config.image}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
            animate={reducedMotion ? {} : { scale: [1.05, 1] }}
            transition={{ duration: 10, ease: "easeOut" }}
          />
          <div className={`absolute inset-0 ${config.overlay} transition-colors duration-1000`} />

          {mounted && !reducedMotion && (
            <>
              {mode === 'night' && <Stars />}
              {mode === 'work' && <DataLines />}
              {mode === 'holi' && <Particles />}
              {mode === 'morning' && <Birds />}
              {mode === 'evening' && <Birds returning />}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
