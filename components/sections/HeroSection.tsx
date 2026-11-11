'use client';

import React from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { t, dir } = useLanguage();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Visual Overlay Dark Ambient Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-darkgreen/60 via-darkgreen/40 to-darkgreen pointer-events-none z-10" />

      <div className="relative z-20 max-w-5xl mx-auto px-4 text-center">
        {/* Egyptian Heritage Gold Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 bg-gold/10 backdrop-blur-md mb-6"
        >
          <Sparkles className="w-4 h-4 text-gold" />
          <span className="text-xs sm:text-sm font-medium text-gold tracking-wide">
            {t.hero.badge}
          </span>
        </motion.div>

        {/* Main Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-offwhite tracking-tight leading-tight mb-4"
        >
          <span className="block">{t.hero.titleMain}</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-gold">
            {t.hero.titleSub}
          </span>
        </motion.h1>

        {/* Subtitle / Company Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl font-light text-offwhite/90 max-w-2xl mx-auto leading-relaxed mb-8"
        >
          {t.hero.description}
        </motion.p>

        {/* Call To Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gold hover:bg-gold-light text-darkgreen font-bold text-base transition-all shadow-lg shadow-gold/20 hover:scale-105"
          >
            <span>{t.hero.exploreBtn}</span>
            {dir === 'rtl' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </a>

          <a
            href="#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-gold/40 hover:border-gold bg-darkgreen/40 hover:bg-darkgreen/70 backdrop-blur-md text-offwhite font-medium text-base transition-all"
          >
            {t.hero.contactBtn}
          </a>
        </motion.div>
      </div>

      {/* Subtle Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-gold/60 hover:text-gold transition-colors"
      >
        <a href="#about" aria-label="Scroll Down">
          <ChevronDown className="w-8 h-8" />
        </a>
      </motion.div>
    </section>
  );
};