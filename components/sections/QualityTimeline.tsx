'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/context/LanguageContext';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  PackageCheck,
  SearchCheck,
  Ship,
  Sprout,
  Sun,
  type LucideIcon,
} from 'lucide-react';

export const QualityTimeline: React.FC<{ overviewOnly?: boolean; standalonePage?: boolean }> = ({
  overviewOnly = false,
  standalonePage = false,
}) => {
  const { t, dir } = useLanguage();
  const reduceMotion = useReducedMotion();
  const QualityHeading = standalonePage ? 'h1' : 'h2';

  const reveal = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 18 },
    whileInView: reduceMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.5, delay },
  });

  if (overviewOnly) {
    const DirectionArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
    const overviewIcons = [Sprout, ClipboardCheck, CheckCircle2];

    return (
      <section id="quality" className="relative overflow-hidden border-y border-gold/15 bg-darkgreen/45 py-20 sm:py-24">
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
              {t.quality.overviewEyebrow}
            </p>
            <h2 className="max-w-3xl text-3xl font-extrabold leading-tight text-offwhite sm:text-5xl">
              {t.quality.title}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-offwhite/75 sm:text-lg">
              {t.quality.overviewDescription}
            </p>
            <a
              href="/quality"
              className="group mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-gold px-6 py-3 text-sm font-bold text-darkgreen transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-darkgreen"
            >
              <span>{t.quality.overviewButton}</span>
              <DirectionArrow aria-hidden="true" className="h-4 w-4 transition-transform duration-300 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
            </a>
          </motion.div>

          <div className="border-y border-gold/20 lg:border-y-0 lg:border-s lg:ps-10">
            {t.quality.overviewPrinciples.map((principle, index) => {
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

  const stepIcons: LucideIcon[] = [Sprout, SearchCheck, Sun, ClipboardCheck, PackageCheck, Ship];
  const DirectionArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section id="quality" className="relative z-20 overflow-hidden bg-darkgreen text-offwhite">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-10 sm:px-6 sm:pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:pb-28 lg:pt-16">
        <motion.div {...reveal()}>
          <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            <span aria-hidden="true" className="h-px w-8 bg-gold" />
            {t.quality.pageEyebrow}
          </p>
          <QualityHeading className="max-w-2xl text-4xl font-extrabold leading-[1.18] sm:text-5xl lg:text-6xl">
            {t.quality.pageTitle}
          </QualityHeading>
          <p className="mt-6 max-w-2xl text-base leading-8 text-offwhite/75 sm:text-lg">
            {t.quality.pageIntro}
          </p>
          <p dir="ltr" className="mt-8 text-[10px] font-semibold tracking-[0.2em] text-gold/75">
            {t.quality.pageTagline}
          </p>
        </motion.div>

        <motion.div {...reveal(0.1)} className="relative h-[320px] overflow-hidden border border-gold/25 sm:h-[420px]">
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
            alt={t.quality.pageImageAlt}
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 640px"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-darkgreen/90 via-darkgreen/5 to-darkgreen/10" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <p dir="ltr" className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">NILORIGEN BOTANICALS</p>
            <p className="mt-2 text-xl font-bold text-offwhite sm:text-2xl">{t.quality.pageImageCaption}</p>
          </div>
          <div aria-hidden="true" className="absolute end-4 top-4 h-12 w-12 border-e border-t border-gold/70 sm:end-6 sm:top-6 sm:h-16 sm:w-16" />
        </motion.div>
      </div>

      <div className="border-y border-gold/15 bg-darkgreen/65 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal()} className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold">{t.quality.journeyEyebrow}</p>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">{t.quality.journeyTitle}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-offwhite/65 sm:text-base">{t.quality.journeyDescription}</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
            {t.quality.steps.map((step, index) => {
              const Icon = stepIcons[index];

              return (
                <motion.article key={step.number} {...reveal(index * 0.05)} className="group border-t border-gold/25 py-7 sm:py-9">
                  <div className="mb-5 flex items-center justify-between">
                    <span dir="ltr" className="font-english text-sm font-semibold tracking-[0.16em] text-gold/65">{step.number}</span>
                    <Icon aria-hidden="true" className="h-5 w-5 text-gold transition-transform duration-300 group-hover:-translate-y-0.5" strokeWidth={1.6} />
                  </div>
                  <h3 className="text-xl font-bold text-offwhite sm:text-2xl">{step.title}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-offwhite/65 sm:text-base">{step.desc}</p>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-8 flex items-start gap-4 border-s-2 border-gold/60 bg-white/[0.025] px-5 py-5 sm:px-6">
            <FileCheck2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.6} />
            <p className="text-sm leading-7 text-offwhite/70">{t.quality.evidenceNote}</p>
          </div>
        </div>
      </div>

      <section className="bg-offwhite py-16 text-darkgreen sm:py-20" aria-labelledby="quality-principles-title">
        <div className="mx-auto grid max-w-7xl gap-9 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:px-8">
          <motion.div {...reveal()}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold-dark">{t.quality.principlesEyebrow}</p>
            <h2 id="quality-principles-title" className="text-3xl font-extrabold leading-tight sm:text-4xl">{t.quality.principlesTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-darkgreen/70 sm:text-base">{t.quality.principlesDescription}</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 sm:divide-x sm:divide-darkgreen/15">
            {t.quality.principles.map((principle, index) => (
              <motion.div key={principle} {...reveal(index * 0.05)} className="border-t border-darkgreen/15 py-5 sm:border-t-0 sm:px-5 sm:first:ps-0 sm:last:pe-0">
                <span dir="ltr" className="font-english text-xs font-semibold tracking-[0.14em] text-gold-dark">0{index + 1}</span>
                <p className="mt-3 text-sm font-semibold leading-6 sm:text-base">{principle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gold/25 bg-darkgreen/80" aria-labelledby="quality-market-title">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-20">
          <motion.div {...reveal()} className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold">{t.quality.marketEyebrow}</p>
            <h2 id="quality-market-title" className="text-3xl font-extrabold leading-tight sm:text-4xl">{t.quality.marketTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-offwhite/70 sm:text-base">{t.quality.marketDescription}</p>
          </motion.div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="/products" className="inline-flex min-h-12 items-center justify-center gap-2 bg-gold px-6 py-3 text-sm font-bold text-darkgreen transition-colors hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-darkgreen">
              {t.quality.productsButton}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
            <a href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 border border-offwhite/25 px-6 py-3 text-sm font-bold text-offwhite transition-colors hover:border-gold/70 hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-darkgreen">
              {t.quality.contactButton}
              <DirectionArrow aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </section>
  );
};