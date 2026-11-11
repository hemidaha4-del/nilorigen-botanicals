'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { productsData } from '@/lib/data/products';
import { Product } from '@/types';
import { ProductCard } from '../products/ProductCard';
import { ProductModal } from '../products/ProductModal';
import { LayoutGroup, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Leaf, Search, X } from 'lucide-react';

export const ProductsSection: React.FC<{ overviewOnly?: boolean }> = ({ overviewOnly = false }) => {
  const { lang, t, dir } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');

  const normalizedSearch = search.trim().toLocaleLowerCase(lang);
  const filteredProducts = productsData.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const searchText = [
      product.name[lang],
      product.botanicalName,
      product.description[lang],
      product.origin[lang],
    ]
      .join(' ')
      .toLocaleLowerCase(lang);

    return matchesCategory && (!normalizedSearch || searchText.includes(normalizedSearch));
  });

  const categories = [
    { id: 'all', label: t.products.categories.all },
    { id: 'flowers', label: t.products.categories.flowers },
    { id: 'aromatic', label: t.products.categories.aromatic },
    { id: 'spices', label: t.products.categories.spices },
  ];

  if (overviewOnly) {
    const DirectionArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

    return (
      <section id="products" className="relative z-20 overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        <div aria-hidden="true" className="absolute inset-x-0 top-1/2 -z-10 mx-auto h-px max-w-5xl -translate-y-1/2 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-7 grid h-14 w-14 place-items-center rounded-full border border-gold/30 bg-darkgreen text-gold">
            <Leaf aria-hidden="true" className="h-6 w-6" strokeWidth={1.5} />
          </div>
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            {t.products.overviewBadge}
          </span>
          <h2 className="mb-5 text-3xl font-extrabold leading-tight text-offwhite sm:text-5xl">
            {t.products.overviewTitle}
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-8 text-offwhite/75 sm:text-lg">
            {t.products.overviewDescription}
          </p>
          <p dir="ltr" className="mt-6 text-[10px] font-semibold tracking-[0.2em] text-gold/75">
            {t.products.overviewTagline}
          </p>
          <a
            href="/products"
            className="group mt-9 inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-gold px-6 py-3 text-sm font-bold text-darkgreen transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-darkgreen"
          >
            <span>{t.products.overviewButton}</span>
            <DirectionArrow aria-hidden="true" className="h-4 w-4 transition-transform duration-300 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
          </a>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="relative z-20 mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8 lg:pb-28">
      <header className="grid gap-8 border-b border-gold/20 pb-9 lg:grid-cols-[1fr_0.62fr] lg:items-end">
        <div>
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            <span aria-hidden="true" className="h-px w-8 bg-gold" />
            {t.products.pageEyebrow}
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-offwhite sm:text-5xl lg:text-6xl">
            {t.products.pageTitle}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-offwhite/70 sm:text-lg">
            {t.products.pageDescription}
          </p>
        </div>

        <div className="w-full">
          <label htmlFor="product-search" className="mb-2 block text-xs font-semibold text-offwhite/70">
            {t.products.searchLabel}
          </label>
          <div className="flex min-h-12 items-center gap-3 border border-gold/30 bg-darkgreen/70 px-4 transition-colors focus-within:border-gold">
            <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-gold" />
            <input
              id="product-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t.products.searchPlaceholder}
              className="h-full min-w-0 flex-1 bg-transparent py-3 text-sm text-offwhite outline-none placeholder:text-offwhite/40"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label={t.products.clearSearch}
                className="grid h-8 w-8 shrink-0 place-items-center text-offwhite/60 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-5 border-b border-offwhite/10 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label={t.products.categoriesLabel} className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              aria-pressed={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`min-h-10 border px-4 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                activeCategory === category.id
                  ? 'border-gold bg-gold text-darkgreen'
                  : 'border-offwhite/15 text-offwhite/75 hover:border-gold/50 hover:text-gold'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="shrink-0 text-xs text-offwhite/55">
          <span className="font-english text-sm font-semibold text-offwhite">{filteredProducts.length}</span>{' '}
          {t.products.resultsLabel}
        </p>
      </div>

      <LayoutGroup id="product-details">
        {filteredProducts.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 gap-5 pt-7 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} onSelect={setSelectedProduct} />
            ))}
          </motion.div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg font-semibold text-offwhite">{t.products.emptyTitle}</p>
            <p className="mt-2 text-sm text-offwhite/60">{t.products.emptyDescription}</p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setActiveCategory('all');
              }}
              className="mt-5 text-sm font-semibold text-gold underline decoration-gold/50 underline-offset-4"
            >
              {t.products.resetFilters}
            </button>
          </div>
        )}

        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      </LayoutGroup>

      <div className="mt-16 flex flex-col gap-6 border-y border-gold/25 bg-offwhite px-6 py-8 text-darkgreen sm:px-9 sm:py-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-dark">{t.products.inquiryEyebrow}</p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{t.products.inquiryTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-darkgreen/70">{t.products.inquiryDescription}</p>
        </div>
        <a
          href="/contact"
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 bg-darkgreen px-6 py-3 text-sm font-bold text-offwhite transition-colors hover:bg-botanical-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          <span>{t.products.inquiryButton}</span>
          {dir === 'rtl' ? <ArrowLeft aria-hidden="true" className="h-4 w-4" /> : <ArrowRight aria-hidden="true" className="h-4 w-4" />}
        </a>
      </div>

    </section>
  );
};