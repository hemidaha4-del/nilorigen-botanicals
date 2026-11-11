import type { Metadata } from 'next';
import React from 'react';
import { StructuredData } from '@/components/seo/StructuredData';
import { Navbar } from '@/components/sections/Navbar';
import { AboutSection } from '@/components/sections/AboutSection';
import { Footer } from '@/components/sections/Footer';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';

export const metadata: Metadata = {
  title: 'جذورنا المصرية',
  description:
    'تعرف على جذور Nilorigen Botanicals ورؤيتها في تقديم الأعشاب الطبية والعطرية والمكونات النباتية المصرية للأسواق العالمية.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'جذورنا المصرية | Nilorigen Botanicals',
    description:
      'تعرف على إرث الزراعة المصرية ورؤية Nilorigen Botanicals في توريد النباتات والأعشاب للأسواق الدولية.',
    url: 'https://nilorigen.com/about',
    type: 'website',
    images: [{ url: '/og/about.png', width: 1200, height: 630, alt: 'About Nilorigen Botanicals' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'جذورنا المصرية | Nilorigen Botanicals',
    description:
      'تعرف على إرث الزراعة المصرية ورؤية Nilorigen Botanicals في توريد النباتات والأعشاب للأسواق الدولية.',
    images: ['/og/about.png'],
  },
};

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'جذورنا المصرية | Nilorigen Botanicals',
  description:
    'تعرف على إرث الزراعة المصرية ورؤية Nilorigen Botanicals في توريد النباتات والأعشاب للأسواق الدولية.',
  url: 'https://nilorigen.com/about',
  mainEntity: {
    '@type': 'Organization',
    name: 'Nilorigen Botanicals',
    url: 'https://nilorigen.com',
  },
};

export default function AboutPage() {
  return (
    <>
      <StructuredData data={aboutSchema} />
      <main className="min-h-screen bg-darkgreen text-offwhite relative overflow-x-hidden">
        <Navbar />
        <div className="pt-24">
          <AboutSection expanded />
        </div>
        <FloatingWhatsApp />
        <Footer />
      </main>
    </>
  );
}
