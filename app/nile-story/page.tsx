import type { Metadata } from 'next';
import React from 'react';
import { StructuredData } from '@/components/seo/StructuredData';
import { Navbar } from '@/components/sections/Navbar';
import { NileStorySection } from '@/components/sections/NileStorySection';
import { Footer } from '@/components/sections/Footer';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';

export const metadata: Metadata = {
  title: 'قصة النيل',
  description:
    'اكتشف قصة النيل وراء زراعة الأعشاب الطبية والمكونات النباتية المصرية، من أرض مصر الخصبة إلى الأسواق العالمية.',
  alternates: {
    canonical: '/nile-story',
  },
  openGraph: {
    title: 'قصة النيل | Nilorigen Botanicals',
    description: 'رحلة النيل من أرض مصر إلى أسواق العالم من خلال زراعة الأعشاب الطبية والعطرية والمكونات النباتية.',
    url: 'https://nilorigen.com/nile-story',
    type: 'website',
    images: [{ url: '/og/nile-story.png', width: 1200, height: 630, alt: 'قصة النيل في Nilorigen Botanicals' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'قصة النيل | Nilorigen Botanicals',
    description: 'رحلة النيل من أرض مصر إلى أسواق العالم من خلال زراعة الأعشاب الطبية والعطرية والمكونات النباتية.',
    images: ['/og/nile-story.png'],
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'قصة النيل | Nilorigen Botanicals',
  description:
    'رحلة أرض النيل من الزراعة المصرية الأصيلة إلى التصدير العالمي لأفضل الأعشاب الطبية والعطرية والزيوت الأساسية.',
  author: {
    '@type': 'Organization',
    name: 'Nilorigen Botanicals',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Nilorigen Botanicals',
    logo: {
      '@type': 'ImageObject',
      url: 'https://nilorigen.com/logo/icon.svg',
    },
  },
  mainEntityOfPage: 'https://nilorigen.com/nile-story',
};

export default function NileStoryPage() {
  return (
    <>
      <StructuredData data={articleSchema} />
      <main className="min-h-screen bg-darkgreen text-offwhite selection:bg-gold selection:text-darkgreen relative overflow-x-hidden">
        <Navbar />
        <NileStorySection expandedByDefault standalonePage />
        <FloatingWhatsApp />
        <Footer />
      </main>
    </>
  );
}
