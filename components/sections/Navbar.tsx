'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { Globe, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { lang, setLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/products', label: t.nav.products },
    { href: '/nile-story', label: t.nav.nileStory },
    { href: '/quality', label: t.nav.quality },
    { href: '/sustainability', label: t.nav.sustainability },
    { href: '/contact', label: t.nav.contact },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('/')) {
      return;
    }
    e.preventDefault();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-darkgreen/90 backdrop-blur-md border-b border-gold/20 shadow-xl py-3'
          : 'bg-gradient-to-b from-darkgreen/80 via-darkgreen/30 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Brand Logo Identity */}
        <Link
          href="/"
          onClick={(e) => handleNavClick(e, '/')}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <Image
            src="/logo/icon.svg"
            alt="Nilorigen Botanicals Logo"
            width={48}
            height={48}
            className="h-10 sm:h-12 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
          />
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold tracking-wider text-offwhite font-english leading-none">
              NILORIGEN
            </span>
            <span className="text-[10px] tracking-[0.22em] text-gold uppercase mt-1 font-english">
              BOTANICALS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium text-offwhite/85 hover:text-gold transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:start-0 after:w-0 after:h-[2px] after:bg-gold hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls & Language Switcher */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          <a
            href="/contact"
            onClick={(e) => handleNavClick(e, '/contact')}
            className="text-xs font-semibold px-4 py-2 rounded-full bg-gold hover:bg-gold-light text-darkgreen transition-all shadow-md hover:shadow-gold/25 cursor-pointer"
          >
            {t.nav.requestQuote}
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="p-1.5 text-gold border border-gold/30 rounded-full"
          >
            <Globe className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-offwhite hover:text-gold"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-darkgreen border-b border-gold/20 px-6 py-6"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-base font-medium text-offwhite hover:text-gold transition-colors py-2 border-b border-white/5 cursor-pointer block"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/contact"
                onClick={(e) => handleNavClick(e, '/contact')}
                className="mt-2 text-center text-sm font-semibold py-3 rounded-md bg-gold text-darkgreen cursor-pointer block"
              >
                {t.nav.requestQuote}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
