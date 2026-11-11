'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/context/LanguageContext';
import { ArrowLeft, ArrowRight, ClipboardList, MapPin, Mail, Phone, Send, CheckCircle2, MessageCircle, PackageCheck, Loader2 } from 'lucide-react';
export const ContactSection: React.FC<{ overviewOnly?: boolean }> = ({ overviewOnly = false }) => {
  const { lang, t, dir } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [notificationWarning, setNotificationWarning] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    country: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          company: formData.company,
          email: formData.email,
          destinationCountry: formData.country,
          specifications: formData.message,
        }),
      });
      const result: {
        success?: boolean;
        error?: string;
        notificationSent?: boolean;
      } = await response.json();

      if (!response.ok || !result.success) {
        setSubmitError(response.status === 400 ? t.contact.form.validationError : t.contact.form.submitError);
        return;
      }

      setNotificationWarning(result.notificationSent === false);
      setFormData({ fullName: '', company: '', email: '', country: '', message: '' });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit contact inquiry', error);
      setSubmitError(t.contact.form.submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    lang === 'ar'
      ? 'السلام عليكم ورحمة الله، أود الاستفسار عن منتجات التصدير والأعشاب الطبية والعطرية لدى Nilorigen Botanicals.'
      : 'Hello, I would like to inquire about bulk export botanical ingredients from Nilorigen Botanicals.'
  );

  if (overviewOnly) {
    const DirectionArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
    const experienceIcons = [ClipboardList, PackageCheck, MessageCircle];

    return (
      <section id="contact" className="relative overflow-hidden border-y border-gold/15 bg-darkgreen/75 py-20 sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 start-1/2 hidden w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent lg:block" />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              <span aria-hidden="true" className="h-px w-8 bg-gold" />
              {t.contact.overviewEyebrow}
            </p>
            <h2 className="max-w-3xl text-3xl font-extrabold leading-tight text-offwhite sm:text-5xl">
              {t.contact.title}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-offwhite/75 sm:text-lg">
              {t.contact.overviewDescription}
            </p>
            <a
              href="/contact"
              className="group mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-gold px-6 py-3 text-sm font-bold text-darkgreen transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-darkgreen"
            >
              <span>{t.contact.overviewButton}</span>
              <DirectionArrow aria-hidden="true" className="h-4 w-4 transition-transform duration-300 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
            </a>
          </div>

          <div className="border-y border-gold/20 lg:border-y-0 lg:border-s lg:ps-10">
            {t.contact.overviewSteps.map((step, index) => {
              const StepIcon = experienceIcons[index];

              return (
                <div key={step} className="flex items-center gap-5 border-b border-gold/15 py-5 last:border-b-0">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/25 bg-gold/5 text-gold">
                    <StepIcon aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <span className="text-base font-semibold leading-7 text-offwhite/90 sm:text-lg">{step}</span>
                  <span dir="ltr" className="ms-auto font-english text-xs font-semibold tracking-[0.14em] text-gold/60">
                    0{index + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  const contactMethods = [
    { icon: MapPin, label: t.contact.addressTitle, value: t.contact.address },
    { icon: Mail, label: t.contact.emailTitle, value: 'export@nilorigen.com', href: 'mailto:export@nilorigen.com' },
    { icon: Phone, label: t.contact.phoneTitle, value: '+20 106 441 0615', href: 'tel:+201064410615' },
  ];

  return (
    <section id="contact" className="relative z-20 overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,#c59b4a10,transparent_65%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <header className="mb-12 grid items-center gap-8 lg:grid-cols-[1fr_0.76fr] lg:gap-14">
          <div>
            <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              <span aria-hidden="true" className="h-px w-8 bg-gold" />
              {t.contact.pageEyebrow}
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-offwhite sm:text-5xl lg:text-6xl">
              {t.contact.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-offwhite/75 sm:text-lg">
              {t.contact.pageIntro}
            </p>
          </div>

          <div className="relative h-56 overflow-hidden border border-gold/25 sm:h-64 lg:h-72">
            <Image
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
              alt={t.contact.imageAlt}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-darkgreen/90 via-darkgreen/10 to-darkgreen/5" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
              <div>
                <p dir="ltr" className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                  NILORIGEN BOTANICALS
                </p>
                <p className="mt-2 text-lg font-bold text-offwhite sm:text-xl">{t.contact.imageCaption}</p>
              </div>
              <MapPin aria-hidden="true" className="mb-1 h-5 w-5 shrink-0 text-gold" />
            </div>
          </div>
        </header>

        <div className="mb-12 grid grid-cols-1 border-y border-offwhite/10 sm:grid-cols-3">
          {contactMethods.map(({ icon: Icon, label, value, href }) => {
            const content = (
              <>
                <Icon aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.7} />
                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-offwhite/55">{label}</span>
                  <span dir={href?.startsWith('tel:') || href?.startsWith('mailto:') ? 'ltr' : undefined} className="mt-1 block break-words text-sm font-semibold text-offwhite">
                    {value}
                  </span>
                </span>
              </>
            );

            return href ? (
              <a key={label} href={href} className="flex min-w-0 items-start gap-4 border-b border-offwhite/10 px-2 py-5 transition-colors hover:bg-white/[0.025] sm:border-b-0 sm:px-5 sm:first:ps-0 sm:last:pe-0 sm:[&:not(:last-child)]:border-e sm:[&:not(:last-child)]:border-offwhite/10">
                {content}
              </a>
            ) : (
              <div key={label} className="flex min-w-0 items-start gap-4 border-b border-offwhite/10 px-2 py-5 sm:border-b-0 sm:px-5 sm:first:ps-0 sm:last:pe-0 sm:[&:not(:last-child)]:border-e sm:[&:not(:last-child)]:border-offwhite/10">
                {content}
              </div>
            );
          })}
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
          <aside className="lg:sticky lg:top-28">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold">{t.contact.channelsEyebrow}</p>
            <h2 className="text-2xl font-bold text-offwhite sm:text-3xl">{t.contact.channelsTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-offwhite/65">{t.contact.channelsDescription}</p>

            <a
              href={`https://wa.me/201064410615?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-md bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-darkgreen"
            >
              <MessageCircle aria-hidden="true" className="h-5 w-5" />
              <span>{t.contact.whatsappTitle}</span>
            </a>

            <div className="mt-8 border-s-2 border-gold/50 ps-5">
              <p className="text-sm leading-7 text-offwhite/70">{t.contact.channelNote}</p>
            </div>
          </aside>

          <div className="rounded-md bg-offwhite p-5 text-darkgreen shadow-xl shadow-black/10 sm:p-8 lg:p-10">
            {submitted ? (
              <div aria-live="polite" className="flex min-h-80 flex-col items-start justify-center">
                <CheckCircle2 aria-hidden="true" className="h-12 w-12 text-botanical" strokeWidth={1.6} />
                <h2 className="mt-5 text-2xl font-bold">{t.contact.form.successTitle}</h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-darkgreen/70">{t.contact.form.successMessage}</p>
                {notificationWarning && (
                  <p className="mt-3 max-w-xl border-s-2 border-gold-dark ps-3 text-sm leading-7 text-darkgreen/70">
                    {t.contact.form.notificationWarning}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setNotificationWarning(false);
                  }}
                  className="mt-7 inline-flex min-h-11 items-center justify-center border border-darkgreen/20 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-darkgreen hover:bg-darkgreen/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  {t.contact.form.newInquiry}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" aria-busy={isSubmitting}>
                <div className="mb-7 border-b border-darkgreen/10 pb-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold-dark">{t.contact.form.eyebrow}</p>
                  <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{t.contact.form.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-darkgreen/65">{t.contact.form.intro}</p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-full-name" className="mb-2 block text-xs font-semibold text-darkgreen/80">{t.contact.form.fullName}</label>
                    <input
                      id="contact-full-name"
                      type="text"
                      name="fullName"
                      autoComplete="name"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="min-h-12 w-full border border-darkgreen/15 bg-white px-4 py-3 text-sm text-darkgreen outline-none transition-colors placeholder:text-darkgreen/35 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-company" className="mb-2 block text-xs font-semibold text-darkgreen/80">{t.contact.form.company}</label>
                    <input
                      id="contact-company"
                      type="text"
                      name="company"
                      autoComplete="organization"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      className="min-h-12 w-full border border-darkgreen/15 bg-white px-4 py-3 text-sm text-darkgreen outline-none transition-colors placeholder:text-darkgreen/35 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-2 block text-xs font-semibold text-darkgreen/80">{t.contact.form.email}</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="min-h-12 w-full border border-darkgreen/15 bg-white px-4 py-3 text-sm text-darkgreen outline-none transition-colors placeholder:text-darkgreen/35 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-country" className="mb-2 block text-xs font-semibold text-darkgreen/80">{t.contact.form.country}</label>
                    <input
                      id="contact-country"
                      type="text"
                      name="country"
                      autoComplete="country-name"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      className="min-h-12 w-full border border-darkgreen/15 bg-white px-4 py-3 text-sm text-darkgreen outline-none transition-colors placeholder:text-darkgreen/35 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="mb-2 block text-xs font-semibold text-darkgreen/80">{t.contact.form.message}</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full resize-y border border-darkgreen/15 bg-white px-4 py-3 text-sm leading-6 text-darkgreen outline-none transition-colors placeholder:text-darkgreen/35 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark"
                  />
                </div>

                {submitError && (
                  <p role="alert" className="border-s-2 border-red-700 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-3 bg-gold px-6 py-3 text-sm font-bold text-darkgreen transition-colors hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-dark focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send aria-hidden="true" className="h-4 w-4" />
                  )}
                  <span>{isSubmitting ? t.contact.form.sending : t.contact.form.submit}</span>
                </button>
                <p className="text-center text-xs leading-5 text-darkgreen/55">{t.contact.form.privacyNote}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};