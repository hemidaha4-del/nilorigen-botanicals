'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/lib/context/LanguageContext';

const MAX_PRELOADER_MS = 1200;
const MIN_PRELOADER_MS = 450;

export const Preloader: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    setIsMounted(true);
    setIsLoading(true);

    const startedAt = Date.now();
    let isFinished = false;
    let fadeTimer: number | undefined;

    const finish = () => {
      if (isFinished) return;
      isFinished = true;
      const remainingMinimum = Math.max(MIN_PRELOADER_MS - (Date.now() - startedAt), 0);
      fadeTimer = window.setTimeout(() => setIsLoading(false), remainingMinimum);
    };

    const fallbackTimer = window.setTimeout(() => setIsLoading(false), MAX_PRELOADER_MS);
    const handleLoad = () => finish();

    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', handleLoad, { once: true });
    }

    return () => {
      window.clearTimeout(fallbackTimer);
      if (fadeTimer !== undefined) window.clearTimeout(fadeTimer);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <AnimatePresence>
      {isMounted && isLoading && (
        <motion.div
          key="nilorigen-splash-preloader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1, pointerEvents: 'auto' }}
          exit={{
            opacity: 0,
            pointerEvents: 'none',
            transition: { duration: 0.35, ease: 'easeInOut' },
          }}
          role="status"
          aria-live="polite"
          aria-label={lang === 'ar' ? 'جارٍ تحميل نيل أوريجين بوتانيكلز' : 'Loading Nilorigen Botanicals'}
          className="pointer-events-auto fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#073B2A] text-offwhite select-none"
          style={{ willChange: 'opacity' }}
        >
          {/* Subtle ambient luxury backdrop glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,155,74,0.18)_0%,transparent_65%)] pointer-events-none"
          />

          {/* Centered Logo & Halo Container */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative flex items-center justify-center p-6 sm:p-7">
              {/* Outer Golden Ambient Glow */}
              <motion.div
                initial={{ opacity: 0.4, scale: 0.9 }}
                animate={{
                  opacity: [0.35, 0.7, 0.35],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 rounded-full bg-gold/10 blur-xl pointer-events-none"
              />

              {/* Progress Ring */}
              <svg
                aria-hidden="true"
                className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                viewBox="0 0 100 100"
              >
                {/* Background Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-gold/20"
                  strokeWidth="1.5"
                  fill="none"
                />
                {/* Animated Golden Progress */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-gold"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="283"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{
                    duration: 1.1,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                />
              </svg>

              {/* Brand SVG Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{
                  opacity: 1,
                  scale: [0.96, 1.02, 0.97, 1],
                }}
                transition={{
                  opacity: { duration: 0.4 },
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
                className="relative z-10 flex items-center justify-center"
              >
                <Image
                  src="/logo/icon.svg"
                  alt=""
                  width={84}
                  height={84}
                  fetchPriority="high"
                  className="h-16 w-16 sm:h-20 sm:w-20 object-contain drop-shadow-[0_0_25px_rgba(197,155,74,0.45)]"
                />
              </motion.div>
            </div>

            {/* Typography */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="mt-6 flex flex-col items-center text-center"
            >
              <span className="text-lg sm:text-xl font-extrabold tracking-[0.28em] text-offwhite font-english leading-none uppercase">
                Nilorigen
              </span>
              <span className="text-[10px] sm:text-xs tracking-[0.38em] text-gold font-bold uppercase mt-2 font-english">
                Botanicals
              </span>
            </motion.div>

            {/* Subtle Progress Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="mt-7 w-28 sm:w-36 h-[2px] bg-gold/15 rounded-full overflow-hidden relative"
            >
              <motion.div
                className="h-full w-full bg-gradient-to-r from-transparent via-gold to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
