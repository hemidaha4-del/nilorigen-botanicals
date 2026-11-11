'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/context/LanguageContext';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  Filter,
  Leaf,
  MessageCircle,
  Package,
  Ship,
  Sprout,
  Sun,
  type LucideIcon,
} from 'lucide-react';

const journeyIcons: LucideIcon[] = [Sprout, Filter, Sun, ClipboardCheck, Package, Ship];
const principleIcons: LucideIcon[] = [Sprout, Leaf, ClipboardCheck, Package];

const ExpandedAboutStory: React.FC = () => {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const content = t.aboutPage;

  const reveal = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 22 },
    whileInView: reduceMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.55, delay },
  });

  return (
    <section id="about" className="relative z-20 overflow-hidden text-offwhite">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pb-28 lg:pt-16">
        <motion.div {...reveal()}>
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            <span className="h-px w-8 bg-gold" />
            {content.eyebrow}
          </p>
          <h1 className="mb-6 max-w-2xl text-4xl font-extrabold leading-[1.2] sm:text-5xl lg:text-[3.5rem]">
            {content.title}
          </h1>
          <p className="max-w-2xl text-base leading-8 text-offwhite/75 sm:text-lg">
            {content.description}
          </p>
          <p dir="ltr" className="mt-8 text-[11px] font-semibold tracking-[0.2em] text-gold/80">
            {content.tagline}
          </p>
        </motion.div>

        <motion.div {...reveal(0.12)} className="relative mx-auto w-full max-w-xl">
          <div className="relative h-[330px] overflow-hidden rounded-lg border border-gold/20 sm:h-[450px]">
            <Image
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
              alt={content.imageAlt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 576px"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-darkgreen/90 via-darkgreen/10 to-darkgreen/5" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="text-xl font-bold text-offwhite sm:text-2xl">{content.imageCaption}</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-offwhite/75">
                {content.imageDescription}
              </p>
            </div>
          </div>
          <div aria-hidden="true" className="absolute -bottom-3 -end-3 -z-10 h-24 w-24 border-b border-e border-gold/50" />
        </motion.div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <motion.div {...reveal()} className="mb-10 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            {content.journey.eyebrow}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              {content.journey.title}
            </h2>
            <p className="max-w-xl text-sm leading-7 text-offwhite/65 sm:text-base">
              {content.journey.description}
            </p>
          </div>
          <div aria-hidden="true" className="mt-7 flex gap-1.5">
            {content.journey.steps.map((step) => (
              <span key={step.number} className="h-0.5 flex-1 bg-gold/35 first:bg-gold" />
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {content.journey.steps.map((step, index) => {
            const Icon = journeyIcons[index];

            return (
              <motion.article
                key={step.number}
                {...reveal(index * 0.04)}
                className="group min-h-52 border border-offwhite/10 bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/45 hover:bg-white/[0.045] sm:p-7"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span dir="ltr" className="font-english text-3xl font-bold text-gold/75 transition-colors group-hover:text-gold-light">
                    {step.number}
                  </span>
                  <span className="grid h-11 w-11 place-items-center border border-gold/20 text-gold transition-colors group-hover:border-gold/50 group-hover:text-gold-light">
                    <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                </div>
                <h3 className="mb-3 text-xl font-bold text-offwhite">{step.title}</h3>
                <p className="text-sm leading-7 text-offwhite/65">{step.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>

      <section className="bg-offwhite py-16 text-darkgreen sm:py-20" aria-labelledby="about-principles-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal()} className="mb-10 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold-dark">
              {content.principles.eyebrow}
            </p>
            <h2 id="about-principles-title" className="text-3xl font-extrabold sm:text-4xl">
              {content.principles.title}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2 xl:grid-cols-4">
            {content.principles.items.map((item, index) => {
              const Icon = principleIcons[index];

              return (
                <motion.div
                  key={item}
                  {...reveal(index * 0.04)}
                  className="flex items-start gap-4 border-t border-darkgreen/15 py-6"
                >
                  <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" strokeWidth={1.7} />
                  <p className="text-base font-semibold leading-7">{item}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
        <motion.div {...reveal()}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            {content.commitment.eyebrow}
          </p>
          <h2 className="mb-5 text-3xl font-extrabold sm:text-4xl">{content.commitment.title}</h2>
          <p className="max-w-xl text-base leading-8 text-offwhite/70">
            {content.commitment.description}
          </p>
        </motion.div>
        <div className="border-y border-offwhite/10">
          {content.commitment.points.map((point, index) => (
            <motion.div
              key={point}
              {...reveal(index * 0.04)}
              className="flex items-center gap-4 border-b border-offwhite/10 py-5 last:border-b-0"
            >
              <CheckCircle2 aria-hidden="true" className="h-5 w-5 shrink-0 text-gold" strokeWidth={1.7} />
              <span className="text-base font-medium text-offwhite/85">{point}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <section className="border-t border-gold/35 bg-darkgreen/70" aria-labelledby="about-closing-title">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-20">
          <motion.div {...reveal()} className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.17em] text-gold">
              {content.closing.tagline}
            </p>
            <h2 id="about-closing-title" className="text-3xl font-extrabold leading-tight sm:text-4xl">
              {content.closing.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-offwhite/70 sm:text-base">
              {content.closing.description}
            </p>
          </motion.div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/products"
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-gold px-6 py-3 text-sm font-bold text-darkgreen transition-colors hover:bg-gold-light"
            >
              {content.closing.productsButton}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
            <a
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-offwhite/25 px-6 py-3 text-sm font-bold text-offwhite transition-colors hover:border-gold/70 hover:text-gold-light"
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              {content.closing.contactButton}
            </a>
          </div>
        </div>
      </section>
    </section>
  );
};

export const AboutSection: React.FC<{ expanded?: boolean }> = ({ expanded = false }) => {
  const { t, dir } = useLanguage();

  if (expanded) {
    return <ExpandedAboutStory />;
  }

  return (
    <section id="about" className="py-24 relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Visual Split Layout Left */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative h-[450px] sm:h-[550px] rounded-3xl overflow-hidden border border-gold/30 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
              alt="Egyptian Agricultural Land Nile"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 640px"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-darkgreen via-transparent to-transparent" />
          </div>

          {/* Floating Heritage Badge */}
          <div className="absolute -bottom-6 right-6 bg-darkgreen/90 border border-gold/40 backdrop-blur-md p-6 rounded-2xl max-w-xs shadow-xl hidden sm:block">
            <p className="text-xs text-gold uppercase tracking-wider font-semibold mb-1">
              Pure Egyptian Origin
            </p>
            <p className="text-sm text-offwhite/90 italic">
              &ldquo;Cultivating botanical excellence along the Nile River for global export.&rdquo;
            </p>
          </div>
        </motion.div>

        {/* Content Right */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs uppercase tracking-widest text-gold font-semibold mb-2 block">
            {t.about.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-offwhite mb-6 leading-tight">
            {t.about.title}
          </h2>
          <p className="text-base text-offwhite/80 leading-relaxed mb-8">
            {t.about.description}
          </p>

          {/* Animated Statistics */}
          <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-6">
            {t.about.stats.map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl sm:text-4xl font-extrabold text-gold font-english">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-offwhite/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
          <a
            href="/about"
            className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-md border border-gold/45 bg-gold/10 px-5 py-3 text-sm font-semibold text-gold transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-darkgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-darkgreen"
          >
            <span>{t.about.readMore}</span>
            <ArrowUpRight
              aria-hidden="true"
              className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${dir === 'rtl' ? '-scale-x-100' : ''}`}
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
};