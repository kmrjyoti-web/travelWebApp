"use client";
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLoginTheme, THEME_CONFIG } from './ThemeContext';
import { Bird } from 'lucide-react';

const Stars = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(50)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-white rounded-full"
        style={{
          width: Math.random() * 3 + 1 + 'px',
          height: Math.random() * 3 + 1 + 'px',
          top: Math.random() * 100 + '%',
          left: Math.random() * 100 + '%',
        }}
        animate={{ opacity: [0.1, 1, 0.1] }}
        transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
      />
    ))}
  </div>
);

const DataLines = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-px bg-blue-400/50"
        style={{
          height: Math.random() * 100 + 50 + 'px',
          left: Math.random() * 100 + '%',
          bottom: '-20%',
        }}
        animate={{ y: ['0vh', '-120vh'], opacity: [0, 1, 0] }}
        transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, ease: "linear", delay: Math.random() * 5 }}
      />
    ))}
  </div>
);

const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(40)].map((_, i) => {
      const colors = ['bg-pink-500', 'bg-purple-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      return (
        <motion.div
          key={i}
          className={`absolute rounded-full ${color} mix-blend-screen blur-[1px]`}
          style={{
            width: Math.random() * 10 + 5 + 'px',
            height: Math.random() * 10 + 5 + 'px',
            bottom: '-10%',
            left: Math.random() * 100 + '%',
          }}
          animate={{ 
            y: ['0vh', '-110vh'], 
            x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
            opacity: [0, 0.8, 0],
            rotate: [0, 360]
          }}
          transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "linear", delay: Math.random() * 5 }}
        />
      );
    })}
  </div>
);

const Birds = ({ returning = false }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute text-black/40"
        style={{
          top: Math.random() * 40 + 10 + '%',
          [returning ? 'right' : 'left']: '-5%',
        }}
        animate={{ 
          [returning ? 'x' : 'x']: returning ? ['0vw', '-110vw'] : ['0vw', '110vw'],
          y: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 100]
        }}
        transition={{ duration: Math.random() * 15 + 15, repeat: Infinity, ease: "linear", delay: Math.random() * 10 }}
      >
        <Bird size={24} className={returning ? 'rotate-180' : ''} />
      </motion.div>
    ))}
  </div>
);

export function BackgroundStage() {
  const { mode, reducedMotion } = useLoginTheme();
  const config = THEME_CONFIG[mode];

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
          
          {!reducedMotion && (
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
