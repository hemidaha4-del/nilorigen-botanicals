'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { useLanguage } from '@/lib/context/LanguageContext';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  index: number;
}

const MAX_STAGGER_INDEX = 6;
const STAGGER_INTERVAL = 0.08;

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, index }) => {
  const { lang, t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      layoutId={prefersReducedMotion ? undefined : `product-card-${product.id}`}
      layout={!prefersReducedMotion}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{
        duration: prefersReducedMotion ? 0.01 : 0.5,
        delay: prefersReducedMotion ? 0 : Math.min(index, MAX_STAGGER_INDEX) * STAGGER_INTERVAL,
        ease: [0.22, 1, 0.36, 1],
        layout: {
          duration: prefersReducedMotion ? 0.01 : 0.45,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      onClick={() => onSelect(product)}
      aria-label={`${t.products.viewDetails}: ${product.name[lang]}`}
      style={{ backgroundColor: '#073B2A' }}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-offwhite/10 bg-darkgreen text-start transition-all duration-300 hover:-translate-y-1 hover:border-gold/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal">
        <Image
          src={product.image}
          alt={product.name[lang]}
          width={800}
          height={600}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-darkgreen/60 via-transparent to-transparent" />
        <span className="absolute start-3 top-3 border border-white/20 bg-darkgreen/90 px-3 py-1 text-[10px] font-semibold text-offwhite backdrop-blur-sm">
          {t.products.categories[product.category]}
        </span>
      </div>

      <span className="flex flex-1 flex-col p-5 sm:p-6">
        <span dir="ltr" className="font-english text-xs italic text-gold/80">{product.botanicalName}</span>
        <span className="mt-2 text-xl font-bold text-offwhite transition-colors group-hover:text-gold">
          {product.name[lang]}
        </span>
        <span className="mt-3 line-clamp-3 text-sm leading-6 text-offwhite/65">
          {product.description[lang]}
        </span>

        <span className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <span className="min-w-0">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-offwhite/45">{t.products.originLabel}</span>
            <span className="mt-1 block text-xs font-medium text-offwhite/75">{product.origin[lang]}</span>
          </span>
          <span className="grid h-9 w-9 shrink-0 place-items-center border border-gold/25 text-gold transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-darkgreen">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </span>
      </span>
    </motion.button>
  );
};