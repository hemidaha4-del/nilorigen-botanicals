'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, Linkedin, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, t, dir } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState('');

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubscribing(true);
    setSubscriptionError('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result: { success?: boolean; alreadySubscribed?: boolean } = await response.json();

      if (!response.ok || !result.success) {
        setSubscriptionError(t.footer.subscriptionError);
        return;
      }

      setSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Failed to submit newsletter subscription', error);
      setSubscriptionError(t.footer.subscriptionError);
    } finally {
      setIsSubscribing(false);
    }
  };

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/products', label: t.nav.products },
    { href: '/nile-story', label: t.nav.nileStory },
    { href: '/quality', label: t.nav.quality },
    { href: '/sustainability', label: t.nav.sustainability },
    { href: '/contact', label: t.nav.contact },
  ];

  const whatsappMessage = encodeURIComponent(
    lang === 'ar'
      ? 'السلام عليكم، أود الاستفسار عن تفاصيل التصدير والمنتجات لدى Nilorigen Botanicals.'
      : 'Hello, I would like to inquire about export details and botanical products from Nilorigen Botanicals.'
  );

  return (
    <footer className="bg-charcoal border-t border-gold/20 pt-20 pb-10 relative z-20 text-offwhite/80 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">

          {/* Column 1: Brand & Bio */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-white p-1.5 rounded-xl border border-gold/40 shadow-md flex items-center justify-center">
                <Image
                  src="/logo/icon.svg"
                  alt="Nilorigen Botanicals Logo"
                  width={36}
                  height={36}
                  className="h-9 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-wider text-offwhite font-english leading-none">
                  NILORIGEN
                </span>
                <span className="text-[10px] tracking-[0.22em] text-gold font-bold uppercase mt-1 font-english">
                  BOTANICALS
                </span>
              </div>
            </Link>
            <p className="text-xs text-offwhite/70 leading-relaxed">
              {t.footer.description}
            </p>
            <div className="pt-1">
              <span className="text-xs font-semibold text-gold italic block">
                &quot;{t.footer.slogan}&quot;
              </span>
            </div>
          </div>

          {/* Column 2: Quick Navigation Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gold mb-5">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-offwhite/70 hover:text-gold transition-colors inline-block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Export Hub */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gold mb-5">
              {t.footer.contactInfo}
            </h4>
            <ul dir={dir} className="space-y-4 text-xs text-offwhite/70">
              <li className="flex items-start gap-3 text-start">
                <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span className="min-w-0">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-offwhite/45">
                    {t.contact.addressTitle}
                  </span>
                  <span className="mt-1 block leading-5 text-offwhite/80">{t.contact.address}</span>
                </span>
              </li>
              <li>
                <a href="mailto:export@nilorigen.com" className="flex items-start gap-3 text-start transition-colors hover:text-gold">
                  <Mail aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span className="min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-offwhite/45">
                      {t.contact.emailTitle}
                    </span>
                    <span dir="ltr" className="mt-1 block break-all text-start font-english text-offwhite/80">export@nilorigen.com</span>
                  </span>
                </a>
              </li>
              <li>
                <a href="tel:+201064410615" className="flex items-start gap-3 text-start transition-colors hover:text-gold">
                  <Phone aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span className="min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-offwhite/45">
                      {t.contact.phoneTitle}
                    </span>
                    <span dir="ltr" className="mt-1 block text-start font-english text-offwhite/80">+20 106 441 0615</span>
                  </span>
                </a>
              </li>
            </ul>

            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-offwhite/45">
                {lang === 'ar' ? 'تواصل مباشر' : 'Direct contact'}
              </p>
              <div className="flex flex-col gap-2.5">
                <a
                  href={`https://wa.me/201064410615?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-11 items-center gap-2.5 rounded-md border border-[#25D366]/35 bg-[#25D366]/[0.07] px-3.5 py-2 text-xs font-semibold text-[#65D88A] transition-all hover:border-gold/50 hover:bg-gold/[0.08] hover:text-gold hover:shadow-[0_0_18px_rgba(197,155,74,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
                >
                  <MessageCircle aria-hidden="true" className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span>{lang === 'ar' ? 'واتساب - مكتب التصدير' : 'WhatsApp Direct Export Desk'}</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/nilorigen-botanicals-9b9529447"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Nilorigen Botanicals on LinkedIn"
                  className="group inline-flex min-h-11 items-center gap-2.5 rounded-md border border-gold/30 bg-gold/[0.05] px-3.5 py-2 text-xs font-semibold text-gold/85 transition-all hover:border-gold/60 hover:bg-gold/[0.1] hover:text-gold hover:shadow-[0_0_18px_rgba(197,155,74,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
                >
                  <Linkedin aria-hidden="true" className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gold mb-2">
              {t.footer.newsletterTitle}
            </h4>
            <p className="text-xs text-offwhite/70 mb-4 leading-relaxed">
              {t.footer.newsletterSubtitle}
            </p>

            {subscribed ? (
              <div aria-live="polite" className="flex items-center gap-2 text-gold bg-gold/10 border border-gold/30 p-3 rounded-xl text-xs font-semibold animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{t.footer.subscribedMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5" aria-busy={isSubscribing}>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubscribing}
                    dir="ltr"
                    placeholder={t.footer.emailPlaceholder}
                    className="w-full bg-darkgreen/80 border border-gold/30 rounded-xl px-3.5 py-2.5 text-xs text-offwhite placeholder:text-offwhite/40 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                {subscriptionError && (
                  <p role="alert" className="text-xs leading-5 text-red-300">{subscriptionError}</p>
                )}
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="w-full py-2.5 px-4 rounded-xl bg-gold hover:bg-gold-light text-darkgreen font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:cursor-wait disabled:opacity-70"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubscribing ? t.footer.subscribing : t.footer.subscribe}</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-offwhite/50">
          <p>{t.footer.rights}</p>
          <div className="flex items-center gap-6">
            <span className="font-english tracking-widest text-[11px] text-gold/80">
              MADE IN EGYPT • GLOBAL EXPORT EXCELLENCE
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
