import type { Metadata } from 'next';
import React from 'react';
import { StructuredData } from '@/components/seo/StructuredData';
import { Navbar } from '@/components/sections/Navbar';
import { QualityTimeline } from '@/components/sections/QualityTimeline';
import { Footer } from '@/components/sections/Footer';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';

export const metadata: Metadata = {
  title: 'معايير الجودة',
  description:
    'تعرف على مراحل العناية بالأعشاب والمكونات النباتية ومراجعة المواصفات والتجهيز والتوريد لدى Nilorigen Botanicals.',
  alternates: {
    canonical: '/quality',
  },
  openGraph: {
    title: 'معايير الجودة والتصدير | Nilorigen Botanicals',
    description:
      'مراحل تجهيز ومراجعة مواصفات المنتجات النباتية المصرية وفق متطلبات العملاء والأسواق المستهدفة.',
    url: 'https://nilorigen.com/quality',
    type: 'website',
    images: [{ url: '/og/quality.png', width: 1200, height: 630, alt: 'Quality & Standards by Nilorigen Botanicals' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'معايير الجودة والتصدير | Nilorigen Botanicals',
    description:
      'مراحل تجهيز ومراجعة مواصفات المنتجات النباتية المصرية وفق متطلبات العملاء والأسواق المستهدفة.',
    images: ['/og/quality.png'],
  },
};

const qualitySchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'معايير الجودة والتصدير',
  description:
    'مراحل تجهيز ومراجعة مواصفات المنتجات النباتية المصرية وفق متطلبات العملاء والأسواق المستهدفة.',
  url: 'https://nilorigen.com/quality',
  publisher: {
    '@type': 'Organization',
    name: 'Nilorigen Botanicals',
    url: 'https://nilorigen.com',
  },
};

export default function QualityPage() {
  return (
    <>
      <StructuredData data={qualitySchema} />
      <main className="min-h-screen bg-darkgreen text-offwhite relative overflow-x-hidden">
        <Navbar />
        <div className="pt-24">
          <QualityTimeline standalonePage />
        </div>
        <FloatingWhatsApp />
        <Footer />
      </main>
    </>
  );
}
