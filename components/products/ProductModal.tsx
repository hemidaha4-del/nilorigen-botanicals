'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { useLanguage } from '@/lib/context/LanguageContext';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, CheckCircle2, Globe2 } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { lang, t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          key={product.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <motion.button
            type="button"
            aria-label={t.products.closeDetails}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            layoutId={prefersReducedMotion ? undefined : `product-card-${product.id}`}
            transition={{
              layout: { duration: prefersReducedMotion ? 0.01 : 0.45, ease: [0.22, 1, 0.36, 1] },
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            tabIndex={-1}
            style={{ backgroundColor: '#073B2A' }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-gold/30 bg-darkgreen shadow-2xl"
          >
            <button
              onClick={onClose}
              type="button"
              aria-label={t.products.closeDetails}
              className="absolute top-4 end-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-offwhite backdrop-blur-md transition-colors hover:text-gold"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-6 overflow-y-auto p-6 sm:p-8">
              <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
                <div className="aspect-[4/3] overflow-hidden border border-gold/20">
                  <Image
                    src={product.image}
                    alt={product.name[lang]}
                    width={800}
                    height={640}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <span dir="ltr" className="font-english text-xs italic text-gold">{product.botanicalName}</span>
                  <h2 id="product-modal-title" className="mb-3 mt-2 text-2xl font-bold text-offwhite sm:text-3xl">
                    {product.name[lang]}
                  </h2>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-gold">
                      {t.products.categories[product.category]}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-nile/30 bg-nile/20 px-3 py-1 text-xs text-nile-light">
                      <Globe2 className="h-3.5 w-3.5" />
                      {product.origin[lang]}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-offwhite/80">
                    {product.description[lang]}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 border-t border-white/10 pt-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-3 text-sm font-bold text-gold">{t.products.formsLabel}</h4>
                  <ul className="space-y-2">
                    {product.availableForms[lang].map((form, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-offwhite/90">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-botanical-light" />
                        <span>{form}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 text-sm font-bold text-gold">{t.products.appsLabel}</h4>
                  <ul className="space-y-2">
                    {product.applications[lang].map((app, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-offwhite/90">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-botanical-light" />
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end border-t border-white/10 pt-4">
                <a
                  href="/contact"
                  onClick={onClose}
                  className="w-full rounded-xl bg-gold px-6 py-3 text-center text-sm font-bold text-darkgreen transition-colors hover:bg-gold-light sm:w-auto"
                >
                  {t.nav.requestQuote}
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};