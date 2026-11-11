import type { Metadata } from 'next';
import React from 'react';
import { StructuredData } from '@/components/seo/StructuredData';
import { Navbar } from '@/components/sections/Navbar';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/sections/Footer';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';

export const metadata: Metadata = {
  title: 'تواصل معنا',
  description:
    'تواصل مع فريق Nilorigen Botanicals للاستفسار عن الأعشاب الطبية والعطرية والتوابل والمكونات النباتية المصرية للتصدير.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'تواصل مع فريق التصدير | Nilorigen Botanicals',
    description:
      'أرسل متطلباتك من المنتجات النباتية والكميات وبلد الوصول إلى فريق التصدير.',
    url: 'https://nilorigen.com/contact',
    type: 'website',
    images: [{ url: '/og/contact.png', width: 1200, height: 630, alt: 'Contact Nilorigen Botanicals' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'تواصل مع فريق التصدير | Nilorigen Botanicals',
    description:
      'أرسل متطلباتك من المنتجات النباتية والكميات وبلد الوصول إلى فريق التصدير.',
    images: ['/og/contact.png'],
  },
};

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'تواصل مع Nilorigen Botanicals',
  description:
    'تواصل مع فريق Nilorigen Botanicals للاستفسار عن الأعشاب الطبية والعطرية والتوابل والمكونات النباتية المصرية للتصدير.',
  url: 'https://nilorigen.com/contact',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: 'export@nilorigen.com',
    telephone: '+201064410615',
    areaServed: 'Worldwide',
    availableLanguage: ['Arabic', 'English'],
  },
};

export default function ContactPage() {
  return (
    <>
      <StructuredData data={contactSchema} />
      <main className="min-h-screen bg-darkgreen text-offwhite relative overflow-x-hidden">
        <Navbar />
        <div className="pt-24">
          <ContactSection />
        </div>
        <FloatingWhatsApp />
        <Footer />
      </main>
    </>
  );
}
