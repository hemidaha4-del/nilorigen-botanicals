import type { Metadata } from 'next';
import React from 'react';
import { StructuredData } from '@/components/seo/StructuredData';
import { InteractiveBackground } from '@/components/sections/InteractiveBackground';
import { Navbar } from '@/components/sections/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { NileStorySection } from '@/components/sections/NileStorySection';
import { ProductsSection } from '@/components/sections/ProductsSection';

import { QualityTimeline } from '@/components/sections/QualityTimeline';
import { SustainabilitySection } from '@/components/sections/SustainabilitySection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/sections/Footer';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';

export const metadata: Metadata = {
  title: 'Nilorigen Botanicals | أعشاب ونباتات مصرية للتصدير',
  description:
    'مورد ومصدر مصري للأعشاب الطبية والعطرية والتوابل والمكونات النباتية، من أرض النيل إلى الأسواق العالمية.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Nilorigen Botanicals | أعشاب ونباتات مصرية للتصدير',
    description: 'أعشاب طبية وعطرية وتوابل ومكونات نباتية مصرية للتوريد والتصدير إلى الأسواق العالمية.',
    url: 'https://nilorigen.com/',
    type: 'website',
    images: [{ url: '/og/home.png', width: 1200, height: 630, alt: 'Nilorigen Botanicals' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nilorigen Botanicals | أعشاب ونباتات مصرية',
    description: 'أعشاب طبية وعطرية وتوابل ومكونات نباتية من مصر للأسواق العالمية.',
    images: ['/og/home.png'],
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Nilorigen Botanicals',
  url: 'https://nilorigen.com',
  logo: 'https://nilorigen.com/logo/icon.svg',
  description:
    'مورد ومصدر مصري للأعشاب الطبية والعطرية والتوابل والمكونات النباتية للأسواق العالمية.',
  areaServed: 'Worldwide',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'EG',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: 'export@nilorigen.com',
    telephone: '+201064410615',
    areaServed: 'Worldwide',
    availableLanguage: ['Arabic', 'English'],
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Nilorigen Botanicals',
  url: 'https://nilorigen.com',
  description:
    'أعشاب طبية وعطرية وتوابل ومكونات نباتية مصرية من وادي النيل إلى الأسواق العالمية.',
};

export default function Home() {
  return (
    <>
      <StructuredData data={organizationSchema} />
      <StructuredData data={websiteSchema} />
      <main className="min-h-screen bg-darkgreen text-offwhite selection:bg-gold selection:text-darkgreen relative overflow-x-hidden">
        {/* Dynamic Interactive Canvas */}
        <InteractiveBackground />

        {/* Floating Header */}
        <Navbar />

        {/* Hero Section */}
        <HeroSection />

        {/* Company Roots & Split Layout */}
        <AboutSection />

        {/* Botanical Products & Dynamic Filtering */}
        <ProductsSection overviewOnly />

        {/* The Nile Flow Connection */}
        <NileStorySection overviewOnly />

        {/* Field to Export Quality Control */}
        <QualityTimeline overviewOnly />

        <SustainabilitySection overviewOnly />

        {/* Direct B2B Export Contact Desk */}
        <ContactSection overviewOnly />

        {/* Floating WhatsApp Action Button */}
        <FloatingWhatsApp />

        {/* Site Footer */}
        <Footer />
      </main>
    </>
  );
}
