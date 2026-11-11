'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/context/LanguageContext';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Droplets,
  HeartHandshake,
  Leaf,
  MessageCircle,
  Recycle,
  type LucideIcon,
} from 'lucide-react';

export const SustainabilitySection: React.FC<{ overviewOnly?: boolean }> = ({ overviewOnly = false }) => {
  const { t, dir } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  const reveal = (delay = 0) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 18 },
    whileInView: shouldReduceMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.5, delay },
  });

  if (overviewOnly) {
    const DirectionArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
    const overviewIcons = [Leaf, Droplets, HeartHandshake];

    return (
      <section id="sustainability" className="relative overflow-hidden border-y border-gold/15 bg-darkgreen/60 py-20 sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 start-1/2 hidden w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent lg:block" />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              <span aria-hidden="true" className="h-px w-8 bg-gold" />
              {t.sustainability.overviewEyebrow}
            </p>
            <h2 className="max-w-3xl text-3xl font-extrabold leading-tight text-offwhite sm:text-5xl">
              {t.sustainability.title}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-offwhite/75 sm:text-lg">
              {t.sustainability.overviewDescription}
            </p>
            <a
              href="/sustainability"
              className="group mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-gold px-6 py-3 text-sm font-bold text-darkgreen transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-darkgreen"
            >
              <span>{t.sustainability.overviewButton}</span>
              <DirectionArrow aria-hidden="true" className="h-4 w-4 transition-transform duration-300 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
            </a>
          </motion.div>

          <div className="border-y border-gold/20 lg:border-y-0 lg:border-s lg:ps-10">
            {t.sustainability.overviewPrinciples.map((principle, index) => {
              const PrincipleIcon = overviewIcons[index];

              return (
                <motion.div
                  key={principle}
                  initial={{ opacity: 0, x: dir === 'rtl' ? 12 : -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="flex items-center gap-5 border-b border-gold/15 py-5 last:border-b-0"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/25 bg-gold/5 text-gold">
                    <PrincipleIcon aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <span className="text-base font-semibold text-offwhite/90 sm:text-lg">{principle}</span>
                  <span dir="ltr" className="ms-auto font-english text-xs font-semibold tracking-[0.14em] text-gold/60">
                    0{index + 1}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  const pillarIcons: LucideIcon[] = [Leaf, Droplets, HeartHandshake, Recycle];

  return (
    <section id="sustainability" className="relative z-20 overflow-hidden bg-darkgreen text-offwhite">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-10 sm:px-6 sm:pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:pb-28 lg:pt-16">
        <motion.div {...reveal()}>
          <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            <span aria-hidden="true" className="h-px w-8 bg-gold" />
            {t.sustainability.pageEyebrow}
          </p>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.18] sm:text-5xl lg:text-6xl">
            {t.sustainability.pageTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-offwhite/75 sm:text-lg">
            {t.sustainability.pageIntro}
          </p>
          <p dir="ltr" className="mt-8 text-[10px] font-semibold tracking-[0.2em] text-gold/75">
            {t.sustainability.pageTagline}
          </p>
        </motion.div>

        <motion.div {...reveal(0.1)} className="relative h-[320px] overflow-hidden border border-gold/25 sm:h-[420px]">
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
            alt={t.sustainability.pageImageAlt}
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 640px"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-darkgreen/90 via-darkgreen/5 to-darkgreen/10" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <p dir="ltr" className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
              NILORIGEN BOTANICALS
            </p>
            <p className="mt-2 text-xl font-bold text-offwhite sm:text-2xl">
              {t.sustainability.pageImageCaption}
            </p>
          </div>
          <div aria-hidden="true" className="absolute end-4 top-4 h-12 w-12 border-e border-t border-gold/70 sm:end-6 sm:top-6 sm:h-16 sm:w-16" />
        </motion.div>
      </div>

      <div className="border-y border-gold/15 bg-darkgreen/65 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal()} className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              {t.sustainability.pillarsEyebrow}
            </p>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              {t.sustainability.pillarsTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-offwhite/65 sm:text-base">
              {t.sustainability.pillarsDescription}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
            {t.sustainability.pillars.map((pillar: { title: string; description: string }, index: number) => {
              const Icon = pillarIcons[index];

              return (
                <motion.article
                  key={pillar.title}
                  {...reveal(index * 0.06)}
                  className="group border-t border-gold/25 py-7 sm:py-9"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span dir="ltr" className="font-english text-sm font-semibold tracking-[0.16em] text-gold/65">
                      0{index + 1}
                    </span>
                    <Icon aria-hidden="true" className="h-5 w-5 text-gold transition-transform duration-300 group-hover:-translate-y-0.5" strokeWidth={1.6} />
                  </div>
                  <h3 className="text-xl font-bold text-offwhite sm:text-2xl">{pillar.title}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-offwhite/65 sm:text-base">
                    {pillar.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>

      <section className="bg-offwhite py-16 text-darkgreen sm:py-20" aria-labelledby="sustainability-principles-title">
        <div className="mx-auto grid max-w-7xl gap-9 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:px-8">
          <motion.div {...reveal()}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold-dark">
              {t.sustainability.principlesEyebrow}
            </p>
            <h2 id="sustainability-principles-title" className="text-3xl font-extrabold leading-tight sm:text-4xl">
              {t.sustainability.principlesTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-darkgreen/70 sm:text-base">
              {t.sustainability.principlesDescription}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 sm:divide-x sm:divide-darkgreen/15">
            {t.sustainability.overviewPrinciples.map((principle, index) => (
              <motion.div key={principle} {...reveal(index * 0.06)} className="border-t border-darkgreen/15 py-5 sm:border-t-0 sm:px-5 sm:first:ps-0 sm:last:pe-0">
                <span dir="ltr" className="font-english text-xs font-semibold tracking-[0.14em] text-gold-dark">0{index + 1}</span>
                <p className="mt-3 text-sm font-semibold leading-6 sm:text-base">{principle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gold/25 bg-darkgreen/80" aria-labelledby="sustainability-next-title">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-20">
          <motion.div {...reveal()} className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              {t.sustainability.closingEyebrow}
            </p>
            <h2 id="sustainability-next-title" className="text-3xl font-extrabold leading-tight sm:text-4xl">
              {t.sustainability.closingTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-offwhite/70 sm:text-base">
              {t.sustainability.closingDescription}
            </p>
          </motion.div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="/products" className="inline-flex min-h-12 items-center justify-center gap-2 bg-gold px-6 py-3 text-sm font-bold text-darkgreen transition-colors hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-darkgreen">
              {t.sustainability.productsButton}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
            <a href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 border border-offwhite/25 px-6 py-3 text-sm font-bold text-offwhite transition-colors hover:border-gold/70 hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-darkgreen">
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              {t.sustainability.contactButton}
            </a>
          </div>
        </div>
      </section>
    </section>
  );
};