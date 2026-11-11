'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Droplets, Sun, ChevronDown, ChevronUp, Sprout, Landmark, Globe } from 'lucide-react';

export const NileStorySection: React.FC<{ overviewOnly?: boolean; expandedByDefault?: boolean; standalonePage?: boolean }> = ({
  overviewOnly = false,
  expandedByDefault = false,
  standalonePage = false,
}) => {
  const { lang, t, dir } = useLanguage();
  const [expanded, setExpanded] = useState(expandedByDefault);
  const isAr = lang === 'ar';

  if (overviewOnly) {
    const DirectionArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
    const highlights = [Droplets, Sprout, Globe];

    return (
      <section id="nile-story" className="relative overflow-hidden border-y border-gold/15 bg-[#071d1a] py-20 sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 start-1/2 hidden w-px bg-gradient-to-b from-transparent via-gold/25 to-transparent lg:block" />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              <Sun aria-hidden="true" className="h-4 w-4" />
              {t.nileStory.overviewEyebrow}
            </p>
            <h2 className="max-w-3xl text-3xl font-extrabold leading-tight text-offwhite sm:text-5xl">
              {t.nileStory.title}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-offwhite/75 sm:text-lg">
              {t.nileStory.overviewDescription}
            </p>
            <a
              href="/nile-story"
              className="group mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-gold px-6 py-3 text-sm font-bold text-darkgreen transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#071d1a]"
            >
              <span>{t.nileStory.overviewButton}</span>
              <DirectionArrow aria-hidden="true" className="h-4 w-4 transition-transform duration-300 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
            </a>
          </motion.div>

          <div className="border-y border-gold/20 lg:border-y-0 lg:border-s lg:ps-10">
            {t.nileStory.overviewHighlights.map((highlight, index) => {
              const HighlightIcon = highlights[index];

              return (
                <motion.div
                  key={highlight}
                  initial={{ opacity: 0, x: dir === 'rtl' ? 12 : -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="flex items-center gap-5 border-b border-gold/15 py-5 last:border-b-0"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/25 bg-gold/5 text-gold">
                    <HighlightIcon aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <span className="text-base font-semibold text-offwhite/90 sm:text-lg">{highlight}</span>
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

  const sceneIcons = [
    <Droplets key="1" className="w-6 h-6 text-gold" />,
    <Landmark key="2" className="w-6 h-6 text-gold" />,
    <Sprout key="3" className="w-6 h-6 text-gold" />,
    <Globe key="4" className="w-6 h-6 text-gold" />,
  ];
  const StoryHeading = standalonePage ? 'h1' : 'h2';

  return (
    <section id="nile-story" className="relative py-24 sm:py-28 overflow-hidden bg-[#071d1a]">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,#d4ae62_0%,transparent_30%),radial-gradient(circle_at_bottom_right,#1d8a6a_0%,transparent_25%)]" />
      <div className="absolute inset-0 z-0 opacity-15 bg-[radial-gradient(#C59B4A_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-gold/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/10 text-gold text-[10px] sm:text-xs font-semibold tracking-[0.28em] uppercase backdrop-blur-sm">
            <Sun className="w-3.5 h-3.5" />
            <span>{t.nileStory.badge}</span>
          </div>

          <StoryHeading className="mt-6 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-offwhite">
            {t.nileStory.title}
          </StoryHeading>

          <p className="mt-5 text-base sm:text-lg text-offwhite/80 leading-relaxed max-w-3xl mx-auto">
            {t.nileStory.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { label: isAr ? 'أصالة النيل' : 'Nile Heritage', value: '5000+' },
            { label: isAr ? 'رؤية عالمية' : 'Global Vision', value: '40+' },
            { label: isAr ? 'ثقة في الجودة' : 'Quality Standard', value: '100%' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-gold/20 bg-white/3 backdrop-blur-sm p-5 text-center shadow-lg shadow-gold/5"
            >
              <div className="text-2xl font-black text-gold">{stat.value}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-offwhite/70">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="bg-charcoal/70 border border-gold/30 rounded-[28px] p-6 sm:p-8 lg:p-10 shadow-[0_30px_80px_rgba(11,20,17,0.55)] backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-emerald-400/5 pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 text-gold shadow-inner shadow-gold/20">
                <Droplets className="w-7 h-7" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-offwhite leading-tight">
                {isAr ? 'حين أصبح النيل سرّ الحياة' : 'When the Nile Became the Source of Life'}
              </h3>

              <p className="text-offwhite/80 text-sm sm:text-base leading-relaxed max-w-xl">
                {isAr
                  ? 'من ضفاف النيل العظيم، حيث ارتبطت الأرض بالماء والنماء بالحياة، وُلدت واحدة من أعرق حكايات الزراعة في التاريخ الإنساني.'
                  : 'Along the banks of the great Nile, where land met water and growth met life, one of history’s most ancient agricultural tales was born.'
                }
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden bg-darkgreen/80 border border-gold/20 rounded-[24px] p-6 sm:p-7 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent" />
              <div className="relative space-y-4">
                <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
                  {isAr ? 'الرؤية والقيادة' : 'Vision & Leadership'}
                </span>

                <h4 className="text-xl sm:text-2xl font-bold text-offwhite leading-snug">
                  {isAr ? 'محمد حميده البرعصي' : 'MOHAMED HEMIDAH AL-BARASI'}
                </h4>

                <p className="text-xs sm:text-sm text-offwhite/75 leading-relaxed">
                  {isAr
                    ? 'الشريك المؤسس والرئيس التنفيذي | حاملًا رؤية تربط بين أصالة الزراعة المصرية والأسواق الدولية.'
                    : 'Co-Founder & CEO | Bridging authentic Egyptian farming with international markets.'
                  }
                </p>

                <div className="pt-3 border-t border-white/10">
                  <p className="text-gold italic text-xs sm:text-sm font-medium leading-relaxed">
                    &ldquo;{isAr ? 'نستلهم من أرض مصر أصالتها، ونعمل على أن تصل خيراتها إلى العالم بجودة تستحق الثقة.' : 'We draw authenticity from Egypt’s soil, ensuring its harvest reaches the world with unmatched trust.'}&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden"
              >
                <div className="pt-12 mt-10 border-t border-gold/20 space-y-10">
                  <div className="text-center max-w-2xl mx-auto">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-gold">
                      {isAr ? 'المشاهد الأربعة لحكايتنا' : 'The Four Scenes of Our Story'}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-offwhite/70">
                      {isAr ? 'من جذور الحضارة إلى آفاق العالم' : 'From the roots of civilization to global horizons'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {t.nileStory.scenes.map((scene: { step: string; title: string; subtitle: string; paragraphs: string[] }, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.08 }}
                        className="group rounded-[24px] border border-gold/20 bg-darkgreen/60 p-5 sm:p-6 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-gold/10"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-2xl border border-gold/30 bg-gold/10 text-gold">
                            {sceneIcons[idx]}
                          </div>
                          <span className="text-2xl font-black text-gold/40 font-english">{scene.step}</span>
                        </div>

                        <h4 className="mt-5 text-lg font-bold text-offwhite">{scene.title}</h4>
                        <span className="mt-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-gold/80">
                          {scene.subtitle}
                        </span>

                        <div className="mt-4 space-y-3 border-t border-white/10 pt-4 text-offwhite/75 text-xs sm:text-sm leading-relaxed">
                          {scene.paragraphs.map((para: string, pIdx: number) => (
                            <p key={pIdx}>{para}</p>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="rounded-[24px] border border-gold/30 bg-gradient-to-r from-gold/15 via-transparent to-emerald-400/10 p-7 text-center">
                    <p className="text-base sm:text-lg font-bold text-offwhite">
                      {isAr ? '«من جذور الحضارة... إلى آفاق العالم»' : '«Rooted in heritage... connected to the world»'}
                    </p>
                    <span className="mt-3 block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.32em] text-gold">
                      NILORIGEN BOTANICALS
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 text-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gold text-darkgreen font-bold text-[11px] sm:text-xs uppercase tracking-[0.2em] shadow-[0_12px_28px_rgba(197,155,74,0.35)] transition-all duration-300 hover:scale-[1.02] hover:bg-gold-light"
            >
              <span>{expanded ? t.nileStory.readLessBtn : t.nileStory.readMoreBtn}</span>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};