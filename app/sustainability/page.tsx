import type { Metadata } from 'next';
import React from 'react';
import { StructuredData } from '@/components/seo/StructuredData';
import { Navbar } from '@/components/sections/Navbar';
import { SustainabilitySection } from '@/components/sections/SustainabilitySection';
import { Footer } from '@/components/sections/Footer';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';

export const metadata: Metadata = {
  title: 'الاستدامة والتوريد المسؤول',
  description:
    'اقرأ عن رؤية Nilorigen Botanicals للاستدامة ومراعاة مصادر النباتات والموارد وسلاسل التوريد النباتية.',
  alternates: {
    canonical: '/sustainability',
  },
  openGraph: {
    title: 'الاستدامة في سلاسل توريد النباتات | Nilorigen Botanicals',
    description:
      'رؤية طويلة الأمد لمراعاة مصدر الأعشاب والنباتات والموارد عبر سلاسل التوريد.',
    url: 'https://nilorigen.com/sustainability',
    type: 'website',
    images: [{ url: '/og/sustainability.png', width: 1200, height: 630, alt: 'Sustainability at Nilorigen Botanicals' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'الاستدامة في سلاسل توريد النباتات | Nilorigen Botanicals',
    description:
      'رؤية طويلة الأمد لمراعاة مصدر الأعشاب والنباتات والموارد عبر سلاسل التوريد.',
    images: ['/og/sustainability.png'],
  },
};

const sustainabilitySchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'الاستدامة والتوريد المسؤول',
  description:
    'رؤية طويلة الأمد لمراعاة مصدر الأعشاب والنباتات والموارد عبر سلاسل التوريد.',
  url: 'https://nilorigen.com/sustainability',
  publisher: {
    '@type': 'Organization',
    name: 'Nilorigen Botanicals',
    url: 'https://nilorigen.com',
  },
};

export default function SustainabilityPage() {
  return (
    <>
      <StructuredData data={sustainabilitySchema} />
      <main className="min-h-screen bg-darkgreen text-offwhite relative overflow-x-hidden">
        <Navbar />
        <div className="pt-24">
          <SustainabilitySection />
        </div>
        <FloatingWhatsApp />
        <Footer />
      </main>
    </>
  );
}
