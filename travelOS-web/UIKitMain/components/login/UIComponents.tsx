"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLoginTheme, THEME_CONFIG } from './ThemeContext';
import { Volume2, VolumeX, Moon, Sun, Briefcase, Sunset, PartyPopper, ArrowRight, Loader2, Github, Twitter } from 'lucide-react';

export function GlassCard({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, y: 0, backdropFilter: "blur(16px)" }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`bg-black/40 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-3xl p-8 w-full max-w-md relative z-10 overflow-hidden text-white ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function LoginForm() {
  const { mode, setView } = useLoginTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setView('onboarding');
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={48} className="text-white/80" />
        </motion.div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-medium">AI fetching your workspace...</h3>
          <p className="text-sm text-white/60">Syncing data packets and preferences</p>
        </div>
        {/* Data flow animation */}
        <div className="flex space-x-1 mt-4">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-8 bg-blue-400 rounded-full"
              animate={{ scaleY: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <motion.h1 
          key={mode}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold tracking-tight"
        >
          {THEME_CONFIG[mode].greeting}
        </motion.h1>
        <p className="text-white/60 text-sm">Sign in to continue to your workspace.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Email address" 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
            required
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded bg-white/10 border-white/20 text-blue-500 focus:ring-blue-500/50" />
            <span className="text-white/80">Remember me</span>
          </label>
          <a href="#" className="text-white/80 hover:text-white transition-colors">Forgot password?</a>
        </div>

        <button type="submit" className="w-full bg-white text-black font-semibold rounded-xl px-4 py-3 hover:bg-white/90 transition-colors flex items-center justify-center space-x-2">
          <span>Login</span>
          <ArrowRight size={18} />
        </button>
      </form>

      <div className="pt-6 border-t border-white/10 text-center space-y-4">
        <p className="text-sm text-white/60">Or continue with</p>
        <div className="flex justify-center space-x-4">
          <button type="button" className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10"><Github size={20} /></button>
          <button type="button" className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10"><Twitter size={20} /></button>
        </div>
        <p className="text-sm text-white/60">
          Don't have an account? <a href="#" className="text-white font-medium hover:underline">Create one</a>
        </p>
      </div>
    </div>
  );
}

export function OnboardingCarousel() {
  const [step, setStep] = useState(0);
  const slides = [
    { title: "Welcome to TravelOS", desc: "Your intelligent travel companion. Let's set up your workspace." },
    { title: "AI-Powered Insights", desc: "Get real-time analytics and dynamic itineraries tailored to your clients." },
    { title: "Global Reach", desc: "Connect with marketplaces and websites seamlessly from one dashboard." },
    { title: "You're Ready", desc: "Everything is configured. Let's build something amazing today." }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) setStep(step + 1);
    else window.location.href = '/'; // Go to dashboard
  };

  return (
    <div className="space-y-8 py-4">
      <div className="flex space-x-2 mb-8">
        {slides.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-white' : 'bg-white/20'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 min-h-[120px]"
        >
          <h2 className="text-3xl font-bold">{slides[step].title}</h2>
          <p className="text-white/70 leading-relaxed">{slides[step].desc}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between pt-8">
        <button 
          onClick={() => window.location.href = '/'} 
          className="text-white/60 hover:text-white transition-colors text-sm font-medium"
        >
          Skip
        </button>
        <button 
          onClick={handleNext}
          className="bg-white text-black font-semibold rounded-xl px-6 py-3 hover:bg-white/90 transition-colors flex items-center space-x-2"
        >
          <span>{step === slides.length - 1 ? 'Start' : 'Continue'}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

export function ThemeSwitcher() {
  const { mode, setMode, soundEnabled, setSoundEnabled } = useLoginTheme();
  
  const modes = [
    { id: 'morning', icon: Sun, label: 'Morning' },
    { id: 'work', icon: Briefcase, label: 'Work' },
    { id: 'evening', icon: Sunset, label: 'Evening' },
    { id: 'night', icon: Moon, label: 'Night' },
    { id: 'holi', icon: PartyPopper, label: 'Holi' },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-2">
      <div className="flex space-x-1 border-r border-white/20 pr-4">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id as any)}
              className={`p-2 rounded-full transition-all ${isActive ? 'bg-white text-black' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
              title={m.label}
            >
              <Icon size={16} />
            </button>
          );
        })}
      </div>
      <button 
        onClick={() => setSoundEnabled(!soundEnabled)}
        className={`p-2 rounded-full transition-all ${soundEnabled ? 'text-white' : 'text-white/40 hover:text-white/80'}`}
        title="Toggle Sound"
      >
        {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>
    </div>
  );
}
